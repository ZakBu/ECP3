import { Box, Chip, Stack, Typography } from "@mui/material";
import { Suspense, useMemo, useState, type ComponentType } from "react";
import {
  WIDGET_REGISTRY,
  getV8GallerySizeOptions,
  getV8GalleryStateOptions,
} from "../features/widgetDashboard/components/WidgetCatalog/WidgetCatalog.data";
import WidgetShell from "../features/widgetDashboard/components/WidgetShell/WidgetShell";
import {
  getDimensionForSize,
  getNominalPixelSizeForGridDimension,
} from "../features/widgetDashboard/config/widgetSizing";
import type { WidgetId, WidgetSize } from "../features/widgetDashboard/types/widget.types";

const CATEGORY_LABELS: Record<string, string> = {
  analytics: "Аналитика",
  work: "Операционные",
  info: "Информационные",
};

const SIZE_LABELS: Partial<Record<WidgetSize, string>> = {
  compact: "Compact · 1x1",
  tall: "Tall · 1x2",
  standard: "Standard · 2x1",
  square: "Square · 2x2",
  wide: "Wide · 3x1",
  wideTall: "WideTall · 3x2",
  wide4x2: "Wide 4x2",
  xwide: "XWide · 8x1",
  xl: "XL · 8x2",
};

