import { WIDGET_REGISTRY } from "../components/WidgetCatalog/WidgetCatalog.data";
import type {
  LayoutItem,
  WidgetDefinition,
  WidgetDimension,
  WidgetId,
  WidgetSize,
} from "../types/widget.types";

const dimensionKey = (value: WidgetDimension): string => `${value.w}x${value.h}`;

/** Витрина v7: логическая ячейка 272px, адаптированный зазор 16px; мелкая сетка 4×4 на логическую ячейку. Ширина дашборда — 8 логических колонок → 32 мелких. */
export const V7_UNIT_PX = 272;
export const V7_GAP_PX = 16;
export const DASHBOARD_GRID_COLS = 32;
/** Легаси-верхняя граница; фактическая высота сетки задаётся высотой экрана (`getDashboardLayoutMaxRows`). */
export const DASHBOARD_GRID_ROWS = 32;
export const DASHBOARD_GRID_MARGIN_X = V7_GAP_PX;
export const DASHBOARD_GRID_MARGIN_Y = V7_GAP_PX;

/** Число строк сетки по высоте рабочей области (без вертикальной прокрутки холста). */
let dashboardLayoutMaxRows = DASHBOARD_GRID_ROWS;

export function setDashboardLayoutMaxRows(n: number): void {
  dashboardLayoutMaxRows = Math.max(4, Math.floor(n));
}

export function getDashboardLayoutMaxRows(): number {
  return dashboardLayoutMaxRows;
}

/** Сколько рядов помещается в `viewportContentHeightPx` при текущем `rowHeight` и зазоре. */
export function computeDashboardMaxRowsFromHeight(viewportContentHeightPx: number): number {
  const { rowHeight } = getDashboardCellMetrics();
  const g = DASHBOARD_GRID_MARGIN_Y;
  if (!Number.isFinite(viewportContentHeightPx) || viewportContentHeightPx < rowHeight) {
    return 4;
  }
  return Math.max(4, Math.floor((viewportContentHeightPx + g) / (rowHeight + g)));
}

/**
 * Пиксели одной мелкой ячейки: 4 колонки × 4 ряда + зазоры дают ровно витрину v7 272×272 для compact.
 * Формула: 4·cell + 3·gap = V7_UNIT_PX (как в getCardStyle compact в widgetLibraryV7Widgets).
 */
export const V7_FINE_CELL_PX = (V7_UNIT_PX - 3 * V7_GAP_PX) / 4;

/**
 * Квадратная сетка: colWidth === rowHeight.
 *
 * Высоту строки нужно делить на число рядов, которое реально заполняет экран при ячейке от ширины (`sW`),
 * а не на `max(12, layoutBottom)` — иначе при «низком» макете ячейка искусственно сжимается,
 * 1×1 перестаёт совпадать с макетом и KPI не влезает.
 */
export function computeSquareDashboardMetrics(options: {
  canvasWidthPx: number;
  canvasHeightPx: number;
  layoutRowExtent: number;
  minContentRows?: number;
  /** Мягкий минимум стороны квадрата (px), если влезает во вьюпорт при текущем числе рядов. */
  minSquareCellPx?: number;
}): { cellSize: number; gridRowCount: number; gridPixelWidth: number; gridPixelHeight: number } {
  const minContentRows = Math.max(4, Math.floor(options.minContentRows ?? 8));
  const layoutBottom = Math.max(0, Math.floor(options.layoutRowExtent));
  const R_layout = Math.max(minContentRows, layoutBottom);
  const minSquare = Math.max(1, options.minSquareCellPx ?? Math.min(V7_FINE_CELL_PX, 52));

  const W = Math.max(120, options.canvasWidthPx);
  const H = Math.max(120, options.canvasHeightPx);
  const cols = DASHBOARD_GRID_COLS;
  const mx = DASHBOARD_GRID_MARGIN_X;
  const my = DASHBOARD_GRID_MARGIN_Y;

  const sW = (W - mx * (cols - 1)) / cols;
  const rowsFitIfWidthLimited = Math.max(4, Math.floor((H + my) / (sW + my)));
  const R_target = Math.max(R_layout, rowsFitIfWidthLimited);
  const sH = (H - my * (R_target - 1)) / R_target;
  let cellSize = Math.max(1, Math.min(sW, sH));

  const rowsThatFillViewport = Math.max(4, Math.floor((H + my) / (cellSize + my)));
  let gridRowCount = Math.max(R_layout, rowsThatFillViewport);

  const maxRowHForCount = (H - my * (gridRowCount - 1)) / gridRowCount;
  if (cellSize < minSquare && minSquare <= sW && minSquare <= maxRowHForCount) {
    cellSize = minSquare;
    gridRowCount = Math.max(R_layout, Math.max(4, Math.floor((H + my) / (cellSize + my))));
  }

  const gridPixelWidth = cols * cellSize + mx * (cols - 1);
  const gridPixelHeight = gridRowCount * cellSize + (gridRowCount - 1) * my;

  return { cellSize, gridRowCount, gridPixelWidth, gridPixelHeight };
}

