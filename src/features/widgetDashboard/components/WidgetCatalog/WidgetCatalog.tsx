import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Chip,
  Drawer,
  Divider,
  InputAdornment,
  InputBase,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Suspense, useMemo, useState, type ComponentType } from "react";
import { WIDGET_REGISTRY } from "./WidgetCatalog.data";
import type { UserRole } from "../../types/role.types";
import type { WidgetDimension, WidgetId, WidgetSize } from "../../types/widget.types";
import { getDimensionForSize } from "../../config/widgetSizing";

const CATEGORY_LABELS = {
  analytics: "Аналитика",
  work: "Операционные",
  info: "Информационные",
} as const;

const CATEGORY_COLORS = {
  analytics: "info",
  work: "success",
  info: "warning",
} as const;

const GROUP_ORDER = [
  "Контроль показателей",
  "Риски и отклонения",
  "Ежедневная работа",
  "Документы и согласования",
  "Командная работа",
  "Справочная информация",
] as const;

const getPreviewFrameSize = (dimension: WidgetDimension): { width: number; height: number } => ({
  width: 52 + dimension.w * 34,
  height: 28 + dimension.h * 22,
});

const getPreviewAccent = (category: "analytics" | "operational" | "informational"): string => {
  if (category === "analytics") return "linear-gradient(135deg, #2F67C7 0%, #5AA7FF 100%)";
  if (category === "operational") return "linear-gradient(135deg, #3A7A24 0%, #73C54D 100%)";
  return "linear-gradient(135deg, #9A5D10 0%, #F2B14A 100%)";
};

interface WidgetCatalogProps {
  open: boolean;
  role: UserRole;
  selected: Record<WidgetId, number>;
  hidden?: Record<WidgetId, number>;
  deleted?: Record<WidgetId, number>;
  recommended?: WidgetId[];
  canAddWidget?: (widgetId: WidgetId) => boolean;
  canAddSize?: (widgetId: WidgetId, size: WidgetSize, state?: string) => boolean;
  onClose: () => void;
  onAdd: (widgetId: WidgetId, size: WidgetSize, state?: string) => void;
  onRestore?: (widgetId: WidgetId) => void;
  variant?: "drawer" | "panel";
}

