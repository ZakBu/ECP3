import type { WidgetCategory, WidgetContentState, WidgetId } from "../types/widget.types";

export interface WidgetTaxonomyItem {
  widgetId: WidgetId;
  category: WidgetCategory;
  recommendedPlacement: "top" | "center" | "right";
  recommendedStates: WidgetContentState[];
}

export const WIDGET_TAXONOMY: WidgetTaxonomyItem[] = [
  { widgetId: "kpi", category: "analytics", recommendedPlacement: "top", recommendedStates: ["loading", "ready", "empty", "error"] },
  { widgetId: "chart", category: "analytics", recommendedPlacement: "top", recommendedStates: ["loading", "ready", "empty", "error"] },
  { widgetId: "violations", category: "analytics", recommendedPlacement: "top", recommendedStates: ["loading", "ready", "empty", "error", "action-needed"] },
  { widgetId: "funnel", category: "analytics", recommendedPlacement: "center", recommendedStates: ["loading", "ready", "empty", "error"] },
  { widgetId: "top5", category: "analytics", recommendedPlacement: "center", recommendedStates: ["loading", "ready", "empty", "error"] },
  { widgetId: "tasks", category: "operational", recommendedPlacement: "top", recommendedStates: ["loading", "ready", "empty", "error", "action-needed"] },
  { widgetId: "favorites", category: "operational", recommendedPlacement: "center", recommendedStates: ["loading", "ready", "empty", "error"] },
  { widgetId: "documents", category: "operational", recommendedPlacement: "center", recommendedStates: ["loading", "ready", "empty", "error", "action-needed"] },
  { widgetId: "quickactions", category: "operational", recommendedPlacement: "center", recommendedStates: ["loading", "ready", "empty", "error"] },
  { widgetId: "applications", category: "operational", recommendedPlacement: "center", recommendedStates: ["loading", "ready", "empty", "error"] },
  { widgetId: "teamactivity", category: "operational", recommendedPlacement: "center", recommendedStates: ["loading", "ready", "empty", "error"] },
  { widgetId: "calendar", category: "operational", recommendedPlacement: "right", recommendedStates: ["loading", "ready", "empty", "error", "action-needed"] },
  { widgetId: "news", category: "informational", recommendedPlacement: "right", recommendedStates: ["loading", "ready", "empty", "error"] },
  { widgetId: "notifications", category: "informational", recommendedPlacement: "right", recommendedStates: ["loading", "ready", "empty", "error", "action-needed"] },
  { widgetId: "regulations", category: "informational", recommendedPlacement: "right", recommendedStates: ["loading", "ready", "empty", "error"] },
  { widgetId: "directory", category: "informational", recommendedPlacement: "right", recommendedStates: ["loading", "ready", "empty", "error"] },
];
