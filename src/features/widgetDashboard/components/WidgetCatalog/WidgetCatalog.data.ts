import { lazy } from "react";
import type { WidgetDefinition, WidgetId, WidgetDimension, WidgetSize } from "../../types/widget.types";

/** Дублирует `widgetSizing.WIDGET_SIZE_DIMENSIONS` (избегаем циклического импорта registry ↔ sizing). */
const SIZE_DIMENSIONS: Record<WidgetSize, WidgetDimension> = {
  S: { w: 4, h: 4 },
  M: { w: 8, h: 4 },
  L: { w: 8, h: 8 },
  XL: { w: 32, h: 8 },
  compact: { w: 4, h: 4 },
  tall: { w: 4, h: 8 },
  standard: { w: 8, h: 4 },
  square: { w: 8, h: 8 },
  wide: { w: 12, h: 4 },
  wideTall: { w: 12, h: 8 },
  /** 4×2 в логических клетках сетки (между wide и полноширинным xl). */
  wide4x2: { w: 16, h: 8 },
  xwide: { w: 32, h: 4 },
  xl: { w: 32, h: 8 },
} as const;

const DEFAULT_ALLOWED_STATES = ["loading", "ready", "empty", "error"] as const;
const DEFAULT_SIZE_LABELS: Partial<Record<WidgetSize, string>> = {
  compact: "Компактный · 1×1",
  tall: "Высокий · 1×2",
  standard: "Стандартный · 2×1",
  square: "Квадратный · 2×2",
  wide: "Широкий · 3×1",
  wideTall: "Широкий высокий · 3×2",
  wide4x2: "Широкий · 4×2",
  xwide: "На всю ширину · 8×1",
  xl: "Панорамный · 8×2",
};

const KpiCounters = lazy(() => import("../../widgets/KpiCounters/KpiCounters"));
const AnalyticsWidget = lazy(() => import("../../widgets/AnalyticsWidget/AnalyticsWidget"));
const ViolationsWidget = lazy(() => import("../../widgets/ViolationsWidget/ViolationsWidget"));
const FunnelWidget = lazy(() => import("../../widgets/FunnelWidget/FunnelWidget"));
const Top5Widget = lazy(() => import("../../widgets/Top5Widget/Top5Widget"));
const MyTasks = lazy(() => import("../../widgets/MyTasks/MyTasks"));
const QuickActionsWidget = lazy(() => import("../../widgets/QuickActionsWidget/QuickActionsWidget"));
const FavoriteItems = lazy(() => import("../../widgets/FavoriteItems/FavoriteItems"));
const DocumentsWidget = lazy(() => import("../../widgets/DocumentsWidget/DocumentsWidget"));
const ApplicationsWidget = lazy(() => import("../../widgets/ApplicationsWidget/ApplicationsWidget"));
const TeamActivityWidget = lazy(() => import("../../widgets/TeamActivityWidget/TeamActivityWidget"));
const CalendarWidget = lazy(() => import("../../widgets/CalendarWidget/CalendarWidget"));
const NewsWidget = lazy(() => import("../../widgets/NewsWidget/NewsWidget"));
const RegulationsWidget = lazy(() => import("../../widgets/RegulationsWidget/RegulationsWidget"));
const DirectoryWidget = lazy(() => import("../../widgets/DirectoryWidget/DirectoryWidget"));
const AiAssistantWidget = lazy(() => import("../../widgets/AiAssistantWidget/AiAssistantWidget"));
const OivWidget = lazy(() => import("../../widgets/OivWidget/OivWidget"));
const HeatmapWidget = lazy(() => import("../../widgets/HeatmapWidget/HeatmapWidget"));

const getDimensionForSize = (size: WidgetSize) => SIZE_DIMENSIONS[size];
const buildDimensions = (sizes: WidgetSize[]) => sizes.map((size) => getDimensionForSize(size));

