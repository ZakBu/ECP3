import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { Divider, ListItemText, MenuItem, MenuList, Popover, Typography } from "@mui/material";
import type { LayoutItem, WidgetSize } from "../../../features/widgetDashboard/types/widget.types";
import { figmaTokens } from "../../../theme/figmaTokens";

interface WidgetContextMenuProps {
  open: boolean;
  anchor: { x: number; y: number } | null;
  selectedWidgetItem: LayoutItem | null;
  selectedWidgetSizeOptions: WidgetSize[];
  selectedWidgetDefinition?: { menuSizeLabels?: Partial<Record<WidgetSize, string>> };
  sizeLabels: Record<WidgetSize, string>;
  widgetResizeReason?: string | null;
  resolveResizeCandidate: (instanceId: string, size: WidgetSize) => { layoutItem: LayoutItem | null; reason: string | null };
  onPreview: (preview: {
    instanceId: string;
    size: WidgetSize;
    layoutItem: LayoutItem | null;
    reason: string | null;
  } | null) => void;
  onApplySize: (nextLayoutItem: LayoutItem, widgetId: string) => void;
  onDelete: (instanceId: string) => void;
  onClose: () => void;
  onMessage: (message: string) => void;
}

const paperSx = {
  mt: 0.75,
  minWidth: 260,
  maxWidth: 320,
  borderRadius: `${figmaTokens.radius.xs}px`,
  overflow: "hidden",
  bgcolor: figmaTokens.colors.surfaceLow,
  color: figmaTokens.colors.textPrimary,
  border: `1px solid ${figmaTokens.colors.outline}`,
  boxShadow: figmaTokens.shadow.float,
} as const;

export default function WidgetContextMenu({
  open,
  anchor,
  selectedWidgetItem,
  selectedWidgetSizeOptions,
  selectedWidgetDefinition,
  sizeLabels,
  widgetResizeReason,
  resolveResizeCandidate,
  onPreview,
  onApplySize,
  onDelete,
  onClose,
  onMessage,
}: WidgetContextMenuProps) {
  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchor ? { top: anchor.y, left: anchor.x } : undefined}
      slotProps={{
        paper: { elevation: 0, sx: paperSx },
      }}
    >
      <MenuList
        dense
        sx={{
          py: 0.5,
          px: 0.5,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            display: "block",
            px: 1.5,
            pt: 1,
            pb: 0.5,
            color: figmaTokens.colors.textMuted,
            fontWeight: 600,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            fontSize: 11,
          }}
        >
          Размер
        </Typography>
        {selectedWidgetItem &&
          selectedWidgetSizeOptions.map((size) => {
            const preview = resolveResizeCandidate(selectedWidgetItem.i, size);
            const isActive = selectedWidgetItem?.size === size;
            const isDisabled = !preview.layoutItem;
            const label = selectedWidgetDefinition?.menuSizeLabels?.[size] ?? sizeLabels[size];
            return (
              <MenuItem
                key={size}
                disabled={isDisabled}
                onMouseEnter={() =>
                  onPreview({
                    instanceId: selectedWidgetItem.i,
                    size,
                    layoutItem: preview.layoutItem,
                    reason: preview.reason,
                  })
                }
                onMouseLeave={() => onPreview(null)}
                onClick={() => {
                  if (!preview.layoutItem || !selectedWidgetItem) {
                    onMessage(preview.reason ?? "Этот размер недоступен");
                    return;
                  }
                  onApplySize(preview.layoutItem, selectedWidgetItem.i);
                }}
                sx={{
                  borderRadius: `${Math.max(6, figmaTokens.radius.xs - 2)}px`,
                  py: 0.85,
                  px: 1.25,
                  minHeight: 40,
                  typography: "body2",
                  fontSize: 14,
                  color: figmaTokens.colors.textPrimary,
                  "&:hover": {
                    bgcolor: figmaTokens.colors.accentBlue,
                  },
                  "&.Mui-focusVisible": {
                    bgcolor: figmaTokens.colors.accentBlue,
                  },
                  "&.Mui-disabled": {
                    opacity: 0.45,
                  },
                }}
              >
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 400,
                    color: figmaTokens.colors.textPrimary,
                  }}
                  sx={{ m: 0 }}
                />
                {isActive ? (
                  <CheckRoundedIcon sx={{ fontSize: 20, color: figmaTokens.colors.primary, ml: 1, flexShrink: 0 }} />
                ) : (
                  <span style={{ width: 20, marginLeft: 8, flexShrink: 0 }} aria-hidden />
                )}
              </MenuItem>
            );
          })}
        <Divider sx={{ borderColor: figmaTokens.colors.outline, my: 0.5 }} />
        <MenuItem
          onClick={() => {
            if (selectedWidgetItem) {
              onDelete(selectedWidgetItem.i);
            }
            onClose();
          }}
          sx={{
            borderRadius: `${Math.max(6, figmaTokens.radius.xs - 2)}px`,
            py: 0.85,
            px: 1.25,
            minHeight: 40,
            typography: "body2",
            fontSize: 14,
            color: figmaTokens.colors.danger,
            fontWeight: 500,
            "&:hover": {
              bgcolor: "rgba(186, 26, 26, 0.06)",
            },
            "&.Mui-focusVisible": {
              bgcolor: "rgba(186, 26, 26, 0.08)",
            },
          }}
        >
          Удалить виджет
        </MenuItem>
        {widgetResizeReason && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              px: 1.5,
              py: 1,
              color: figmaTokens.colors.textMuted,
              fontSize: 12,
              lineHeight: 1.35,
            }}
          >
            {widgetResizeReason}
          </Typography>
        )}
      </MenuList>
    </Popover>
  );
}
