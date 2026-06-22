import { alpha, Box, Stack } from "@mui/material";
import type { ReactNode } from "react";
import { figmaTokens } from "../../../../theme/figmaTokens";
import type { WidgetId } from "../../types/widget.types";
import type { WidgetCategory } from "../../types/widget.types";
import { WIDGET_UX_GUARDRAILS } from "../../config/widgetUxGuardrails";

interface WidgetShellProps {
  instanceId: string;
  widgetId: WidgetId;
  state?: string;
  title: string;
  category: WidgetCategory;
  isEditing: boolean;
  isSelected?: boolean;
  onActivate?: (instanceId: string, anchor: { x: number; y: number }) => void;
  children: ReactNode;
}

export default function WidgetShell({
  instanceId,
  widgetId: _widgetId,
  state: _state,
  title: _title,
  category: _category,
  isEditing,
  isSelected = false,
  onActivate,
  children,
}: WidgetShellProps) {
  return (
    <Box
      onContextMenu={(event) => {
        if (!isEditing || !onActivate) return;
        event.preventDefault();
        const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
        onActivate(instanceId, {
          x: Math.round(rect.right - 18),
          y: Math.round(rect.top + 18),
        });
      }}
      sx={{
        height: "100%",
        boxSizing: "border-box",
        border: isEditing
          ? isSelected
            ? "1.5px solid rgba(110,168,255,0.9)"
            : "1px dashed rgba(110,168,255,0.45)"
          : `1px solid ${alpha(figmaTokens.colors.outline, 0.42)}`,
        bgcolor: isEditing ? "rgba(255,255,255,0.02)" : "transparent",
        cursor: isEditing ? "grab" : "default",
        transition: "border-color 0.15s ease",
        borderRadius: isEditing ? 2 : `${figmaTokens.radius.lg}px`,
        minHeight: WIDGET_UX_GUARDRAILS.minTouchTarget * 2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Stack sx={{ height: "100%", minHeight: 0, overflow: "hidden" }}>{children}</Stack>
    </Box>
  );
}
