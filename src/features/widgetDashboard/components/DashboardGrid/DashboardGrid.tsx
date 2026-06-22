import GridLayout from "react-grid-layout";
import { defaultConstraints } from "react-grid-layout/core";
import { Box } from "@mui/material";
import type { ReactNode } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import type { LayoutItem, WidgetId } from "../../types/widget.types";
import {
  DASHBOARD_GRID_COLS,
  DASHBOARD_GRID_MARGIN_X,
  DASHBOARD_GRID_MARGIN_Y,
  getDashboardGridPixelHeight,
  getDashboardLayoutMaxRows,
  normalizeLayoutItem,
} from "../../config/widgetSizing";
import { figmaTokens } from "../../../../theme/figmaTokens";

interface DashboardGridProps {
  layout: LayoutItem[];
  isEditing: boolean;
  onLayoutChange: (layout: LayoutItem[]) => void;
  children: ReactNode;
  width?: number;
  height?: number;
  rowHeight?: number;
  /** Шаг точечной сетки в px (X и Y). По умолчанию — токен Figma; задайте `rowHeight + marginY` для совпадения с ячейками. */
  dotGridStepPx?: number;
  /** Минимальная высота оболочки холста (закрывает щель от округления, холст до низа области). */
  minOuterHeightPx?: number;
  /** Число строк сетки (должно совпадать с `getDashboardLayoutMaxRows()` с главной страницы). */
  maxRows?: number;
  onInvalidAction?: (message: string) => void;
  interactionLockedReason?: string | null;
  previewItem?: {
    x: number;
    y: number;
    w: number;
    h: number;
    valid: boolean;
  } | null;
}

export default function DashboardGrid({
  layout,
  isEditing,
  onLayoutChange,
  children,
  width = 1200,
  height: _height = 675,
  rowHeight: rowHeightProp,
  dotGridStepPx,
  minOuterHeightPx,
  onInvalidAction: _onInvalidAction,
  interactionLockedReason = null,
  previewItem = null,
  maxRows: maxRowsProp,
}: DashboardGridProps) {
  const cols = DASHBOARD_GRID_COLS;
  const marginX = DASHBOARD_GRID_MARGIN_X;
  const rows = maxRowsProp ?? getDashboardLayoutMaxRows();
  const marginY = DASHBOARD_GRID_MARGIN_Y;
  /** Как в react-grid-layout `calcGridColWidth`: совпадает с позиционированием ячеек (без расхождения с линиями сетки). */
  const colWidth = (width - marginX * (cols - 1)) / cols;
  const rowHeight = rowHeightProp ?? colWidth;
  const gridPixelHeight = getDashboardGridPixelHeight(rowHeight, rows);
  const canvasHeight = gridPixelHeight;
  const outerMinHeight = Math.max(canvasHeight, minOuterHeightPx ?? 0);
  const dotStep = dotGridStepPx ?? figmaTokens.canvasDotGrid.stepPx;
  const interactionsEnabled = isEditing && !interactionLockedReason;
  const handleChange = (
    next: Array<{ i: string; x: number; y: number; w: number; h: number; minW?: number; minH?: number; maxW?: number; maxH?: number }>,
  ) => {
    const mapped: LayoutItem[] = next.map((rglItem) => {
      const prev = layout.find((l) => l.i === rglItem.i);
      if (prev) {
        return {
          ...prev,
          x: rglItem.x,
          y: rglItem.y,
          w: rglItem.w,
          h: rglItem.h,
          minW: rglItem.minW,
          minH: rglItem.minH,
          maxW: rglItem.maxW,
          maxH: rglItem.maxH,
        };
      }
      return {
        i: rglItem.i,
        widgetId: "kpi" as WidgetId,
        x: rglItem.x,
        y: rglItem.y,
        w: rglItem.w,
        h: rglItem.h,
        minW: rglItem.minW,
        minH: rglItem.minH,
        maxW: rglItem.maxW,
        maxH: rglItem.maxH,
      };
    });
    onLayoutChange(mapped.map((item) => normalizeLayoutItem(item)));
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: outerMinHeight,
        height: "auto",
        borderRadius: `${figmaTokens.radius.xs}px`,
        boxSizing: "border-box",
        border: "none",
        boxShadow: "none",
        backgroundColor: isEditing ? figmaTokens.colors.canvasWorkspace : figmaTokens.colors.pageBg,
        backgroundImage: isEditing
          ? `radial-gradient(circle, ${figmaTokens.canvasDotGrid.dotColor} ${figmaTokens.canvasDotGrid.cssRadiusPx}px, transparent ${figmaTokens.canvasDotGrid.cssRadiusPx}px)`
          : "none",
        backgroundSize: isEditing ? `${dotStep}px ${dotStep}px` : undefined,
        backgroundPosition: isEditing ? "0 0" : undefined,
        backgroundRepeat: isEditing ? "repeat" : undefined,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {interactionLockedReason && (
        <Box
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            right: 12,
            zIndex: 2,
            px: 1.25,
            py: 0.75,
            borderRadius: 1.5,
            bgcolor: "rgba(25, 28, 34, 0.8)",
            color: "#fff",
            fontSize: 12,
            lineHeight: "18px",
          }}
        >
          {interactionLockedReason}
        </Box>
      )}
      {previewItem && (
        <Box
          sx={{
            position: "absolute",
            left: `${previewItem.x * (colWidth + marginX)}px`,
            top: `${previewItem.y * (rowHeight + marginY)}px`,
            width: `${previewItem.w * colWidth + Math.max(0, previewItem.w - 1) * marginX}px`,
            height: `${previewItem.h * rowHeight + Math.max(0, previewItem.h - 1) * marginY}px`,
            borderRadius: 3,
            border: `2px dashed ${previewItem.valid ? "#6EA8FF" : "#FF7B7B"}`,
            background: previewItem.valid
              ? "linear-gradient(180deg, rgba(110,168,255,0.18) 0%, rgba(110,168,255,0.08) 100%)"
              : "linear-gradient(180deg, rgba(255,123,123,0.18) 0%, rgba(255,123,123,0.08) 100%)",
            boxShadow: previewItem.valid
              ? "0 12px 30px rgba(71,122,255,0.18)"
              : "0 12px 30px rgba(255,123,123,0.15)",
            pointerEvents: "none",
            zIndex: 3,
          }}
        />
      )}
      <GridLayout
        className="layout"
        width={width}
        gridConfig={{ cols, rowHeight, margin: [marginX, marginY], containerPadding: [0, 0], maxRows: rows }}
        layout={layout}
        dragConfig={{
          enabled: interactionsEnabled,
          /** Перетаскивание с любой области карточки; кнопки/поля не запускают move */
          cancel:
            'input, textarea, select, option, button, a[href], [contenteditable="true"], [role="slider"], [role="listbox"]',
        }}
        /** Размер только из пресетов витрины (контекстное меню / каталог), не произвольный drag-resize */
        resizeConfig={{ enabled: false, handles: [] }}
        constraints={defaultConstraints}
        onLayoutChange={(next) =>
          handleChange(
            next as Array<{
              i: string;
              x: number;
              y: number;
              w: number;
              h: number;
              minW?: number;
              minH?: number;
              maxW?: number;
              maxH?: number;
            }>,
          )
        }
      >
        {children}
      </GridLayout>
    </Box>
  );
}
