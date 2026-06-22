import { beforeEach, describe, expect, it } from "vitest";
import { setDashboardLayoutMaxRows } from "../config/widgetSizing";
import { useDashboardStore } from "../store/dashboardStore";
import type { DashboardConfig } from "../types/widget.types";

const testConfig: DashboardConfig = {
  userId: "store-smoke-user",
  role: "head",
  layout: [
    { widgetId: "kpi", i: "kpi-1", x: 0, y: 0, w: 4, h: 4, size: "compact" },
  ],
  widgetSettings: {},
  schemaVersion: 2,
  meta: {
    schemaVersion: 2,
    firstTimeSetup: true,
    templateOrigin: "leader",
  },
  lastModified: new Date().toISOString(),
};

describe("dashboardStore smoke contracts", () => {
  beforeEach(() => {
    setDashboardLayoutMaxRows(32);
    useDashboardStore.setState({
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
    });
  });

  it("starts edit mode with draft copy and marks saved back to persisted", () => {
    const store = useDashboardStore.getState();
    store.setConfig(testConfig);
    store.startEdit();

    const withEdit = useDashboardStore.getState();
    expect(withEdit.isEditing).toBe(true);
    expect(withEdit.draftLayout).toEqual(withEdit.persistedLayout);

    store.addWidget({
      widgetId: "chart",
      i: "chart-1",
      x: 4,
      y: 0,
      w: 8,
      h: 4,
      size: "standard",
    });
    expect(useDashboardStore.getState().isDirty).toBe(true);

    store.markSaved();
    const saved = useDashboardStore.getState();
    expect(saved.isEditing).toBe(false);
    expect(saved.isDirty).toBe(false);
    expect(saved.persistedLayout.some((item) => item.i === "chart-1")).toBe(true);
  });

  it("updates widget instance state in draft while editing", () => {
    const store = useDashboardStore.getState();
    store.setConfig(testConfig);
    store.startEdit();
    store.setWidgetInstanceState("kpi-1", "kanban");
    const next = useDashboardStore.getState();
    expect(next.isDirty).toBe(true);
    expect(next.draftLayout.find((item) => item.i === "kpi-1")?.state).toBe("kanban");
    expect(next.persistedLayout.find((item) => item.i === "kpi-1")?.state).not.toBe("kanban");
  });

  it("updates widget instance state on persisted layout when not editing", () => {
    const store = useDashboardStore.getState();
    store.setConfig(testConfig);
    store.setWidgetInstanceState("kpi-1", "gantt");
    const next = useDashboardStore.getState();
    expect(next.persistedLayout.find((item) => item.i === "kpi-1")?.state).toBe("gantt");
    expect(next.draftLayout.find((item) => item.i === "kpi-1")?.state).toBe("gantt");
  });
});