/** Все размеры витрины v7 — по умолчанию для информационных/универсальных виджетов. */
const V8_ALL_SIZES: WidgetSize[] = [
  "compact",
  "tall",
  "standard",
  "square",
  "wide",
  "wideTall",
  "wide4x2",
  "xwide",
  "xl",
];

const KPI_LIKE_SIZES: WidgetSize[] = ["compact", "tall", "standard", "square", "wide", "wideTall"];
const V8_BASE_SIZES: WidgetSize[] = ["compact", "tall", "standard", "square", "wide"];

function def(
  id: WidgetId,
  title: string,
  category: WidgetDefinition["category"],
  libraryCategory: WidgetDefinition["libraryCategory"],
  component: WidgetDefinition["component"],
  stateOptions: WidgetDefinition["stateOptions"] = [{ key: "default", label: "Основное" }],
  allowedSizes: WidgetSize[] = V8_ALL_SIZES,
): WidgetDefinition {
  return {
    id,
    title,
    description: title,
    category,
    libraryCategory,
    useCaseGroup: "v8",
    scenarioTags: ["executor", "leader", "analyst"],
    defaultSize: allowedSizes[0],
    defaultDimensions: getDimensionForSize(allowedSizes[0]),
    allowedSizes,
    allowedDimensions: buildDimensions(allowedSizes),
    allowedStates: [...DEFAULT_ALLOWED_STATES],
    stateOptions,
    maxInstances: 1,
    allowedRoles: [],
    component,
  };
}

const BASE_WIDGET_REGISTRY: WidgetDefinition[] = [
  def("kpi", "KPI-счётчики", "analytics", "analytics", KpiCounters, [{ key: "default", label: "Основное" }], KPI_LIKE_SIZES),
  def("chart", "Аналитический график", "analytics", "analytics", AnalyticsWidget, [{ key: "bar", label: "Bar" }, { key: "line", label: "Line" }, { key: "donut", label: "Donut" }], [
    "compact",
    "tall",
    "standard",
    "square",
    "wide",
    "wideTall",
    "xwide",
    "xl",
  ]),
  def("violations", "Нарушения и просрочки", "analytics", "analytics", ViolationsWidget, [{ key: "default", label: "Основное" }], KPI_LIKE_SIZES),
  def("funnel", "Воронка процесса", "analytics", "analytics", FunnelWidget, [{ key: "default", label: "Основное" }], KPI_LIKE_SIZES),
  def("top5", "Топ-5 показателей", "analytics", "analytics", Top5Widget),
  def("tasks", "Мои задачи", "operational", "work", MyTasks, [{ key: "list", label: "Список" }, { key: "kanban", label: "Канбан" }, { key: "gantt", label: "Гантт" }], [
    ...V8_ALL_SIZES,
    "wide4x2",
  ]),
  def("quickactions", "Быстрый доступ", "operational", "work", QuickActionsWidget, [
    { key: "services-a", label: "Пресет A" },
    { key: "services-b", label: "Пресет B" },
    { key: "services-c", label: "Пресет C" },
    { key: "actions", label: "Действия" },
  ]),
  def("favorites", "Избранное", "operational", "work", FavoriteItems, [{ key: "tasks", label: "Задачи" }, { key: "opps", label: "Возможности" }]),
  def("documents", "Мои документы", "operational", "work", DocumentsWidget, [{ key: "recent", label: "Recent" }, { key: "pending", label: "Pending" }, { key: "approval", label: "Approval" }]),
  def(
    "applications",
    "Мои заявления",
    "operational",
    "work",
    ApplicationsWidget,
    [{ key: "active", label: "Активные" }, { key: "archive", label: "Архив" }],
    V8_ALL_SIZES,
  ),
  def("teamactivity", "Активность команды", "operational", "work", TeamActivityWidget),
  def("calendar", "Мой календарь", "operational", "work", CalendarWidget),
  def("news", "Новости", "informational", "info", NewsWidget),
  def("regulations", "Нормативная база", "informational", "info", RegulationsWidget),
  def("directory", "Справочник сотрудников", "informational", "info", DirectoryWidget, [{ key: "search", label: "Поиск" }]),
  def("notifications", "AI-ассистент", "operational", "work", AiAssistantWidget, [{ key: "idle", label: "Ожидание" }, { key: "chat", label: "Диалог" }], V8_ALL_SIZES),
  def("oiv", "Структура Правительства Москвы", "informational", "info", OivWidget, [{ key: "default", label: "Основное" }], V8_ALL_SIZES),
  def("heatmap", "Тепловая карта", "analytics", "analytics", HeatmapWidget, [{ key: "default", label: "Основное" }], [
    "compact",
    "tall",
    "standard",
    "square",
    "wide",
    "wideTall",
    "xwide",
    "xl",
  ]),
];

