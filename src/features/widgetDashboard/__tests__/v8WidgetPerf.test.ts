import { statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import React from "react";
import { WIDGET_REGISTRY } from "../components/WidgetCatalog/WidgetCatalog.data";
import { useDashboardStore } from "../store/dashboardStore";

describe("v8 performance guards", () => {
  it("keeps source v8 kit size under 80KB", () => {
    const filePath = resolve(process.cwd(), "src/features/widgetDashboard/v6/v6WidgetKit.tsx");
    const bytes = statSync(filePath).size;
    expect(bytes).toBeLessThan(80 * 1024);
  });

  it("creates first widget element under 50ms", () => {
    const first = WIDGET_REGISTRY[0];
    const Component = first.component as unknown as React.ComponentType<{ size?: unknown; state?: string }>;
    const t0 = performance.now();
    React.createElement(Component, { size: first.allowedSizes[0], state: first.stateOptions?.[0]?.key });
    const dt = performance.now() - t0;
    expect(dt).toBeLessThan(50);
  });

  it("store edit-add-save cycle under 10ms", () => {
    const s = useDashboardStore.getState();
    const t0 = performance.now();
    s.startEdit();
    s.addWidget({ widgetId: "kpi", i: "perf-kpi", x: 0, y: 0, w: 2, h: 2, size: "compact" });
    s.markSaved();
    const dt = performance.now() - t0;
    expect(dt).toBeLessThan(10);
  });
});

