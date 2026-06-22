import type { LayoutItem } from "../types/widget.types";

export type DashboardPresetId = "executive" | "operator" | "balanced";

interface PresetDefinition {
  id: DashboardPresetId;
  title: string;
  description: string;
  layout: LayoutItem[];
}

/**
 * Раскладки 32 колонки × до ~12 рядов (один экран без вертикальной прокрутки холста при типичной высоте контента ~860px+).
 */
export const DASHBOARD_PRESETS: Record<DashboardPresetId, PresetDefinition> = {
  executive: {
    id: "executive",
    title: "Рабочий стол 1",
    description: "Как в Figma 2131:34011 — возможности + уведомления + Гантт",
    layout: [
      { widgetId: "quickactions", i: "quickactions-0", x: 0, y: 0, w: 32, h: 8, size: "xl", state: "services-a" },
      { widgetId: "favorites", i: "favorites-0", x: 0, y: 8, w: 20, h: 8, size: "wide4x2", state: "opps" },
      { widgetId: "news", i: "news-0", x: 20, y: 8, w: 12, h: 8, size: "wideTall", state: "default" },
      { widgetId: "tasks", i: "tasks-0", x: 0, y: 16, w: 32, h: 4, size: "xwide", state: "gantt" },
      { widgetId: "kpi", i: "kpi-0", x: 0, y: 20, w: 16, h: 4, size: "wide", state: "default" },
      { widgetId: "teamactivity", i: "teamactivity-0", x: 16, y: 20, w: 16, h: 4, size: "wide", state: "default" },
    ],
  },
  operator: {
    id: "operator",
    title: "Рабочий стол 2",
    description: "Как в Figma 2132:35676 — возможности + табличные задачи",
    layout: [
      { widgetId: "quickactions", i: "quickactions-0", x: 0, y: 0, w: 32, h: 8, size: "xl", state: "services-b" },
      { widgetId: "favorites", i: "favorites-0", x: 0, y: 8, w: 32, h: 8, size: "xl", state: "opps" },
      { widgetId: "tasks", i: "tasks-0", x: 0, y: 16, w: 32, h: 8, size: "xl", state: "list" },
      { widgetId: "kpi", i: "kpi-0", x: 0, y: 24, w: 16, h: 4, size: "wide", state: "default" },
      { widgetId: "funnel", i: "funnel-0", x: 16, y: 24, w: 16, h: 4, size: "wide", state: "default" },
    ],
  },
  balanced: {
    id: "balanced",
    title: "Рабочий стол 3",
    description: "Как в Figma 2167:29012 — возможности + канбан задачи",
    layout: [
      { widgetId: "quickactions", i: "quickactions-0", x: 0, y: 0, w: 32, h: 8, size: "xl", state: "services-c" },
      { widgetId: "favorites", i: "favorites-0", x: 0, y: 8, w: 32, h: 8, size: "xl", state: "opps" },
      { widgetId: "tasks", i: "tasks-0", x: 0, y: 16, w: 32, h: 8, size: "xl", state: "kanban" },
      { widgetId: "kpi", i: "kpi-0", x: 0, y: 24, w: 16, h: 4, size: "wide", state: "default" },
      { widgetId: "teamactivity", i: "teamactivity-0", x: 16, y: 24, w: 16, h: 4, size: "wide", state: "default" },
    ],
  },
};