type GalleryUiConfig = {
  stateOptions: Array<{ key: string; label: string }>;
  sizesByState: Record<string, WidgetSize[]>;
};

/**
 * UI-матрица из эталонной библиотеки v8.
 * Используется только для отображения опций в каталоге/контекстном меню, без агрессивной миграции layout.
 */
const V8_GALLERY_UI_BY_WIDGET: Record<WidgetId, GalleryUiConfig> = {
  kpi: {
    stateOptions: [{ key: "default", label: "Основное" }],
    sizesByState: { default: ["compact", "tall", "square"] },
  },
  chart: {
    stateOptions: [
      { key: "bar", label: "Bar" },
      { key: "line", label: "Line" },
      { key: "donut", label: "Donut" },
    ],
    sizesByState: {
      bar: ["compact", "square", "wideTall"],
      line: ["compact", "square", "wideTall"],
      donut: ["compact", "square", "wideTall"],
    },
  },
  violations: {
    stateOptions: [{ key: "default", label: "Основное" }],
    sizesByState: { default: ["compact", "tall", "square"] },
  },
  funnel: {
    stateOptions: [{ key: "default", label: "Основное" }],
    sizesByState: { default: ["compact", "tall", "square"] },
  },
  top5: {
    stateOptions: [{ key: "default", label: "Основное" }],
    sizesByState: { default: ["tall", "square"] },
  },
  tasks: {
    stateOptions: [
      { key: "list", label: "Список" },
      { key: "kanban", label: "Канбан" },
      { key: "gantt", label: "Гантт" },
    ],
    sizesByState: {
      list: ["standard", "square", "wide", "wide4x2", "xl"],
      kanban: ["standard", "square", "wide", "wide4x2", "xl"],
      gantt: ["standard", "square", "wide", "wide4x2", "xl"],
    },
  },
  quickactions: {
    stateOptions: [
      { key: "services-a", label: "Пресет A" },
      { key: "services-b", label: "Пресет B" },
      { key: "services-c", label: "Пресет C" },
      { key: "actions", label: "Действия" },
    ],
    sizesByState: {
      "services-a": ["compact", "tall", "standard", "square", "wide"],
      "services-b": ["compact", "tall", "standard", "square", "wide"],
      "services-c": ["compact", "tall", "standard", "square", "wide"],
      actions: ["tall", "standard", "square", "wide"],
    },
  },
  favorites: {
    stateOptions: [
      { key: "tasks", label: "Задачи" },
      { key: "opps", label: "Возможности" },
    ],
    sizesByState: { tasks: V8_BASE_SIZES, opps: V8_BASE_SIZES },
  },
  documents: {
    stateOptions: [
      { key: "recent", label: "Recent" },
      { key: "pending", label: "Pending" },
      { key: "approval", label: "Approval" },
    ],
    sizesByState: {
      recent: V8_BASE_SIZES,
      pending: V8_BASE_SIZES,
      approval: V8_BASE_SIZES,
    },
  },
  applications: {
    stateOptions: [
      { key: "active", label: "Активные" },
      { key: "archive", label: "Архив" },
    ],
    sizesByState: {
      active: ["tall", "standard", "square", "wide"],
      archive: ["tall", "standard", "square", "wide"],
    },
  },
  teamactivity: {
    stateOptions: [{ key: "default", label: "Основное" }],
    sizesByState: { default: V8_BASE_SIZES },
  },
  calendar: {
    stateOptions: [{ key: "default", label: "Основное" }],
    sizesByState: { default: V8_BASE_SIZES },
  },
  news: {
    stateOptions: [{ key: "default", label: "Основное" }],
    sizesByState: { default: V8_BASE_SIZES },
  },
  regulations: {
    stateOptions: [{ key: "default", label: "Основное" }],
    sizesByState: { default: V8_BASE_SIZES },
  },
  directory: {
    stateOptions: [{ key: "search", label: "Поиск" }],
    sizesByState: { search: V8_BASE_SIZES },
  },
  notifications: {
    stateOptions: [
      { key: "idle", label: "Ожидание" },
      { key: "chat", label: "Диалог" },
    ],
    sizesByState: {
      idle: ["tall", "standard", "square", "wide"],
      chat: ["tall", "standard", "square", "wide"],
    },
  },
  oiv: {
    stateOptions: [{ key: "default", label: "Основное" }],
    sizesByState: { default: ["tall", "square", "wide", "xwide", "xl"] },
  },
  heatmap: {
    stateOptions: [{ key: "default", label: "Основное" }],
    sizesByState: { default: ["square", "xl"] },
  },
};

