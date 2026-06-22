import { cloneTemplateForUser, ROLE_TEMPLATES } from "../config/roleTemplates";
import type { UserRole } from "../types/role.types";
import type { DashboardConfig } from "../types/widget.types";

const mockDb = new Map<string, DashboardConfig>();
const MOCK_STORAGE_PREFIX = "ecp3:dashboard-config:";

function getMockStorageKey(userId: string): string {
  return `${MOCK_STORAGE_PREFIX}${userId}`;
}

function readMockStorage(userId: string): DashboardConfig | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(getMockStorageKey(userId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DashboardConfig;
  } catch {
    window.localStorage.removeItem(getMockStorageKey(userId));
    return null;
  }
}

function writeMockStorage(config: DashboardConfig): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getMockStorageKey(config.userId), JSON.stringify(config));
}

export function getMockDashboardConfig(userId: string): DashboardConfig | null {
  return mockDb.get(userId) ?? readMockStorage(userId);
}

export function saveMockDashboardConfig(config: DashboardConfig): void {
  mockDb.set(config.userId, config);
  writeMockStorage(config);
}

export function resetMockDashboardConfig(userId: string, role: UserRole): DashboardConfig {
  const template = cloneTemplateForUser(role, userId);
  saveMockDashboardConfig(template);
  return template;
}

export function getMockRoleTemplate(role: UserRole, userId: string): DashboardConfig {
  return cloneTemplateForUser(role, userId);
}

export function seedMockDashboardUser(userId: string, role: UserRole): void {
  if (mockDb.has(userId)) return;
  const persisted = readMockStorage(userId);
  if (persisted) {
    saveMockDashboardConfig(persisted);
    return;
  }

  if (role in ROLE_TEMPLATES) {
    const config = cloneTemplateForUser(role, userId);
    saveMockDashboardConfig(config);
  }
}
