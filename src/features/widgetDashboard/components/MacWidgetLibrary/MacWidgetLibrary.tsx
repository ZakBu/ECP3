import KeyboardDoubleArrowLeftRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowLeftRounded";
import KeyboardDoubleArrowRightRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowRightRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  Box,
  ButtonBase,
  InputBase,
  Skeleton,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type ComponentType,
  type DragEvent,
} from "react";
import {
  getDimensionForSize,
  getNominalPixelSizeForGridDimension,
} from "../../config/widgetSizing";
import type { UserRole } from "../../types/role.types";
import type { DraggingLibraryWidget, WidgetCategory, WidgetId, WidgetSize } from "../../types/widget.types";
import { v6HeaderIcon } from "../../v6/v6WidgetKit";
import {
  getV8GallerySizeOptions,
  getV8GalleryStateOptions,
  WIDGET_REGISTRY,
} from "../WidgetCatalog/WidgetCatalog.data";
import WidgetShell from "../WidgetShell/WidgetShell";
import { figmaTokens } from "../../../../theme/figmaTokens";
import type { DashboardPresetId } from "../../config/dashboardPresets";

function setLibraryWidgetDragData(
  event: DragEvent<HTMLElement>,
  payload: { widgetId: WidgetId; size: WidgetSize; state?: string },
) {
  const raw = JSON.stringify(payload);
  event.dataTransfer.setData("application/ecp-widget", raw);
  event.dataTransfer.setData("text/plain", raw);
}

const CATEGORY_ITEMS = [
  { key: "all", label: "Все виджеты" },
  { key: "analytics", label: "Аналитика" },
  { key: "work", label: "Операционные" },
  { key: "info", label: "Информационные" },
] as const;

const SIZE_LABELS: Record<WidgetSize, string> = {
  S: "Малый",
  M: "Средний",
  L: "Большой",
  XL: "Огромный",
  compact: "Компактный · 1×1",
  tall: "Высокий · 1×2",
  standard: "Стандартный · 2×1",
  square: "Квадратный · 2×2",
  wide: "Широкий · 3×1",
  wideTall: "Широкий высокий · 3×2",
  wide4x2: "Широкий · 4×2",
  xwide: "На всю ширину · 8×1",
  xl: "Панорамный · 8×2",
};

interface MacWidgetLibraryProps {
  role: UserRole;
  selected: Record<WidgetId, number>;
  hidden: Record<WidgetId, number>;
  deleted: Record<WidgetId, number>;
  recommended: WidgetId[];
  collapsed: boolean;
  isDirty: boolean;
  isSaving?: boolean;
  onExpandedMode: () => void;
  onToggleCompact: () => void;
  onBeginDrag: (payload: DraggingLibraryWidget) => void;
  onEndDrag: () => void;
  onReset: () => void;
  onSave: () => void;
  onApplyPreset: (presetId: DashboardPresetId) => void;
}

