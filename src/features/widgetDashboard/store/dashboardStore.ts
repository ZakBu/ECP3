import { create } from "zustand";
import { DASHBOARD_PRESETS, type DashboardPresetId } from "../config/dashboardPresets";
import type { UserRole } from "../types/role.types";
import type {
  DashboardConfig,
  LayoutItem,
  WidgetId,
  WidgetSettings,
} from "../types/widget.types";
import {
  findFirstFit,
  isLayoutValid,
  normalizeLayout,
  normalizeLayoutItem,
} from "../config/widgetSizing";

interface DashboardStore {
  userId: string;
  role: UserRole;
  persistedLayout: LayoutItem[];
  persistedWidgetSettings: WidgetSettings;
  draftLayout: LayoutItem[];
  draftWidgetSettings: WidgetSettings;
  widgetSettings: WidgetSettings;
  schemaVersion: number;
  templateOrigin?: "leader" | "analyst" | "executor" | "custom";
  firstTimeSetup: boolean;
  isEditing: boolean;
  isDirty: boolean;
  isCatalogOpen: boolean;
  validationMessage: string | null;
  timeContext: "morning" | "day" | "evening";
  getActiveLayout: () => LayoutItem[];
  setConfig: (config: DashboardConfig) => void;
  setEditMode: (enabled: boolean) => void;
  startEdit: () => void;
  cancelEdit: () => void;
  setCatalogOpen: (open: boolean) => void;
  refreshTimeContext: () => void;
  setLayout: (layout: LayoutItem[]) => void;
  setWidgetInstanceState: (instanceId: string, nextState: string) => void;
  addWidget: (item: LayoutItem) => void;
  hideWidget: (instanceId: string) => void;
  restoreWidgetInstance: (instanceId: string) => void;
  restoreWidget: (widgetId: WidgetId) => void;
  deleteWidget: (instanceId: string) => void;
  setWidgetSetting: (widgetId: WidgetId, key: string, value: string) => void;
  applyTemplateToDraft: (presetId: DashboardPresetId) => void;
  resetDraftToDefault: () => void;
  markSaved: () => void;
  toConfig: () => DashboardConfig;
  setValidationMessage: (value: string | null) => void;
}

const cloneLayout = (layout: LayoutItem[]) => layout.map((item) => ({ ...item }));

const getVisibleLayout = (layout: LayoutItem[]) =>
  layout.filter((item) => !item.hidden && !item.deleted);

