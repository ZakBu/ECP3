import type { LayoutItem } from "../types/widget.types";

export type DashboardPresetId = "executive" | "operator" | "balanced";

interface PresetDefinition {
  id: DashboardPresetId;
  title: string;
  description: string;
  layout: LayoutItem[];
}

/**
 * Раскладки 32 колонки. Координаты подобраны рядами без горизонтальных дыр:
 * 32, 16+16, 12+8+12. Так дашборд ровно заполняет 16:9-экраны и не оставляет пустую правую полосу.
 */
export const DASHBOARD_PRESETS: Record<DashboardPresetId, PresetDefinition> = {
  executive: {
    id: "executive",
    title: "Рабочий стол 1",
    description: "Плотный 16:9-макет: быстрый доступ + избранное + новости + задачи",
    layout: [
      { widgetId: "quickactions", i: "quickactions-0", x: 0, y: 0, w: 32, h: 4, size: "xwide", state: "services-a" },
      { widgetId: "favorites", i: "favorites-0", x: 0, y: 4, w: 16, h: 8, size: "wide4x2", state: "opps" },
      { widgetId: "news", i: "news-0", x: 16, y: 4, w: 16, h: 8, size: "wide4x2", state: "default" },
      { widgetId: "tasks", i: "tasks-0", x: 0, y: 12, w: 12, h: 4, size: "wide", state: "gantt" },
      { widgetId: "kpi", i: "kpi-0", x: 12, y: 12, w: 8, h: 4, size: "standard", state: "default" },
      { widgetId: "teamactivity", i: "teamactivity-0", x: 20, y: 12, w: 12, h: 4, size: "wide", state: "default" },
    ],
  },
  operator: {
    id: "operator",
    title: "Рабочий стол 2",
    description: "Плотный 16:9-макет для исполнителя",
    layout: [
      { widgetId: "quickactions", i: "quickactions-0", x: 0, y: 0, w: 32, h: 4, size: "xwide", state: "services-b" },
      { widgetId: "favorites", i: "favorites-0", x: 0, y: 4, w: 16, h: 8, size: "wide4x2", state: "opps" },
      { widgetId: "tasks", i: "tasks-0", x: 16, y: 4, w: 16, h: 8, size: "wide4x2", state: "list" },
      { widgetId: "kpi", i: "kpi-0", x: 0, y: 12, w: 8, h: 4, size: "standard", state: "default" },
      { widgetId: "funnel", i: "funnel-0", x: 8, y: 12, w: 8, h: 4, size: "standard", state: "default" },
      { widgetId: "news", i: "news-0", x: 16, y: 12, w: 8, h: 4, size: "standard", state: "default" },
      { widgetId: "teamactivity", i: "teamactivity-0", x: 24, y: 12, w: 8, h: 4, size: "standard", state: "default" },
    ],
  },
  balanced: {
    id: "balanced",
    title: "Рабочий стол 3",
    description: "Плотный 16:9-макет для аналитика",
    layout: [
      { widgetId: "quickactions", i: "quickactions-0", x: 0, y: 0, w: 32, h: 4, size: "xwide", state: "services-c" },
      { widgetId: "favorites", i: "favorites-0", x: 0, y: 4, w: 16, h: 8, size: "wide4x2", state: "opps" },
      { widgetId: "tasks", i: "tasks-0", x: 16, y: 4, w: 16, h: 8, size: "wide4x2", state: "kanban" },
      { widgetId: "kpi", i: "kpi-0", x: 0, y: 12, w: 8, h: 4, size: "standard", state: "default" },
      { widgetId: "teamactivity", i: "teamactivity-0", x: 8, y: 12, w: 8, h: 4, size: "standard", state: "default" },
      { widgetId: "chart", i: "chart-0", x: 16, y: 12, w: 8, h: 4, size: "standard", state: "bar" },
      { widgetId: "funnel", i: "funnel-0", x: 24, y: 12, w: 8, h: 4, size: "standard", state: "default" },
    ],
  },
};