function PreviewCard({
  widgetId,
  title,
  previewSize,
  previewState,
  dragging,
  compact,
  onClick,
  onPointerStart,
  onDragStart,
  onDragEnd,
  resolveDragPayload,
}: {
  widgetId: WidgetId;
  title: string;
  previewSize: WidgetSize;
  previewState?: string;
  dragging: boolean;
  compact?: boolean;
  onClick?: () => void;
  onPointerStart?: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  /** Актуальный вид/размер в момент dragstart (после смены чипа до ре-рендера). */
  resolveDragPayload?: () => { size: WidgetSize; state?: string };
}) {
  const definition = WIDGET_REGISTRY.find((item) => item.id === widgetId);
  const gridDim = getDimensionForSize(previewSize);
  const { width: logicalWidth, height: logicalHeight } = getNominalPixelSizeForGridDimension(gridDim);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });
  const Component = definition?.component as ComponentType<{
    widgetId?: WidgetId;
    size?: WidgetSize;
    state?: string;
  }>;
  const framePadding = compact ? 10 : 14;
  const frameHeight = compact ? 132 : 214;
  const availableWidth = Math.max(1, frameSize.width - framePadding * 2);
  const availableHeight = Math.max(1, frameSize.height - framePadding * 2);
  const previewScale = Math.min(1, availableWidth / logicalWidth, availableHeight / logicalHeight);
  const safeScale = Number.isFinite(previewScale) && previewScale > 0 ? previewScale : 0.25;
  const scaledW = Math.max(1, logicalWidth * safeScale);
  const scaledH = Math.max(1, logicalHeight * safeScale);

  useEffect(() => {
    const element = frameRef.current;
    if (!element) return undefined;

    const updateSize = () => {
      const next = element.getBoundingClientRect();
      setFrameSize({ width: next.width, height: next.height });
    };

    updateSize();
    if (typeof ResizeObserver === "undefined") return undefined;

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const beginNativeDrag = (event: DragEvent<HTMLElement>) => {
    const resolved = resolveDragPayload?.() ?? { size: previewSize, state: previewState };
    event.dataTransfer.effectAllowed = "copyMove";
    setLibraryWidgetDragData(event, { widgetId, size: resolved.size, state: resolved.state });
    onDragStart();
  };

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onClick}
      sx={{
        display: "block",
        width: "100%",
        textAlign: "left",
        borderRadius: compact ? 2.8 : 0,
        p: compact ? 0.45 : 0,
        background: "transparent",
        border: "none",
        boxShadow: "none",
        transition: "transform .18s ease, opacity .18s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          opacity: 0.96,
        },
      }}
    >
      <Box sx={{ position: "relative", cursor: dragging ? "grabbing" : "grab" }}>
        <Box
          ref={frameRef}
          sx={{
            width: "100%",
            height: frameHeight,
            borderRadius: compact ? 2.2 : 2.8,
            overflow: "hidden",
            border: `1px solid ${alpha(figmaTokens.colors.outline, 0.66)}`,
            background:
              "linear-gradient(180deg, rgba(255,255,255,.88) 0%, rgba(245,248,255,.94) 48%, rgba(241,245,254,.98) 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "height .2s ease",
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              width: scaledW,
              height: scaledH,
              position: "relative",
              overflow: "hidden",
              borderRadius: compact ? 1.5 : 2,
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                left: 0,
                top: 0,
                width: logicalWidth,
                height: logicalHeight,
                transform: `scale(${safeScale})`,
                transformOrigin: "0 0",
                transition: "transform .24s ease",
              }}
            >
              <WidgetShell
                instanceId={`preview-${widgetId}`}
                widgetId={widgetId}
                state={previewState}
                title={definition?.title ?? title}
                category={(definition?.category ?? "analytics") as WidgetCategory}
                isEditing={false}
              >
                <Suspense fallback={<Skeleton variant="rounded" height="100%" />}>
                  {Component ? <Component widgetId={widgetId} size={previewSize} state={previewState} /> : null}
                </Suspense>
              </WidgetShell>
            </Box>
          </Box>
        </Box>
        <Box
          draggable
          onMouseDown={(event) => {
            if (event.button !== 0) return;
            onPointerStart?.();
          }}
          onDragStart={beginNativeDrag}
          onDragEnd={onDragEnd}
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            borderRadius: 3,
            background: "transparent",
            cursor: dragging ? "grabbing" : "grab",
            userSelect: "none",
          }}
        />
      </Box>
    </Box>
  );
}

function SelectorChip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: string;
  onClick?: () => void;
}) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        px: 1.2,
        py: 0.6,
        minHeight: 40,
        borderRadius: 999,
        bgcolor: active ? figmaTokens.colors.primary : alpha(figmaTokens.colors.surface, 0.92),
        color: active ? "#FFF" : figmaTokens.colors.textSecondary,
        boxShadow: active ? "0 6px 14px rgba(37,99,216,0.2)" : "none",
        border: `1px solid ${active ? alpha(figmaTokens.colors.primary, 0.64) : alpha(figmaTokens.colors.outline, 0.52)}`,
        whiteSpace: "nowrap",
        transition: "all .18s ease",
        "&:focus-visible": {
          outline: `2px solid ${alpha(figmaTokens.colors.primary, 0.42)}`,
          outlineOffset: 1,
        },
      }}
    >
      <Typography sx={{ fontSize: 11, fontWeight: 600 }}>{children}</Typography>
    </ButtonBase>
  );
}