/**
 * Квадратная мелкая ячейка фиксированного размера v7 (не растягивается на всю ширину контейнера).
 */
export function getDashboardCellMetrics(): { colWidth: number; rowHeight: number } {
  return { colWidth: V7_FINE_CELL_PX, rowHeight: V7_FINE_CELL_PX };
}

/** Ширина холста дашборда: все мелкие колонки + зазоры (8× compact в ряд). */
export function getDashboardGridPixelWidth(): number {
  return (
    DASHBOARD_GRID_COLS * V7_FINE_CELL_PX +
    (DASHBOARD_GRID_COLS - 1) * DASHBOARD_GRID_MARGIN_X
  );
}

/** Ширина одной мелкой колонки при заданной ширине холста (как в `DashboardGrid`). */
export function getDashboardColWidthForCanvasWidth(canvasWidthPx: number): number {
  const w = Math.max(120, canvasWidthPx);
  return (w - DASHBOARD_GRID_MARGIN_X * (DASHBOARD_GRID_COLS - 1)) / DASHBOARD_GRID_COLS;
}

/** Номинальный размер плитки в px при полной ширине макета — совпадает с реальным виджетом на холсте. */
export function getNominalPixelSizeForGridDimension(dim: WidgetDimension): { width: number; height: number } {
  const canvasW = getDashboardGridPixelWidth();
  const colW = getDashboardColWidthForCanvasWidth(canvasW);
  const { rowHeight } = getDashboardCellMetrics();
  return {
    width: dim.w * colW + Math.max(0, dim.w - 1) * DASHBOARD_GRID_MARGIN_X,
    height: dim.h * rowHeight + Math.max(0, dim.h - 1) * DASHBOARD_GRID_MARGIN_Y,
  };
}

/** Высота холста в px для текущего числа рядов (без прокрутки по вертикали). */
export function getDashboardGridPixelHeight(rowHeight: number, rowCount = getDashboardLayoutMaxRows()): number {
  return rowCount * rowHeight + (rowCount - 1) * DASHBOARD_GRID_MARGIN_Y;
}

export const WIDGET_SIZE_DIMENSIONS: Record<WidgetSize, WidgetDimension> = {
  S: { w: 4, h: 4 },
  M: { w: 8, h: 4 },
  L: { w: 8, h: 8 },
  XL: { w: 32, h: 8 },
  compact: { w: 4, h: 4 },
  tall: { w: 4, h: 8 },
  standard: { w: 8, h: 4 },
  square: { w: 8, h: 8 },
  wide: { w: 12, h: 4 },
  wideTall: { w: 12, h: 8 },
  wide4x2: { w: 16, h: 8 },
  /** Полная ширина холста (8 логических × 1 ряд) — как xwide на 4-колоночной доске, масштабировано. */
  xwide: { w: 32, h: 4 },
  /** Полная ширина × два ряда логики по высоте. */
  xl: { w: 32, h: 8 },
} as const;

