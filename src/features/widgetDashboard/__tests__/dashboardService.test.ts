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

    expect(migrated.schemaVersion).toBe(2);
    expect(migrated.meta).toEqual({
      schemaVersion: 2,
      templateOrigin: "custom",
      firstTimeSetup: false,
    });
  });

  it("saves and reads config in mock mode", async () => {
    const userId = "smoke-user-1";
    await saveDashboardConfig({ ...baseConfig, userId, schemaVersion: 2 });

    const config = await getDashboardConfig(userId);
    expect(config).not.toBeNull();
    expect(config?.userId).toBe(userId);
    expect(config?.schemaVersion).toBe(2);
  });
});