function WidgetStatePreviewCard({
  widgetId,
  title,
  category,
  state,
  size,
  zoom,
}: {
  widgetId: WidgetId;
  title: string;
  category: "analytics" | "operational" | "informational";
  state?: string;
  size: WidgetSize;
  zoom: number;
}) {
  const definition = WIDGET_REGISTRY.find((item) => item.id === widgetId);
  const Component = definition?.component as ComponentType<{
    widgetId?: WidgetId;
    size?: WidgetSize;
    state?: string;
  }>;
  const gridDim = getDimensionForSize(size);
  const { width, height } = getNominalPixelSizeForGridDimension(gridDim);
  const scale = zoom;
  const scaledWidth = Math.max(120, Math.round(width * scale));
  const scaledHeight = Math.max(100, Math.round(height * scale));

  return (
    <Box sx={{ minWidth: scaledWidth }}>
      <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 0.8 }}>
        <Chip size="small" label={state ?? "default"} />
        <Typography sx={{ fontSize: 11, color: "text.secondary" }}>{SIZE_LABELS[size] ?? size}</Typography>
      </Stack>
      <Box
        sx={{
          width: scaledWidth,
          height: scaledHeight,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2.5,
          backgroundColor: "#fff",
          overflow: "hidden",
        }}
      >
        <Box sx={{ width: "100%", height: "100%", overflow: "hidden", borderRadius: 2, background: "linear-gradient(180deg, #F8FAFF 0%, #EFF3FB 100%)" }}>
          <Box
            sx={{
              width,
              height,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <WidgetShell
              instanceId={`library-${widgetId}-${state ?? "default"}-${size}`}
              widgetId={widgetId}
              state={state}
              title={title}
              category={category}
              isEditing={false}
            >
              <Suspense fallback={<Box sx={{ p: 2, fontSize: 12 }}>Loading…</Box>}>
                {Component ? <Component widgetId={widgetId} size={size} state={state} /> : null}
              </Suspense>
            </WidgetShell>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function WidgetLibraryPlayground() {
  const [activeCategory, setActiveCategory] = useState<"all" | "analytics" | "work" | "info">("all");
  const [zoom, setZoom] = useState(0.9);
  const widgets = useMemo(
    () => WIDGET_REGISTRY.filter((widget) => (activeCategory === "all" ? true : widget.libraryCategory === activeCategory)),
    [activeCategory],
  );
  const [activeWidgetId, setActiveWidgetId] = useState<WidgetId>(widgets[0]?.id ?? "kpi");

  const activeWidget = useMemo(
    () => widgets.find((item) => item.id === activeWidgetId) ?? widgets[0] ?? WIDGET_REGISTRY[0],
    [widgets, activeWidgetId],
  );

  const statesForWidget = useMemo(() => {
    const defaultState = activeWidget.defaultGalleryState ?? activeWidget.stateOptions?.[0]?.key ?? "default";
    return getV8GalleryStateOptions(activeWidget, defaultState);
  }, [activeWidget]);

  const groupedBySize = useMemo(() => {
    return activeWidget.allowedSizes.map((size) => {
      const stateOptions = statesForWidget.filter((stateOption) =>
        getV8GallerySizeOptions(activeWidget, stateOption.key, activeWidget.defaultSize).includes(size),
      );
      return { size, stateOptions };
    });
  }, [activeWidget, statesForWidget]);

  return (
    <Box sx={{ backgroundColor: "#ECEEF7", minHeight: "100vh" }}>
      <Box
        sx={{
          height: 58,
          px: 2.4,
          display: "flex",
          alignItems: "center",
          gap: 1.2,
          color: "#fff",
          background: "linear-gradient(135deg, #0C40B0 0%, #1857C0 55%, #2B6BD8 100%)",
          boxShadow: "0 2px 16px rgba(24,87,192,.38)",
        }}
      >
        <Box sx={{ width: 36, height: 36, borderRadius: 2, border: "1px solid rgba(255,255,255,.18)", background: "rgba(255,255,255,.14)" }} />
        <Typography sx={{ fontWeight: 600 }}>ECP3 Widget Library</Typography>
        <Chip size="small" label="LIVE FROM CODE" sx={{ ml: 0.5, bgcolor: "rgba(255,255,255,.14)", color: "#fff" }} />
        <Typography sx={{ ml: "auto", fontSize: 12, opacity: 0.8 }}>Категория: {activeCategory === "all" ? "Все" : CATEGORY_LABELS[activeCategory]}</Typography>
      </Box>

      <Box sx={{ borderBottom: "1px solid rgba(195,198,217,.55)", bgcolor: "#E8EAF3", px: 1.4, py: 0.6, overflowX: "auto" }}>
        <Stack direction="row" spacing={0.8}>
          {widgets.map((widget) => (
            <Chip
              key={widget.id}
              clickable
              color={activeWidget.id === widget.id ? "primary" : "default"}
              label={widget.title}
              onClick={() => setActiveWidgetId(widget.id)}
            />
          ))}
        </Stack>
      </Box>

      <Box sx={{ p: 3.2 }}>
        <Stack spacing={0.8} sx={{ mb: 2.2 }}>
          <Typography sx={{ fontSize: 26, fontWeight: 300 }}>{activeWidget.title}</Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
            Виджет: `{activeWidget.id}` · категория: {CATEGORY_LABELS[activeWidget.libraryCategory]} · состояний: {statesForWidget.length}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 2.5 }}>
          {(["all", "analytics", "work", "info"] as const).map((item) => (
            <Chip
              key={item}
              clickable
              color={activeCategory === item ? "primary" : "default"}
              label={item === "all" ? "Все категории" : CATEGORY_LABELS[item]}
              onClick={() => setActiveCategory(item)}
            />
          ))}
        </Stack>
        <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 2.5 }}>
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>Масштаб</Typography>
          <input
            type="range"
            min={0.5}
            max={1.25}
            step={0.05}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
          />
          <Typography sx={{ fontSize: 12, color: "text.secondary", minWidth: 44 }}>{Math.round(zoom * 100)}%</Typography>
        </Stack>

        <Stack spacing={3}>
          {groupedBySize
            .filter((group) => group.stateOptions.length > 0)
            .map((group) => (
              <Box key={`${activeWidget.id}-${group.size}`}>
                <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "text.secondary", mb: 1.3 }}>
                  {SIZE_LABELS[group.size] ?? group.size}
                </Typography>
                <Stack direction="row" spacing={2} useFlexGap sx={{ overflowX: "auto", pb: 1 }}>
                  {group.stateOptions.map((stateOption) => (
                    <WidgetStatePreviewCard
                      key={`${activeWidget.id}-${group.size}-${stateOption.key}`}
                      widgetId={activeWidget.id}
                      title={activeWidget.title}
                      category={activeWidget.category}
                      state={stateOption.key}
                      size={group.size}
                      zoom={zoom}
                    />
                  ))}
                </Stack>
              </Box>
            ))}
        </Stack>
      </Box>
    </Box>
  );
}