export default function WidgetCatalog({
  open,
  role,
  selected,
  hidden = {} as Record<WidgetId, number>,
  deleted = {} as Record<WidgetId, number>,
  recommended = [],
  canAddWidget,
  canAddSize,
  onClose,
  onAdd,
  onRestore,
  variant = "drawer",
}: WidgetCatalogProps) {
  const [activeWidgetId, setActiveWidgetId] = useState<WidgetId | null>(null);
  const [query, setQuery] = useState("");
  const [sizeByWidget, setSizeByWidget] = useState<Record<WidgetId, WidgetSize>>(
    {} as Record<WidgetId, WidgetSize>,
  );
  const [stateByWidget, setStateByWidget] = useState<Record<WidgetId, string>>(
    {} as Record<WidgetId, string>,
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return WIDGET_REGISTRY;
    return WIDGET_REGISTRY.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.useCaseGroup.toLowerCase().includes(q)
      );
    });
  }, [query]);

  const activeWidget = useMemo(
    () => filtered.find((item) => item.id === (activeWidgetId ?? filtered[0]?.id)) ?? filtered[0],
    [activeWidgetId, filtered],
  );

  const groupedWidgets = useMemo(() => {
    const groups = new Map<string, typeof filtered>();
    for (const widget of filtered) {
      const key = widget.useCaseGroup;
      const group = groups.get(key);
      if (group) {
        group.push(widget);
      } else {
        groups.set(key, [widget]);
      }
    }

    const sortedKeys = [...groups.keys()].sort((a, b) => {
      const aIndex = GROUP_ORDER.indexOf(a as (typeof GROUP_ORDER)[number]);
      const bIndex = GROUP_ORDER.indexOf(b as (typeof GROUP_ORDER)[number]);
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

    return sortedKeys.map((groupName) => ({
      groupName,
      items: groups.get(groupName) ?? [],
    }));
  }, [filtered]);

  const activeSize = activeWidget ? sizeByWidget[activeWidget.id] ?? activeWidget.defaultSize : "M";
  const activeState = activeWidget
    ? stateByWidget[activeWidget.id] ?? activeWidget.stateOptions?.[0]?.key ?? "default"
    : "default";
  const activeDimension = getDimensionForSize(activeSize);
  const ActivePreviewComponent = activeWidget?.component as
    | ComponentType<{ widgetId?: WidgetId; size?: WidgetSize; state?: string }>
    | undefined;

  const activeVisibleCount = activeWidget ? selected[activeWidget.id] ?? 0 : 0;
  const activeHiddenCount = activeWidget ? hidden[activeWidget.id] ?? 0 : 0;
  const activeDeletedCount = activeWidget ? deleted[activeWidget.id] ?? 0 : 0;
  const activeMaxInstances = activeWidget?.maxInstances ?? 1;
  const activeTotalCount = activeVisibleCount + activeHiddenCount + activeDeletedCount;
  const activeWidgetRoleUnavailable = activeWidget
    ? activeWidget.allowedRoles.length > 0 && !activeWidget.allowedRoles.includes(role)
    : false;

  const hasSpaceForActiveSize = activeWidget
    ? (canAddSize?.(activeWidget.id, activeSize, activeState) ?? true)
    : true;
  const canAddActiveByLimit = activeWidget
    ? (canAddWidget?.(activeWidget.id) ?? activeTotalCount < activeMaxInstances)
    : true;
  const addDisabled =
    activeWidgetRoleUnavailable ||
    !hasSpaceForActiveSize ||
    !canAddActiveByLimit;

  const activeUnavailableReason = activeWidgetRoleUnavailable
    ? "Недоступно для вашей роли"
    : !canAddActiveByLimit
      ? "Достигнут лимит экземпляров"
      : !hasSpaceForActiveSize
        ? "Нет свободных ячеек в сетке дашборда"
        : null;

  const content = (
    <Box sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography variant="h6" mb={1}>
        Библиотека виджетов
      </Typography>
      <Typography variant="body2" mb={1.5}>
        Сгруппировано по рабочим сценариям и назначению.
      </Typography>
      <InputBase
        placeholder="Поиск по названию, описанию или сценарию"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{
          px: 1,
          py: 0.6,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          mb: 1,
        }}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        }
      />
      {activeWidget && (
        <Box
          sx={{
            border: "1px solid #2A2A2A",
            borderRadius: 3,
            p: 2,
            mb: 1.5,
            bgcolor: "#1E1F22",
            color: "#F5F6F8",
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="overline" sx={{ color: "#AEB3BC", letterSpacing: 0.6 }}>
              Превью
            </Typography>
            <Stack direction="row" spacing={0.75}>
              <Chip
                size="small"
                label={CATEGORY_LABELS[activeWidget.libraryCategory]}
                color={CATEGORY_COLORS[activeWidget.libraryCategory]}
                variant="filled"
              />
              <Chip size="small" label={activeWidget.useCaseGroup} variant="outlined" sx={{ color: "#F5F6F8" }} />
            </Stack>
          </Stack>
          <Typography variant="subtitle1" fontWeight={700}>
            {activeWidget.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "#B7BCC6", mb: 1.2 }}>
            {activeWidget.description}
          </Typography>
          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap mb={1.2}>
            {recommended.includes(activeWidget.id) && activeVisibleCount === 0 && (
              <Chip size="small" color="success" label="Рекомендуется" />
            )}
            {activeVisibleCount > 0 && (
              <Chip size="small" color="primary" label={`На холсте: ${activeVisibleCount}`} />
            )}
            {activeHiddenCount > 0 && (
              <Chip size="small" color="warning" label={`Скрыто: ${activeHiddenCount}`} />
            )}
            {activeDeletedCount > 0 && (
              <Chip size="small" color="error" label={`Удалено до сохранения: ${activeDeletedCount}`} />
            )}
            <Chip size="small" variant="outlined" label={`Лимит: ${activeTotalCount}/${activeMaxInstances}`} />
            {activeUnavailableReason && <Chip size="small" color="default" label={activeUnavailableReason} />}
          </Stack>
          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              borderRadius: 2.5,
              border: "1px solid #3A3D44",
              bgcolor: "#2A2D34",
              minHeight: 180,
              mb: 1.2,
              p: 0.9,
            }}
          >
            <Box
              sx={{
                ...getPreviewFrameSize(activeDimension),
                maxWidth: "100%",
                borderRadius: 2.5,
                border: "1px solid #3A3D44",
                boxShadow: "0 10px 24px rgba(0,0,0,0.28)",
                bgcolor: "#15181F",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 5,
                  background: getPreviewAccent(activeWidget.category),
                }}
              />
              <Box sx={{ p: 1, mt: 0.5, height: "100%", overflow: "hidden" }}>
                <Suspense fallback={<Box sx={{ height: "100%", borderRadius: 1.5, bgcolor: "#252A35" }} />}>
                  {ActivePreviewComponent ? (
                    <ActivePreviewComponent
                      widgetId={activeWidget.id}
                      size={activeSize}
                      state={activeState}
                    />
                  ) : null}
                </Suspense>
              </Box>
            </Box>
          </Box>
          {activeWidget.stateOptions && activeWidget.stateOptions.length > 1 && (
            <>
              <Typography variant="caption" sx={{ color: "#AEB3BC" }}>
                Состояние
              </Typography>
              <ToggleButtonGroup
                size="small"
                sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 0.5, mb: 1 }}
                exclusive
                value={activeState}
                onChange={(_, value: string | null) => {
                  if (!value || !activeWidget) return;
                  setStateByWidget((prev) => ({ ...prev, [activeWidget.id]: value }));
                }}
              >
                {activeWidget.stateOptions.map((stateOption) => (
                  <ToggleButton key={stateOption.key} value={stateOption.key} sx={{ borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ fontSize: 11, lineHeight: 1 }}>
                      {stateOption.label}
                    </Typography>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </>
          )}
          <Typography variant="caption" sx={{ color: "#AEB3BC" }}>
            Размер
          </Typography>
          <ToggleButtonGroup
            size="small"
            sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 0.5, mb: 1 }}
            exclusive
            value={activeSize}
            onChange={(_, value: WidgetSize | null) => {
              if (!value || !activeWidget) return;
              setSizeByWidget((prev) => ({ ...prev, [activeWidget.id]: value }));
            }}
          >
            {activeWidget.allowedSizes.map((size) => {
              const dimension = getDimensionForSize(size);
              const mini = getPreviewFrameSize(dimension);
              const sizeUnavailable = !canAddSize?.(activeWidget.id, size, activeState);
              return (
                <ToggleButton
                  key={size}
                  value={size}
                  sx={{
                    borderRadius: 2,
                    px: 0.75,
                    py: 0.5,
                    display: "grid",
                    gap: 0.35,
                    justifyItems: "center",
                    minWidth: 62,
                    opacity: sizeUnavailable ? 0.45 : 1,
                  }}
                >
                  <Box
                    sx={{
                      width: Math.max(22, Math.floor(mini.width * 0.16)),
                      height: Math.max(14, Math.floor(mini.height * 0.16)),
                      borderRadius: 0.8,
                      background: getPreviewAccent(activeWidget.category),
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  />
                  <Typography variant="caption" sx={{ fontSize: 11, lineHeight: 1 }}>
                    {size}
                  </Typography>
                </ToggleButton>
              );
            })}
          </ToggleButtonGroup>
          <Stack direction="row" spacing={1}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              disabled={addDisabled}
              onClick={() => {
                if (activeWidget) onAdd(activeWidget.id, activeSize, activeState);
              }}
              sx={{
                borderRadius: 999,
                minHeight: 44,
                bgcolor: "#3B82F6",
                color: "#fff",
                "&:hover": { bgcolor: "#2563EB" },
                "&.Mui-disabled": {
                  bgcolor: "#2B2E35",
                  color: "#AEB3BC",
                  opacity: 1,
                },
              }}
            >
              {activeUnavailableReason ?? "Добавить виджет"}
            </Button>
            {(activeHiddenCount > 0 || activeDeletedCount > 0) && onRestore && (
              <Button variant="outlined" onClick={() => onRestore(activeWidget.id)}>
                Восстановить
              </Button>
            )}
          </Stack>
        </Box>
      )}
      <Divider sx={{ mb: 1 }} />
      <List disablePadding sx={{ overflowY: "auto" }}>
        {groupedWidgets.map((group) => (
          <Box key={group.groupName} sx={{ mb: 1.25 }}>
            <Typography sx={{ px: 0.5, pb: 0.5, fontSize: 12, fontWeight: 700, color: "text.secondary" }}>
              {group.groupName}
            </Typography>
            {group.items.map((widget) => {
              const visibleCount = selected[widget.id] ?? 0;
              const hiddenCount = hidden[widget.id] ?? 0;
              const deletedCount = deleted[widget.id] ?? 0;
              const totalCount = visibleCount + hiddenCount + deletedCount;
              const maxInstances = widget.maxInstances ?? 1;
              const atLimit = totalCount >= maxInstances;
              const roleUnavailable =
                widget.allowedRoles.length > 0 && !widget.allowedRoles.includes(role);

              return (
                <ListItem
                  key={widget.id}
                  disablePadding
                  sx={{
                    mb: 0.5,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: activeWidget?.id === widget.id ? "primary.main" : "divider",
                    bgcolor: activeWidget?.id === widget.id ? "action.selected" : "background.paper",
                  }}
                >
                  <ListItemButton onClick={() => setActiveWidgetId(widget.id)}>
                    <Stack sx={{ width: "100%" }}>
                      <ListItemText primary={widget.title} secondary={widget.description} />
                      <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                        <Chip
                          size="small"
                          label={CATEGORY_LABELS[widget.libraryCategory]}
                          color={CATEGORY_COLORS[widget.libraryCategory]}
                          variant="outlined"
                        />
                        <Chip
                          size="small"
                          label={`${widget.defaultSize} • ${widget.allowedSizes.join("/")}`}
                          variant="outlined"
                        />
                        {recommended.includes(widget.id) && visibleCount === 0 && (
                          <Chip size="small" color="success" label="Рекомендуется" />
                        )}
                        {visibleCount > 0 && (
                          <Chip size="small" label={`На холсте: ${visibleCount}`} color="primary" />
                        )}
                        {hiddenCount > 0 && (
                          <Chip size="small" label={`Скрыт: ${hiddenCount}`} color="warning" />
                        )}
                        {deletedCount > 0 && (
                          <Chip size="small" label={`Удалён: ${deletedCount}`} color="error" />
                        )}
                        {atLimit && <Chip size="small" label="Лимит достигнут" color="default" />}
                        {roleUnavailable && (
                          <Chip size="small" label="Недоступно роли" color="default" />
                        )}
                      </Stack>
                    </Stack>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Box>
        ))}
      </List>
    </Box>
  );

  if (variant === "panel") return content;

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 420 } }}>
      {content}
    </Drawer>
  );
}
