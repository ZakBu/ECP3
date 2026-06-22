import { describe, expect, it } from "vitest";
import { getDashboardConfig, migrateConfigIfNeeded, saveDashboardConfig } from "../api/dashboardService";
import type { DashboardConfig } from "../types/widget.types";

const baseConfig: DashboardConfig = {
  userId: "test-user",
  role: "head",
  layout: [],
  widgetSettings: {},
  schemaVersion: 1,
  lastModified: new Date().toISOString(),
};

describe("dashboardService smoke contracts", () => {
  it("migrates config to current schema with meta defaults", () => {
    const migrated = migrateConfigIfNeeded(baseConfig);

    expect(migrated.schemaVersion).toBe(3);
    expect(migrated.meta).toEqual({
      schemaVersion: 3,
      templateOrigin: "custom",
      firstTimeSetup: false,
    });
  });

  it("saves and reads config in mock mode", async () => {
    const userId = "smoke-user-1";
    await saveDashboardConfig({ ...baseConfig, userId, schemaVersion: 3 });

    const config = await getDashboardConfig(userId);
    expect(config).not.toBeNull();
    expect(config?.userId).toBe(userId);
    expect(config?.schemaVersion).toBe(3);
  });

  it("refreshes the demo user onto the optimized 16:9 layout", () => {
    const migrated = migrateConfigIfNeeded({
      ...baseConfig,
      userId: "demo-user-v6",
      role: "head",
      schemaVersion: 2,
    });

    expect(migrated.layout).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ widgetId: "quickactions", x: 0, y: 0, w: 32, h: 4 }),
        expect.objectContaining({ widgetId: "favorites", x: 0, y: 4, w: 16, h: 8 }),
        expect.objectContaining({ widgetId: "news", x: 16, y: 4, w: 16, h: 8 }),
        expect.objectContaining({ widgetId: "tasks", x: 0, y: 12, w: 12, h: 4 }),
        expect.objectContaining({ widgetId: "kpi", x: 12, y: 12, w: 8, h: 4 }),
        expect.objectContaining({ widgetId: "teamactivity", x: 20, y: 12, w: 12, h: 4 }),
      ]),
    );
  });
});