const clampDimension = (value: WidgetDimension): WidgetDimension => ({
  w: Math.min(DASHBOARD_GRID_COLS, Math.max(4, value.w)),
  h: Math.min(getDashboardLayoutMaxRows(), Math.max(4, value.h)),
});

export function getWidgetDefinition(widgetId: WidgetId): WidgetDefinition | undefined {
  return WIDGET_REGISTRY.find((item) => item.id === widgetId);
}

export function getDimensionForSize(size: WidgetSize): WidgetDimension {
  return WIDGET_SIZE_DIMENSIONS[size];
}

export function getAllowedSizesForState(
  definition: WidgetDefinition,
  state?: string,
): WidgetSize[] {
  if (!state) return definition.allowedSizes;
  const restricted = definition.stateSizeMap?.[state];
  if (!restricted?.length) return definition.allowedSizes;
  return restricted.filter((size) => definition.allowedSizes.includes(size));
}

export function getAllowedDimensionsForState(
  definition: WidgetDefinition,
  state?: string,
): WidgetDimension[] {
  const sizes = getAllowedSizesForState(definition, state);
  return sizes.map((size) => getDimensionForSize(size));
}

function inferSizeFromDimension(
  dimension: WidgetDimension,
  allowedSizes: WidgetSize[],
): WidgetSize | undefined {
  return allowedSizes.find((size) => {
    const config = WIDGET_SIZE_DIMENSIONS[size];
    return config.w === dimension.w && config.h === dimension.h;
  });
}

export function getClosestAllowedDimension(
  candidate: WidgetDimension,
  allowed: WidgetDimension[],
): WidgetDimension {
  const clamped = clampDimension(candidate);
  const exact = allowed.find((item) => dimensionKey(item) === dimensionKey(clamped));
  if (exact) return exact;

  return allowed.reduce((best, current) => {
    const bestDistance = Math.abs(best.w - clamped.w) + Math.abs(best.h - clamped.h);
    const currentDistance = Math.abs(current.w - clamped.w) + Math.abs(current.h - clamped.h);
    return currentDistance < bestDistance ? current : best;
  }, allowed[0]);
}

export function getWidgetInstanceCount(
  layout: LayoutItem[],
  widgetId: WidgetId,
  options: { includeHidden?: boolean; includeDeleted?: boolean } = {},
): number {
  return layout.filter((item) => {
    if (item.widgetId !== widgetId) return false;
    if (!options.includeHidden && item.hidden) return false;
    if (!options.includeDeleted && item.deleted) return false;
    return true;
  }).length;
}

export function canAddWidgetByLimit(
  layout: LayoutItem[],
  definition: WidgetDefinition,
): boolean {
  const maxInstances = definition.maxInstances ?? 1;
  const currentInstances = getWidgetInstanceCount(layout, definition.id, {
    includeHidden: true,
    includeDeleted: false,
  });
  return currentInstances < maxInstances;
}

/** Миграция с сетки 16 колонок / старых высот на 32×… и tall 4×8. */
function migrateLegacyLayoutGeometry(item: LayoutItem): LayoutItem {
  const { w, h, size } = item;
  const next = { ...item };
  if (size === "xl" && w === 16 && h === 8) next.w = 32;
  if (size === "xwide" && w === 16 && h === 4) next.w = 32;
  if (size === "tall" && w === 4 && h === 6) next.h = 8;
  return next;
}

export function normalizeLayoutItem(item: LayoutItem): LayoutItem {
  const definition = getWidgetDefinition(item.widgetId);
  if (!definition) return item;

  item = migrateLegacyLayoutGeometry(item);

  const allowedSizes = getAllowedSizesForState(definition, item.state);
  const fallbackSize =
    item.size && allowedSizes.includes(item.size)
      ? item.size
      : allowedSizes[0] ?? definition.defaultSize;
  const fallbackDimension = WIDGET_SIZE_DIMENSIONS[fallbackSize];
  const allowedDimensions = getAllowedDimensionsForState(definition, item.state);

  const dimension = getClosestAllowedDimension(
    { w: item.w ?? fallbackDimension.w, h: item.h ?? fallbackDimension.h },
    allowedDimensions,
  );
  const size = inferSizeFromDimension(dimension, allowedSizes) ?? fallbackSize;
  const strict = WIDGET_SIZE_DIMENSIONS[size];
  const minW = Math.min(...allowedDimensions.map((value) => value.w));
  const maxW = Math.max(...allowedDimensions.map((value) => value.w));
  const minH = Math.min(...allowedDimensions.map((value) => value.h));
  const maxH = Math.max(...allowedDimensions.map((value) => value.h));

  return {
    ...item,
    w: strict.w,
    h: strict.h,
    size,
    minW,
    maxW,
    minH,
    maxH,
  };
}