function SelectorGroup({
  label,
  items,
}: {
  label: string;
  items: ReactNode;
}) {
  return (
    <Stack spacing={0.7}>
      <Typography sx={{ color: alpha(figmaTokens.colors.textMuted, 0.95), fontSize: 11, fontWeight: 700 }}>
        {label}
      </Typography>
      <Stack
        direction="row"
        useFlexGap
        spacing={0.6}
        flexWrap="wrap"
        sx={{
          pb: 0.15,
          rowGap: 0.6,
        }}
      >
        {items}
      </Stack>
    </Stack>
  );
}

function CatalogRow({
  widgetId,
  title,
  active,
  onClick,
  onDragStart,
  onDragEnd,
}: {
  widgetId: WidgetId;
  title: string;
  active?: boolean;
  onClick: () => void;
  onDragStart: (event: DragEvent<HTMLElement>) => void;
  onDragEnd: () => void;
}) {
  return (
    <ButtonBase
      draggable
      onClick={onClick}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      sx={{
        width: "100%",
        justifyContent: "flex-start",
        px: 1.2,
        py: 1.1,
        borderRadius: 2.6,
        background: active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.74)",
        border: `1px solid ${active ? "rgba(85,126,231,.32)" : "rgba(195,198,217,.42)"}`,
        boxShadow: active ? "0 8px 18px rgba(67,85,133,0.08)" : "none",
      }}
    >
      <Stack direction="row" spacing={0.95} alignItems="center" sx={{ width: "100%" }}>
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            bgcolor: "rgba(115,145,255,0.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Box sx={{ color: "#4B67C8", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {v6HeaderIcon(widgetId)}
          </Box>
        </Box>
        <Stack sx={{ minWidth: 0, textAlign: "left", flex: 1 }}>
          <Typography sx={{ color: "#2B3248", fontSize: 11.8, fontWeight: 700 }} noWrap>
            {title}
          </Typography>
        </Stack>
      </Stack>
    </ButtonBase>
  );
}

function WideCatalogEntry({
  widgetId,
  title,
  sizeOptions,
  previewSize,
  previewState,
  stateOptions,
  dragging,
  onSizeChange,
  onStateChange,
  onPointerStart,
  onDragStart,
  onDragEnd,
  resolveDragPayload,
}: {
  widgetId: WidgetId;
  title: string;
  sizeOptions: WidgetSize[];
  previewSize: WidgetSize;
  previewState?: string;
  stateOptions: Array<{ key: string; label: string }>;
  dragging: boolean;
  onSizeChange: (size: WidgetSize) => void;
  onStateChange: (state: string) => void;
  onPointerStart: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  resolveDragPayload: () => { size: WidgetSize; state?: string };
}) {
  return (
    <Box
      sx={{
        borderRadius: 3.2,
        border: `1px solid ${alpha(figmaTokens.colors.outline, 0.55)}`,
        background: alpha(figmaTokens.colors.surface, 0.96),
        boxShadow: "0 8px 18px rgba(67,85,133,0.07)",
        p: 1.3,
      }}
    >
      <Stack spacing={1.1}>
        <Typography sx={{ color: figmaTokens.colors.textPrimary, fontSize: 16, fontWeight: 700, lineHeight: 1.18 }}>
          {title}
        </Typography>

        <PreviewCard
          widgetId={widgetId}
          title={title}
          previewSize={previewSize}
          previewState={previewState}
          dragging={dragging}
          resolveDragPayload={resolveDragPayload}
          onPointerStart={onPointerStart}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />

        <SelectorGroup
          label="Вид"
          items={stateOptions.map((option) => (
            <SelectorChip
              key={option.key}
              active={previewState === option.key}
              onClick={() => onStateChange(option.key)}
            >
              {option.label}
            </SelectorChip>
          ))}
        />

        <SelectorGroup
          label="Размер"
          items={sizeOptions.map((size) => (
            <SelectorChip key={size} active={previewSize === size} onClick={() => onSizeChange(size)}>
              {SIZE_LABELS[size]}
            </SelectorChip>
          ))}
        />
      </Stack>
    </Box>
  );
}

