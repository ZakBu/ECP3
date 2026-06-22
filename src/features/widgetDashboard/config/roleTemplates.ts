import type { DashboardConfig } from "../types/widget.types";
import type { UserRole } from "../types/role.types";
import { DASHBOARD_PRESETS } from "./dashboardPresets";
import { normalizeLayout } from "./widgetSizing";

const now = () => new Date().toISOString();

export const ROLE_TEMPLATES: Record<UserRole, DashboardConfig> = {
  specialist: {
    userId: "",
    role: "specialist",
    schemaVersion: 2,
    meta: { schemaVersion: 2, templateOrigin: "executor", firstTimeSetup: true },
    lastModified: now(),
    widgetSettings: { tasks: { activeView: "list" } },
    layout: normalizeLayout(DASHBOARD_PRESETS.operator.layout),
  },
  head: {
    userId: "",
    role: "head",
    schemaVersion: 2,
    meta: { schemaVersion: 2, templateOrigin: "leader", firstTimeSetup: true },
    lastModified: now(),
    widgetSettings: { tasks: { activeView: "list" } },
    layout: normalizeLayout(DASHBOARD_PRESETS.executive.layout),
  },
  admin: {
    userId: "",
    role: "admin",
    schemaVersion: 2,
    meta: { schemaVersion: 2, templateOrigin: "analyst", firstTimeSetup: true },
    lastModified: now(),
    widgetSettings: { tasks: { activeView: "list" } },
    layout: normalizeLayout(DASHBOARD_PRESETS.balanced.layout),
  },
  reader: {
    userId: "",
    role: "reader",
    schemaVersion: 2,
    meta: { schemaVersion: 2, templateOrigin: "analyst", firstTimeSetup: true },
    lastModified: now(),
    widgetSettings: {},
    layout: normalizeLayout([
      { widgetId: "regulations", i: "regulations-0", x: 0, y: 0, w: 8, h: 4, size: "standard" },
      { widgetId: "news", i: "news-0", x: 8, y: 0, w: 12, h: 4, size: "wide" },
      { widgetId: "notifications", i: "notifications-0", x: 20, y: 0, w: 12, h: 4, size: "wide" },
      { widgetId: "calendar", i: "calendar-0", x: 0, y: 4, w: 4, h: 4, size: "compact" },
      { widgetId: "quickactions", i: "quickactions-0", x: 4, y: 4, w: 12, h: 4, size: "wide" },
      { widgetId: "directory", i: "directory-0", x: 0, y: 8, w: 32, h: 4, size: "xwide" },
    ]),
  },
};

export const cloneTemplateForUser = (
  role: UserRole,
  userId: string,
): DashboardConfig => ({
  ...ROLE_TEMPLATES[role],
  userId,
  lastModified: now(),
  layout: ROLE_TEMPLATES[role].layout.map((item) => ({ ...item })),
  widgetSettings: structuredClone(ROLE_TEMPLATES[role].widgetSettings),
});