export function normalizeLayout(layout: LayoutItem[]): LayoutItem[] {
  return layout.map(normalizeLayoutItem);
}

export function isWithinDashboardBounds(item: Pick<LayoutItem, "x" | "y" | "w" | "h">): boolean {
  return (
    item.x >= 0 &&
    item.y >= 0 &&
    item.w > 0 &&
    item.h > 0 &&
    item.x + item.w <= DASHBOARD_GRID_COLS &&
    item.y + item.h <= getDashboardLayoutMaxRows()
  );
}

export function isLayoutWithinBounds(layout: LayoutItem[]): boolean {
  return layout.every(isWithinDashboardBounds);
}

function intersects(a: Pick<LayoutItem, "x" | "y" | "w" | "h">, b: Pick<LayoutItem, "x" | "y" | "w" | "h">) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function hasOverlaps(layout: LayoutItem[]): boolean {
  for (let i = 0; i < layout.length; i += 1) {
    for (let j = i + 1; j < layout.length; j += 1) {
      if (intersects(layout[i], layout[j])) return true;
    }
  }
  return false;
}

export function isLayoutValid(layout: LayoutItem[]): boolean {
  return isLayoutWithinBounds(layout) && !hasOverlaps(layout);
}

export function findFirstFit(layout: LayoutItem[], w: number, h: number): { x: number; y: number } | null {
  const maxRows = getDashboardLayoutMaxRows();
  for (let y = 0; y <= maxRows - h; y += 1) {
    for (let x = 0; x <= DASHBOARD_GRID_COLS - w; x += 1) {
      const candidate = { x, y, w, h };
      if (isWithinDashboardBounds(candidate) && !layout.some((item) => intersects(candidate, item))) {
        return { x, y };
      }
    }
  }
  return null;
}

export function findNearestFit(
  layout: LayoutItem[],
  w: number,
  h: number,
  preferredX: number,
  preferredY: number,
  excludeId?: string,
): { x: number; y: number } | null {
  const sanitized = layout.filter((item) => item.i !== excludeId);
  const candidates: Array<{ x: number; y: number; score: number }> = [];
  const maxRows = getDashboardLayoutMaxRows();

  for (let y = 0; y <= maxRows - h; y += 1) {
    for (let x = 0; x <= DASHBOARD_GRID_COLS - w; x += 1) {
      const candidate = { x, y, w, h };
      if (!isWithinDashboardBounds(candidate)) continue;
      if (sanitized.some((item) => intersects(candidate, item))) continue;
      const score = Math.abs(x - preferredX) + Math.abs(y - preferredY);
      candidates.push({ x, y, score });
    }
  }

  if (!candidates.length) return null;

  candidates.sort((a, b) => {
    if (a.score !== b.score) return a.score - b.score;
    if (a.y !== b.y) return a.y - b.y;
    return a.x - b.x;
  });

  const best = candidates[0];
  return { x: best.x, y: best.y };
}

export function hasAnyPlacementForWidget(layout: LayoutItem[], widgetId: WidgetId): boolean {
  const definition = getWidgetDefinition(widgetId);
  if (!definition) return false;
  const availableSizes = getAllowedSizesForState(definition, "default");
  return availableSizes.some((size) => {
    const dimension = getDimensionForSize(size);
    return Boolean(findFirstFit(layout, dimension.w, dimension.h));
  });
}