export const WIDGET_REGISTRY: WidgetDefinition[] = BASE_WIDGET_REGISTRY.map((widget) => ({
  ...widget,
  galleryCategory: widget.libraryCategory,
  previewComponent: widget.component,
  menuSizeLabels: DEFAULT_SIZE_LABELS,
  defaultGalleryState: widget.stateOptions?.[0]?.key ?? "default",
  supportedStatesBySize: Object.fromEntries(
    widget.allowedSizes.map((size) => [
      size,
      (widget.stateOptions ?? []).map((stateOption) => stateOption.key),
    ]),
  ),
}));

function withCurrentOption(
  options: WidgetSize[],
  currentSize: WidgetSize | undefined,
  allowedSizes: WidgetSize[],
): WidgetSize[] {
  if (!currentSize) return options;
  if (options.includes(currentSize)) return options;
  if (!allowedSizes.includes(currentSize)) return options;
  return [...options, currentSize];
}

export function getV8GalleryStateOptions(
  widget: Pick<WidgetDefinition, "id" | "stateOptions">,
  currentState?: string,
): Array<{ key: string; label: string }> {
  const configured = V8_GALLERY_UI_BY_WIDGET[widget.id];
  const base = configured?.stateOptions ?? widget.stateOptions ?? [{ key: "default", label: "Основное" }];
  if (!currentState || base.some((stateOption) => stateOption.key === currentState)) {
    return base;
  }
  return [...base, { key: currentState, label: `${currentState} (текущий)` }];
}

export function getV8GallerySizeOptions(
  widget: Pick<WidgetDefinition, "id" | "allowedSizes" | "stateOptions" | "defaultGalleryState">,
  state?: string,
  currentSize?: WidgetSize,
): WidgetSize[] {
  const configured = V8_GALLERY_UI_BY_WIDGET[widget.id];
  if (!configured) {
    return withCurrentOption(widget.allowedSizes, currentSize, widget.allowedSizes);
  }

  const defaultState = widget.defaultGalleryState ?? widget.stateOptions?.[0]?.key ?? "default";
  const resolvedState = state && configured.sizesByState[state] ? state : defaultState;
  const configuredSizes =
    configured.sizesByState[resolvedState] ??
    configured.sizesByState.default ??
    widget.allowedSizes;
  const filtered = configuredSizes.filter((size) => widget.allowedSizes.includes(size));

  return withCurrentOption(filtered, currentSize, widget.allowedSizes);
}
