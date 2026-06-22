import type { UserRole } from "../types/role.types";
import type { DashboardConfig } from "../types/widget.types";
import {
  fetchDashboardConfig,
  fetchRoleTemplate,
  resetDashboardConfigOnServer,
  updateDashboardConfig,
} from "./dashboardApiClient";
import {
  getMockDashboardConfig,
  getMockRoleTemplate,
  resetMockDashboardConfig,
  saveMockDashboardConfig,
  seedMockDashboardUser,
} from "./dashboardMockRepository";

const CURRENT_SCHEMA_VERSION = 3;
const USE_MOCK = import.meta.env.VITE_DASHBOARD_MOCK !== "false";

const LEGACY_SIZE_MAP: Record<string, string> = {
  S: "compact",
  M: "standard",
  L: "square",
  XL: "xwide",
};

export function migrateConfigIfNeeded(config: DashboardConfig): DashboardConfig {
  if (config.schemaVersion < CURRENT_SCHEMA_VERSION && config.userId === "demo-user-v6") {
    const template = getMockRoleTemplate(config.role, config.userId);
    return {
      ...template,
      widgetSettings: config.widgetSettings ?? template.widgetSettings,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      meta: {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        templateOrigin: template.meta?.templateOrigin ?? "custom",
        firstTimeSetup: false,
      },
    };
  }

  const migratedLayout = (config.layout ?? []).map((item) => {
    const mappedSize = item.size ? (LEGACY_SIZE_MAP[item.size] ?? item.size) : item.size;
    return { ...item, size: mappedSize as typeof item.size };
  });

  if (config.schemaVersion === CURRENT_SCHEMA_VERSION && config.meta && migratedLayout === config.layout) return config;

  return {
    ...config,
    layout: migratedLayout,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    widgetSettings: config.widgetSettings ?? {},
    meta: {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      templateOrigin: config.meta?.templateOrigin ?? "custom",
      firstTimeSetup: config.meta?.firstTimeSetup ?? false,
    },
  };
}

export async function getDashboardConfig(userId: string): Promise<DashboardConfig | null> {
  if (USE_MOCK) {
    const data = getMockDashboardConfig(userId);
    if (!data) return null;
    const migrated = migrateConfigIfNeeded(data);
    saveMockDashboardConfig(migrated);
    return migrated;
  }

  const data = await fetchDashboardConfig();
  return data ? migrateConfigIfNeeded(data) : null;
}

export async function saveDashboardConfig(config: DashboardConfig): Promise<void> {
  if (USE_MOCK) {
    const next = {
      ...config,
      lastModified: new Date().toISOString(),
      schemaVersion: CURRENT_SCHEMA_VERSION,
    };
    saveMockDashboardConfig(next);
    return;
  }

  await updateDashboardConfig(config);
}

export async function resetDashboardConfig(userId: string, role: UserRole): Promise<DashboardConfig> {
  if (USE_MOCK) {
    return resetMockDashboardConfig(userId, role);
  }

  await resetDashboardConfigOnServer();
  const data = await fetchRoleTemplate(role);
  return migrateConfigIfNeeded({ ...data, userId, role });
}

export async function getRoleTemplate(role: UserRole, userId: string): Promise<DashboardConfig> {
  if (USE_MOCK) {
    return getMockRoleTemplate(role, userId);
  }

  const data = await fetchRoleTemplate(role);
  return migrateConfigIfNeeded({ ...data, userId, role });
}

export function seedMockUser(userId: string, role: UserRole): void {
  if (!USE_MOCK) return;
  seedMockDashboardUser(userId, role);
}