function resolveRestoredLayoutItem(
  target: LayoutItem,
  draftLayout: LayoutItem[],
): LayoutItem | null {
  const visibleWithoutTarget = draftLayout.filter(
    (item) => item.i !== target.i && !item.hidden && !item.deleted,
  );
  const normalized = normalizeLayoutItem({ ...target, hidden: false, deleted: false });

  if (isLayoutValid([...visibleWithoutTarget, normalized])) {
    return normalized;
  }

  const slot = findFirstFit(visibleWithoutTarget, normalized.w, normalized.h);
  if (!slot) {
    return null;
  }

  return { ...normalized, x: slot.x, y: slot.y };
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  userId: "",
  role: "specialist",
  persistedLayout: [],
  persistedWidgetSettings: {},
  draftLayout: [],
  draftWidgetSettings: {},
  widgetSettings: {},
  schemaVersion: 2,
  templateOrigin: "custom",
  firstTimeSetup: true,
  isEditing: false,
  isDirty: false,
  isCatalogOpen: false,
  validationMessage: null,
  timeContext: "day",
  getActiveLayout: () => {
    const state = get();
    return getVisibleLayout(state.isEditing ? state.draftLayout : state.persistedLayout);
  },
  setConfig: (config) =>
    set((state) => {
      const normalizedLayout = normalizeLayout(config.layout);
      return {
        userId: config.userId,
        role: config.role,
        persistedLayout: normalizedLayout,
        persistedWidgetSettings: config.widgetSettings ?? {},
        draftLayout: state.isEditing ? state.draftLayout : normalizedLayout,
        draftWidgetSettings: state.isEditing
          ? state.draftWidgetSettings
          : config.widgetSettings ?? {},
        widgetSettings: state.isEditing
          ? state.draftWidgetSettings
          : config.widgetSettings ?? {},
        schemaVersion: config.schemaVersion,
        templateOrigin: config.meta?.templateOrigin ?? "custom",
        firstTimeSetup: config.meta?.firstTimeSetup ?? false,
        isDirty: false,
        validationMessage: null,
      };
    }),
  setEditMode: (enabled) => set({ isEditing: enabled }),
  startEdit: () =>
    set((state) => ({
      isEditing: true,
      draftLayout: cloneLayout(state.persistedLayout),
      draftWidgetSettings: structuredClone(state.persistedWidgetSettings),
      widgetSettings: structuredClone(state.persistedWidgetSettings),
      isDirty: false,
      validationMessage: null,
      isCatalogOpen: false,
    })),
  cancelEdit: () =>
    set((state) => ({
      isEditing: false,
      draftLayout: cloneLayout(state.persistedLayout),
      draftWidgetSettings: structuredClone(state.persistedWidgetSettings),
      widgetSettings: structuredClone(state.persistedWidgetSettings),
      isDirty: false,
      validationMessage: null,
      isCatalogOpen: false,
    })),
  setCatalogOpen: (open) => set({ isCatalogOpen: open }),
  refreshTimeContext: () => {
    const hour = new Date().getHours();
    const next = hour < 10 ? "morning" : hour < 16 ? "day" : "evening";
    set({ timeContext: next });
  },
  setLayout: (layout) =>
    set((state) => {
      const normalizedVisible = normalizeLayout(layout);
      if (!isLayoutValid(normalizedVisible)) {
        return { validationMessage: "Некорректное размещение виджетов" };
      }

      if (state.isEditing) {
        const hiddenOrDeleted = state.draftLayout.filter((item) => item.hidden || item.deleted);
        return {
          draftLayout: [...normalizedVisible, ...hiddenOrDeleted],
          isDirty: true,
          validationMessage: null,
        };
      }

      return { persistedLayout: normalizedVisible, validationMessage: null };
    }),
  setWidgetInstanceState: (instanceId, nextState) =>
    set((state) => {
      const mapItem = (item: LayoutItem) =>
        item.i === instanceId ? { ...item, state: nextState } : item;

      if (state.isEditing) {
        return {
          draftLayout: state.draftLayout.map(mapItem),
          isDirty: true,
          validationMessage: null,
        };
      }

      return {
        persistedLayout: state.persistedLayout.map(mapItem),
        draftLayout: state.draftLayout.map(mapItem),
        validationMessage: null,
      };
    }),
  addWidget: (item) =>
    set((state) => {
      const normalizedItem = normalizeLayoutItem(item);

      if (state.isEditing) {
        const currentVisible = getVisibleLayout(state.draftLayout);
        const nextVisible = [...currentVisible, normalizedItem];
        if (!isLayoutValid(nextVisible)) {
          return { validationMessage: "Некорректное размещение виджетов" };
        }

        const hiddenOrDeleted = state.draftLayout.filter((entry) => entry.hidden || entry.deleted);
        return {
          draftLayout: [...nextVisible, ...hiddenOrDeleted],
          isDirty: true,
          validationMessage: null,
        };
      }

      const nextPersisted = [...getVisibleLayout(state.persistedLayout), normalizedItem];
      if (!isLayoutValid(nextPersisted)) {
        return { validationMessage: "Некорректное размещение виджетов" };
      }

      return { persistedLayout: nextPersisted, validationMessage: null };
    }),
  hideWidget: (instanceId) =>
    set((state) => ({
      draftLayout: state.draftLayout.map((item) =>
        item.i === instanceId ? { ...item, hidden: true, deleted: false } : item,
      ),
      isDirty: true,
      validationMessage: null,
    })),
  restoreWidgetInstance: (instanceId) =>
    set((state) => {
      const target = state.draftLayout.find((item) => item.i === instanceId);
      if (!target) return state;

      const restored = resolveRestoredLayoutItem(target, state.draftLayout);
      if (!restored) {
        return { validationMessage: "Нет места для восстановления виджета" };
      }

      return {
        draftLayout: state.draftLayout.map((item) =>
          item.i === instanceId ? restored : item,
        ),
        isDirty: true,
        validationMessage: null,
      };
    }),
  restoreWidget: (widgetId) =>
    set((state) => {
      const target = state.draftLayout.find(
        (item) => item.widgetId === widgetId && (item.hidden || item.deleted),
      );
      if (!target) return state;

      const restored = resolveRestoredLayoutItem(target, state.draftLayout);
      if (!restored) {
        return { validationMessage: "Нет места для восстановления виджета" };
      }

      return {
        draftLayout: state.draftLayout.map((item) =>
          item.i === target.i ? restored : item,
        ),
        isDirty: true,
        validationMessage: null,
      };
    }),
  deleteWidget: (instanceId) =>
    set((state) => ({
      draftLayout: state.draftLayout.map((item) =>
        item.i === instanceId ? { ...item, deleted: true, hidden: false } : item,
      ),
      isDirty: true,
      validationMessage: null,
    })),
  setWidgetSetting: (widgetId, key, value) =>
    set((state) => {
      const nextSettings = {
        ...state.draftWidgetSettings,
        [widgetId]: {
          ...(state.draftWidgetSettings[widgetId] ?? {}),
          [key]: value,
        },
      };
      return {
        draftWidgetSettings: nextSettings,
        widgetSettings: nextSettings,
        isDirty: true,
      };
    }),
  applyTemplateToDraft: (presetId) =>
    set(() => ({
      draftLayout: normalizeLayout(DASHBOARD_PRESETS[presetId].layout),
      isDirty: true,
      firstTimeSetup: false,
      templateOrigin:
        presetId === "executive"
          ? "leader"
          : presetId === "operator"
            ? "executor"
            : "analyst",
      validationMessage: null,
    })),
  resetDraftToDefault: () =>
    set((state) => {
      const preset =
        state.role === "head"
          ? "executive"
          : state.role === "specialist"
            ? "operator"
            : "balanced";
      return {
        draftLayout: normalizeLayout(DASHBOARD_PRESETS[preset].layout),
        isDirty: true,
        firstTimeSetup: false,
        validationMessage: null,
      };
    }),
  markSaved: () =>
    set((state) => ({
      persistedLayout: cloneLayout(state.draftLayout),
      persistedWidgetSettings: structuredClone(state.draftWidgetSettings),
      widgetSettings: structuredClone(state.draftWidgetSettings),
      isDirty: false,
      isEditing: false,
      firstTimeSetup: false,
      isCatalogOpen: false,
    })),
  toConfig: () => {
    const state = get();
    return {
      userId: state.userId,
      role: state.role,
      layout: state.draftLayout,
      widgetSettings: state.draftWidgetSettings,
      schemaVersion: state.schemaVersion,
      meta: {
        schemaVersion: state.schemaVersion,
        templateOrigin: state.templateOrigin ?? "custom",
        firstTimeSetup: state.firstTimeSetup,
      },
      lastModified: new Date().toISOString(),
    };
  },
  setValidationMessage: (value) => set({ validationMessage: value }),
}));