export default function MacWidgetLibrary({
  role,
  selected: _selected,
  hidden: _hidden,
  deleted: _deleted,
  recommended: _recommended,
  collapsed,
  isDirty,
  isSaving = false,
  onExpandedMode,
  onToggleCompact,
  onBeginDrag,
  onEndDrag,
  onReset,
  onSave,
  onApplyPreset,
}: MacWidgetLibraryProps) {
  const [category, setCategory] = useState<(typeof CATEGORY_ITEMS)[number]["key"]>("all");
  const [activeWidgetId, setActiveWidgetId] = useState<WidgetId | null>(null);
  const [draggingId, setDraggingId] = useState<WidgetId | null>(null);
  const [previewSizes, setPreviewSizes] = useState<Partial<Record<WidgetId, WidgetSize>>>({});
  const [previewStates, setPreviewStates] = useState<Partial<Record<WidgetId, string>>>({});
  const previewSizesRef = useRef(previewSizes);
  const previewStatesRef = useRef(previewStates);
  const [search, setSearch] = useState("");

  previewSizesRef.current = previewSizes;
  previewStatesRef.current = previewStates;

  const allowedWidgets = useMemo(
    () => WIDGET_REGISTRY.filter((widget) => !widget.allowedRoles.length || widget.allowedRoles.includes(role)),
    [role],
  );

  const filtered = useMemo(() => {
    return allowedWidgets.filter((widget) => {
      const categoryMatch = category === "all" || widget.libraryCategory === category;
      const query = search.trim().toLowerCase();
      const searchMatch =
        !query ||
        widget.title.toLowerCase().includes(query) ||
        widget.description.toLowerCase().includes(query);
      return categoryMatch && searchMatch;
    });
  }, [allowedWidgets, category, search]);

  useEffect(() => {
    if (!activeWidgetId) return;
    const targetWidget = filtered.find((widget) => widget.id === activeWidgetId) ?? null;
    if (activeWidgetId && !targetWidget) {
      setActiveWidgetId(null);
    }
  }, [activeWidgetId, filtered]);

  const handleBeginDrag = (widgetId: WidgetId) => {
    const widget = WIDGET_REGISTRY.find((w) => w.id === widgetId);
    if (!widget) return;
    const defaultState = widget.defaultGalleryState ?? widget.stateOptions?.[0]?.key ?? "default";
    const stateOptions = getV8GalleryStateOptions(widget, previewStatesRef.current[widgetId] ?? defaultState);
    const resolvedState =
      stateOptions.find((stateOption) => stateOption.key === previewStatesRef.current[widgetId])?.key ??
      stateOptions[0]?.key ??
      defaultState;
    const sizeCandidates = getV8GallerySizeOptions(
      widget,
      resolvedState,
      previewSizesRef.current[widgetId] ?? widget.defaultSize,
    );
    const resolvedSize = sizeCandidates.includes(previewSizesRef.current[widgetId] as WidgetSize)
      ? (previewSizesRef.current[widgetId] as WidgetSize)
      : (sizeCandidates[0] ?? widget.defaultSize);
    setDraggingId(widgetId);
    onBeginDrag({ widgetId, size: resolvedSize, state: resolvedState });
  };

  const handleEndDrag = () => {
    setDraggingId(null);
    onEndDrag();
  };

  return (
    <Box
      sx={{
        height: "100%",
        minHeight: 0,
        pl: 0,
        pr: collapsed ? 0.7 : 1,
        pt: 0,
        pb: 1,
        transition: "padding .22s ease",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
        height: "100%",
        borderRadius: "0 28px 28px 0",
        overflow: "hidden",
        background: "rgba(248, 250, 255, 0.96)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(195,198,217,.62)",
        boxShadow: "0 18px 44px rgba(55, 69, 111, 0.16)",
          display: "grid",
          gridTemplateColumns: "1fr",
          position: "relative",
        }}
      >
        <ButtonBase
          onClick={collapsed ? onExpandedMode : onToggleCompact}
          sx={{
            position: "absolute",
            top: 14,
            right: 14,
            zIndex: 3,
            width: 34,
            height: 34,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.9)",
            color: "#616A88",
            border: "1px solid rgba(195,198,217,.65)",
            boxShadow: "0 4px 10px rgba(67,85,133,0.08)",
          }}
        >
          {collapsed ? (
            <KeyboardDoubleArrowRightRoundedIcon sx={{ fontSize: 18 }} />
          ) : (
            <KeyboardDoubleArrowLeftRoundedIcon sx={{ fontSize: 18 }} />
          )}
        </ButtonBase>

        <Stack sx={{ p: collapsed ? 0.95 : 1.25, minWidth: 0, overflow: "hidden", minHeight: 0 }}>
          {collapsed ? (
            <Box sx={{ mb: 1 }}>
              <Stack
                direction="row"
                spacing={0.65}
                sx={{
                  overflowX: "auto",
                  overflowY: "hidden",
                  whiteSpace: "nowrap",
                  flexWrap: "nowrap",
                  pb: 0.15,
                  "&::-webkit-scrollbar": { display: "none" },
                  scrollbarWidth: "none",
                }}
              >
                {CATEGORY_ITEMS.map((item) => (
                  <ButtonBase
                    key={item.key}
                    onClick={() => setCategory(item.key)}
                    sx={{
                      px: 1.1,
                      py: 0.58,
                      borderRadius: 999,
                      color: category === item.key ? "#2B3248" : "rgba(67,71,90,.82)",
                      bgcolor: category === item.key ? "#FFFFFF" : "rgba(255,255,255,0.56)",
                      border: `1px solid ${category === item.key ? "rgba(195,198,217,.6)" : "rgba(195,198,217,.3)"}`,
                    }}
                  >
                    <Typography sx={{ fontSize: 11.5, fontWeight: category === item.key ? 700 : 500 }}>
                      {item.label}
                    </Typography>
                  </ButtonBase>
                ))}
              </Stack>
            </Box>
          ) : (
            <Box sx={{ mb: 1.2 }}>
              <Box
                sx={{
                  mb: 1,
                  pr: 5.4,
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{
                    minHeight: 44,
                    px: 1.2,
                    borderRadius: 999,
                    bgcolor: "rgba(255,255,255,0.86)",
                    border: "1px solid rgba(195,198,217,.52)",
                    boxShadow: "0 4px 10px rgba(67,85,133,0.05)",
                  }}
                >
                  <SearchRoundedIcon sx={{ fontSize: 18, color: "rgba(67,71,90,.56)" }} />
                  <InputBase
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Поиск в виджетах"
                    sx={{
                      flex: 1,
                      color: "#2B3248",
                      fontSize: 13,
                      "& input::placeholder": {
                        color: "rgba(67,71,90,.56)",
                        opacity: 1,
                      },
                    }}
                  />
                </Stack>
              </Box>
              <Stack
                direction="row"
                spacing={0.75}
                useFlexGap
                flexWrap="wrap"
                sx={{
                  pr: 5.4,
                }}
              >
                {CATEGORY_ITEMS.map((item) => (
                  <ButtonBase
                    key={item.key}
                    onClick={() => setCategory(item.key)}
                    sx={{
                      px: 1.35,
                      py: 0.72,
                      borderRadius: 999,
                      color: category === item.key ? "#2B3248" : "rgba(67,71,90,.82)",
                      bgcolor: category === item.key ? "#FFFFFF" : "rgba(255,255,255,0.56)",
                      border: `1px solid ${category === item.key ? "rgba(195,198,217,.6)" : "rgba(195,198,217,.3)"}`,
                      boxShadow: category === item.key ? "0 4px 10px rgba(67,85,133,0.06)" : "none",
                    }}
                  >
                    <Typography sx={{ fontSize: 12, fontWeight: category === item.key ? 700 : 500 }}>
                      {item.label}
                    </Typography>
                  </ButtonBase>
                ))}
              </Stack>
            </Box>
          )}

          <Stack sx={{ minHeight: 0, overflowY: "auto", pr: 0.4, flex: 1 }}>
            <Typography sx={{ color: "rgba(67,71,90,.56)", fontSize: 12, fontWeight: 700, mb: 1.1 }}>
              {collapsed
                ? "Каталог"
                : category === "all"
                  ? "Каталог виджетов"
                  : CATEGORY_ITEMS.find((item) => item.key === category)?.label}
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 0.85 }}>
              {filtered.map((widget) => {
                const defaultState = widget.defaultGalleryState ?? widget.stateOptions?.[0]?.key;
                const selectedSize = previewSizes[widget.id] ?? widget.defaultSize;
                const rawState = previewStates[widget.id] ?? defaultState;
                const stateOptions = getV8GalleryStateOptions(widget, rawState);
                const state = stateOptions.some((option) => option.key === rawState)
                  ? rawState
                  : stateOptions[0]?.key ?? rawState;
                const sizeOptions = getV8GallerySizeOptions(widget, state, selectedSize);
                const size = sizeOptions.includes(selectedSize)
                  ? selectedSize
                  : (sizeOptions[0] ?? selectedSize);
                return (
                  <Box key={widget.id} onClick={() => setActiveWidgetId(widget.id)}>
                    {collapsed ? (
                      <Stack spacing={0.75}>
                        <CatalogRow
                          widgetId={widget.id}
                          title={widget.title}
                          active={activeWidgetId === widget.id}
                          onClick={() =>
                            setActiveWidgetId((current) => (current === widget.id ? null : widget.id))
                          }
                          onDragStart={(event) => {
                            const dragStateOptions = getV8GalleryStateOptions(
                              widget,
                              previewStatesRef.current[widget.id] ?? defaultState,
                            );
                            const dragState =
                              dragStateOptions.find((stateOption) => stateOption.key === previewStatesRef.current[widget.id])?.key ??
                              dragStateOptions[0]?.key ??
                              defaultState;
                            const dragSizeOptions = getV8GallerySizeOptions(
                              widget,
                              dragState,
                              previewSizesRef.current[widget.id] ?? size,
                            );
                            const dragSize = dragSizeOptions.includes(previewSizesRef.current[widget.id] as WidgetSize)
                              ? (previewSizesRef.current[widget.id] as WidgetSize)
                              : (dragSizeOptions[0] ?? size);
                            event.dataTransfer.effectAllowed = "copyMove";
                            setLibraryWidgetDragData(event, {
                              widgetId: widget.id,
                              size: dragSize,
                              state: dragState,
                            });
                            setDraggingId(widget.id);
                            onBeginDrag({
                              widgetId: widget.id,
                              size: dragSize,
                              state: dragState,
                            });
                          }}
                          onDragEnd={handleEndDrag}
                        />
                        {activeWidgetId === widget.id && (
                          <Box
                            sx={{
                              px: 0.3,
                              pb: 0.25,
                            }}
                          >
                            <PreviewCard
                              widgetId={widget.id}
                              title={widget.title}
                              previewSize={size}
                              previewState={state}
                              dragging={draggingId === widget.id}
                              compact
                              resolveDragPayload={() => {
                                const ds =
                                  widget.defaultGalleryState ?? widget.stateOptions?.[0]?.key;
                                return {
                                  size: previewSizesRef.current[widget.id] ?? size,
                                  state: previewStatesRef.current[widget.id] ?? ds,
                                };
                              }}
                              onPointerStart={() => handleBeginDrag(widget.id)}
                              onDragStart={() => handleBeginDrag(widget.id)}
                              onDragEnd={handleEndDrag}
                            />
                          </Box>
                        )}
                      </Stack>
                    ) : (
                      <WideCatalogEntry
                        widgetId={widget.id}
                        title={widget.title}
                        sizeOptions={sizeOptions}
                        stateOptions={stateOptions}
                        previewSize={size}
                        previewState={state}
                        dragging={draggingId === widget.id}
                        onSizeChange={(nextSize) => {
                          previewSizesRef.current = { ...previewSizesRef.current, [widget.id]: nextSize };
                          setPreviewSizes((current) => ({ ...current, [widget.id]: nextSize }));
                        }}
                        onStateChange={(nextState) => {
                          const nextSizeOptions = getV8GallerySizeOptions(
                            widget,
                            nextState,
                            previewSizesRef.current[widget.id] ?? size,
                          );
                          const nextSize =
                            previewSizesRef.current[widget.id] &&
                            nextSizeOptions.includes(previewSizesRef.current[widget.id] as WidgetSize)
                              ? (previewSizesRef.current[widget.id] as WidgetSize)
                              : (nextSizeOptions[0] ?? size);
                          previewStatesRef.current = { ...previewStatesRef.current, [widget.id]: nextState };
                          setPreviewStates((current) => ({ ...current, [widget.id]: nextState }));
                          previewSizesRef.current = { ...previewSizesRef.current, [widget.id]: nextSize };
                          setPreviewSizes((current) => ({ ...current, [widget.id]: nextSize }));
                        }}
                        resolveDragPayload={() => ({
                          size: (() => {
                            const nextState =
                              previewStatesRef.current[widget.id] ??
                              (widget.defaultGalleryState ?? widget.stateOptions?.[0]?.key);
                            const nextSizeOptions = getV8GallerySizeOptions(
                              widget,
                              nextState,
                              previewSizesRef.current[widget.id] ?? size,
                            );
                            const currentSize = previewSizesRef.current[widget.id] ?? size;
                            return nextSizeOptions.includes(currentSize)
                              ? currentSize
                              : (nextSizeOptions[0] ?? size);
                          })(),
                          state:
                            previewStatesRef.current[widget.id] ??
                            (widget.defaultGalleryState ?? widget.stateOptions?.[0]?.key),
                        })}
                        onPointerStart={() => handleBeginDrag(widget.id)}
                        onDragStart={() => handleBeginDrag(widget.id)}
                        onDragEnd={handleEndDrag}
                      />
                    )}
                  </Box>
                );
              })}
            </Box>
          </Stack>

          <Stack
            direction={collapsed ? "column" : "row"}
            spacing={0.9}
            sx={{
              pt: 1.1,
              mt: 1,
              borderTop: "1px solid rgba(195,198,217,.5)",
              background: "linear-gradient(180deg, rgba(248,250,255,0.0) 0%, rgba(248,250,255,0.96) 28%)",
            }}
          >
            <Stack
              direction="row"
              spacing={0.7}
              sx={{ width: "100%", mb: 0.25, justifyContent: "space-between" }}
            >
              <ButtonBase
                onClick={() => onApplyPreset("executive")}
                sx={{
                  minHeight: 34,
                  px: 1.2,
                  borderRadius: 2,
                  border: "1px solid rgba(195,198,217,.7)",
                  bgcolor: "#FFFFFF",
                  color: "#4A536D",
                  flex: 1,
                }}
              >
                <Typography sx={{ fontSize: 11.5, fontWeight: 600 }}>Рабочий стол 1</Typography>
              </ButtonBase>
              <ButtonBase
                onClick={() => onApplyPreset("operator")}
                sx={{
                  minHeight: 34,
                  px: 1.2,
                  borderRadius: 2,
                  border: "1px solid rgba(195,198,217,.7)",
                  bgcolor: "#FFFFFF",
                  color: "#4A536D",
                  flex: 1,
                }}
              >
                <Typography sx={{ fontSize: 11.5, fontWeight: 600 }}>Рабочий стол 2</Typography>
              </ButtonBase>
              <ButtonBase
                onClick={() => onApplyPreset("balanced")}
                sx={{
                  minHeight: 34,
                  px: 1.2,
                  borderRadius: 2,
                  border: "1px solid rgba(195,198,217,.7)",
                  bgcolor: "#FFFFFF",
                  color: "#4A536D",
                  flex: 1,
                }}
              >
                <Typography sx={{ fontSize: 11.5, fontWeight: 600 }}>Рабочий стол 3</Typography>
              </ButtonBase>
            </Stack>
            <ButtonBase
              onClick={onReset}
              sx={{
                minHeight: 42,
                px: 1.6,
                borderRadius: 2.5,
                border: "1px solid rgba(195,198,217,.7)",
                bgcolor: "#FFFFFF",
                color: "#4A536D",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(67,85,133,0.06)",
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Отменить</Typography>
            </ButtonBase>
            <ButtonBase
              onClick={onSave}
              disabled={!isDirty || isSaving}
              sx={{
                minHeight: 42,
                px: 1.6,
                borderRadius: 2.5,
                bgcolor: !isDirty || isSaving ? "rgba(63,112,212,0.34)" : "#2F6BDE",
                color: "#FFFFFF",
                justifyContent: "center",
                boxShadow: !isDirty || isSaving ? "none" : "0 8px 18px rgba(47,107,222,0.26)",
                transition: "background .18s ease, box-shadow .18s ease",
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                {isSaving ? "Сохранение..." : "Сохранить"}
              </Typography>
            </ButtonBase>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
