import type { ComponentType, LazyExoticComponent } from "react";
import type { UserRole } from "./role.types";

export type WidgetSize =
  | "S"
  | "M"
  | "L"
  | "XL"
  | "compact"
  | "tall"
  | "standard"
  | "square"
  | "wide"
  | "wideTall"
  | "wide4x2"
  | "xwide"
  | "xl";
export type WidgetCategory = "analytics" | "operational" | "informational";
export type WidgetLibraryCategory = "analytics" | "work" | "info";
export type WidgetContentState =
  | "loading"
  | "ready"
  | "empty"
  | "error"
  | "action-needed";
export type WidgetVariant = "list" | "kanban" | "gantt";
export type WidgetScenarioTag = "leader" | "analyst" | "executor";

export interface WidgetStateOption {
  key: string;
  label: string;
}

export interface WidgetDimension {
  w: number;
  h: number;
}

export type WidgetId =
  | "kpi"
  | "chart"
  | "violations"
  | "funnel"
  | "top5"
  | "tasks"
  | "favorites"
  | "documents"
  | "quickactions"
  | "applications"
  | "teamactivity"
  | "calendar"
  | "news"
  | "notifications"
  | "regulations"
  | "directory"
  | "oiv"
  | "heatmap";

export type WidgetSettings = Record<string, Record<string, string>>;

export interface WidgetMenuAnchor {
  x: number;
  y: number;
}

export interface DraggingLibraryWidget {
  widgetId: WidgetId;
  size: WidgetSize;
  state?: string;
}

export interface WidgetResizePreview {
  instanceId: string;
  size: WidgetSize;
  layoutItem: LayoutItem | null;
  reason?: string | null;
}

export interface WidgetDefinition {
  id: WidgetId;
  title: string;
  description: string;
  category: WidgetCategory;
  libraryCategory: WidgetLibraryCategory;
  useCaseGroup: string;
  scenarioTags: WidgetScenarioTag[];
  defaultSize: WidgetSize;
  defaultDimensions: WidgetDimension;
  allowedSizes: WidgetSize[];
  allowedDimensions: WidgetDimension[];
  allowedStates: WidgetContentState[];
  stateOptions?: WidgetStateOption[];
  variants?: WidgetVariant[];
  stateSizeMap?: Partial<Record<string, WidgetSize[]>>;
  galleryCategory?: string;
  previewComponent?: LazyExoticComponent<ComponentType>;
  menuSizeLabels?: Partial<Record<WidgetSize, string>>;
  defaultGalleryState?: string;
  supportedStatesBySize?: Partial<Record<WidgetSize, string[]>>;
  maxInstances?: number;
  allowedRoles: UserRole[];
  preview?: string;
  component: LazyExoticComponent<ComponentType>;
}

export interface LayoutItem {
  widgetId: WidgetId;
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  state?: string;
  hidden?: boolean;
  deleted?: boolean;
  size?: WidgetSize;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

export interface DashboardMeta {
  schemaVersion: number;
  templateOrigin?: "leader" | "analyst" | "executor" | "custom";
  firstTimeSetup?: boolean;
}

export interface DashboardConfig {
  userId: string;
  role: UserRole;
  layout: LayoutItem[];
  widgetSettings: WidgetSettings;
  schemaVersion: number;
  meta?: DashboardMeta;
  lastModified: string;
}
