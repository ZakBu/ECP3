import {
  Alert,
  Box,
  Button,
  Paper,
  Skeleton,
  Snackbar,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type DragEvent as ReactDragEvent,
} from "react";
import DashboardGrid from "../../features/widgetDashboard/components/DashboardGrid/DashboardGrid";
import MacWidgetLibrary from "../../features/widgetDashboard/components/MacWidgetLibrary/MacWidgetLibrary";
import {
  getV8GallerySizeOptions,
  WIDGET_REGISTRY,
} from "../../features/widgetDashboard/components/WidgetCatalog/WidgetCatalog.data";
import WidgetShell from "../../features/widgetDashboard/components/WidgetShell/WidgetShell";
import { DASHBOARD_PRESETS } from "../../features/widgetDashboard/config/dashboardPresets";
import {
  computeSquareDashboardMetrics,
  findNearestFit,
  getAllowedSizesForState,
  getDimensionForSize,
  getDashboardLayoutMaxRows,
  getWidgetDefinition,
  isLayoutValid,
  DASHBOARD_GRID_COLS,
  DASHBOARD_GRID_MARGIN_X,
  DASHBOARD_GRID_MARGIN_Y,
  normalizeLayoutItem,
  setDashboardLayoutMaxRows,
} from "../../features/widgetDashboard/config/widgetSizing";
import { useDashboardConfig } from "../../features/widgetDashboard/hooks/useDashboardConfig";
import { useEditMode } from "../../features/widgetDashboard/hooks/useEditMode";
import { useDashboardStore } from "../../features/widgetDashboard/store/dashboardStore";
import type { UserRole } from "../../features/widgetDashboard/types/role.types";
import type {
  DraggingLibraryWidget,
  LayoutItem,
  WidgetId,
  WidgetSize,
} from "../../features/widgetDashboard/types/widget.types";
import { figmaTokens } from "../../theme/figmaTokens";
import { useDashboardCanvasSize } from "./hooks/useDashboardCanvasSize";
import { useHomePageUiState } from "./hooks/useHomePageUiState";
import LeftNav from "./components/LeftNav";
import TopBar from "./components/TopBar";
import WidgetContextMenu from "./components/WidgetContextMenu";

const userId = "demo-user-v6";
const role: UserRole = "head";
const MIN_DASHBOARD_ROWS = 8;
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

const roleToPresetMap: Record<UserRole, keyof typeof DASHBOARD_PRESETS> = {
  head: "executive",
  specialist: "operator",
  admin: "balanced",
  reader: "balanced",
};

function countByWidget(layout: LayoutItem[]): Record<WidgetId, number> {
  return layout.reduce((acc, item) => {
    acc[item.widgetId] = (acc[item.widgetId] ?? 0) + 1;
    return acc;
  }, {} as Record<WidgetId, number>);
}

function buildInstanceId(widgetId: WidgetId): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${widgetId}-${crypto.randomUUID()}`;
  }
  return `${widgetId}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export default function HomePage() {
  const {
    persistedLayout,
    draftLayout,
    isEditing,
    setLayout,
    deleteWidget,
    addWidget,
    applyTemplateToDraft,
    startEdit,
    resetDraftToDefault,
    getActiveLayout,
    isDirty,
    validationMessage,
    setValidationMessage,
    firstTimeSetup,
    refreshTimeContext,
    timeContext,
    role: userRole,
  } = useDashboardStore();

  const {
    isLoading,
    isSaving,
    loadError,
    actionError,
    save,
    resetPersisted,
    reload,
    clearActionError,
  } = useDashboardConfig(userId, role);

  const [toast, setToast] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const libraryPanelRef = useRef<HTMLDivElement | null>(null);
  const lastValidLayoutRef = useRef<LayoutItem[]>(getActiveLayout());
  const [libraryManualCompact, setLibraryManualCompact] = useState(false);
  const [dragPreview, setDragPreview] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
    valid: boolean;
  } | null>(null);

  useEditMode();
  const isNavCollapsed = useMediaQuery("(min-width:900px) and (max-width:1439.95px)");

  useEffect(() => {
    refreshTimeContext();
  }, [refreshTimeContext]);

  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);

  const { gridWidth, gridHeight } = useDashboardCanvasSize(contentRef);
  const activeLayout = getActiveLayout();
  const layoutRowExtent = useMemo(
    () => activeLayout.reduce((maxRow, item) => Math.max(maxRow, item.y + item.h), 0),
    [activeLayout],
  );

  const dashboardCanvasWidth = Math.max(280, Math.floor(gridWidth));
  const dashboardCanvasHeight = Math.max(280, Math.floor(gridHeight));

  const dashboardMetrics = useMemo(
    () =>
      computeSquareDashboardMetrics({
        canvasWidthPx: dashboardCanvasWidth,
        canvasHeightPx: dashboardCanvasHeight,
        layoutRowExtent,
        minContentRows: MIN_DASHBOARD_ROWS,
      }),
    [dashboardCanvasHeight, dashboardCanvasWidth, layoutRowExtent],
  );

  const gridCellSize = dashboardMetrics.cellSize;
  const dashboardMaxRows = dashboardMetrics.gridRowCount;
  const effectiveDashboardCanvasWidth = dashboardMetrics.gridPixelWidth;
  const editDotGridStepPx = gridCellSize + DASHBOARD_GRID_MARGIN_Y;

  useEffect(() => {
    setDashboardLayoutMaxRows(dashboardMaxRows);
  }, [dashboardMaxRows]);

  const widgetMap = useMemo(
    () => Object.fromEntries(WIDGET_REGISTRY.map((widget) => [widget.id, widget])),
    [],
  );
  const workingLayout = isEditing ? draftLayout : persistedLayout;
  const {
    draggingLibraryWidget,
    libraryCollapsedWhileDragging,
    selectedWidgetInstanceId,
    selectedWidgetItem,
    widgetContextMenuAnchor,
    widgetResizePreview,
    beginLibraryDrag,
    endLibraryDrag,
    collapseLibraryForDragExit,
    openWidgetMenu,
    closeWidgetMenu,
    setWidgetResizePreview,
  } = useHomePageUiState(activeLayout);

  const visibleWidgetCounts = useMemo(() => countByWidget(activeLayout), [activeLayout]);
  const hiddenItems = useMemo(
    () => workingLayout.filter((item) => item.hidden && !item.deleted),
    [workingLayout],
  );
  const deletedItems = useMemo(
    () => workingLayout.filter((item) => item.deleted),
    [workingLayout],
  );
  const hiddenWidgetCounts = useMemo(() => countByWidget(hiddenItems), [hiddenItems]);
  const deletedWidgetCounts = useMemo(() => countByWidget(deletedItems), [deletedItems]);

  const recommendedWidgetIds = useMemo(() => {
    const preset = DASHBOARD_PRESETS[roleToPresetMap[userRole]].layout;
    return Array.from(new Set(preset.map((item) => item.widgetId)));
  }, [userRole]);

  const hiddenTotal = hiddenItems.length;
  const deletedTotal = deletedItems.length;

  const isEditViewportNarrow = isEditing && gridWidth < 760;
  const interactionLockedReason = isEditViewportNarrow
    ? "Редактирование доступно в широком режиме. Расширьте окно до desktop-ширины."
    : null;

  useEffect(() => {
    if (isLayoutValid(activeLayout)) {
      lastValidLayoutRef.current = activeLayout;
    }
  }, [activeLayout]);

  const libraryIsCompact = isEditing && (libraryCollapsedWhileDragging || libraryManualCompact);

  useEffect(() => {
    if (!isEditing || !draggingLibraryWidget) return;

    const marginPx = 20;
    const onDragOver: EventListener = (event) => {
      const e = event as globalThis.DragEvent;
      const panel = libraryPanelRef.current;
      if (!panel) return;
      const r = panel.getBoundingClientRect();
      const inside =
        e.clientX >= r.left - marginPx &&
        e.clientX <= r.right + marginPx &&
        e.clientY >= r.top - marginPx &&
        e.clientY <= r.bottom + marginPx;
      if (!inside) {
        collapseLibraryForDragExit();
      }
    };

    document.addEventListener("dragover", onDragOver);
    return () => document.removeEventListener("dragover", onDragOver);
  }, [isEditing, draggingLibraryWidget, collapseLibraryForDragExit]);

  const handleSave = useCallback(async () => {
    const ok = await save();
    if (ok) {
      setToast("Настройки сохранены");
    }
  }, [save]);

  const handleWidgetStateChange = useCallback(
    async (instanceId: string, nextState: string) => {
      const { isEditing: editing, setWidgetInstanceState } = useDashboardStore.getState();
      setWidgetInstanceState(instanceId, nextState);
      if (!editing) {
        await save();
      }
    },
    [save],
  );

  const handleResetDraft = useCallback(() => {
    resetDraftToDefault();
    setToast("Черновик сброшен к стандартному шаблону роли");
  }, [resetDraftToDefault]);

  const resolveResizeCandidate = useCallback(
    (instanceId: string, size: WidgetSize) => {
      const target = activeLayout.find((item) => item.i === instanceId);
      if (!target) {
        return { layoutItem: null, reason: "Виджет не найден" };
      }
      const definition = getWidgetDefinition(target.widgetId);
      if (!definition) {
        return { layoutItem: null, reason: "Неизвестный тип виджета" };
      }
      const allowedSizes = getAllowedSizesForState(definition, target.state);
      if (!allowedSizes.includes(size)) {
        return { layoutItem: null, reason: "Размер недоступен для этого состояния" };
      }
      const dimension = getDimensionForSize(size);
      const fit = findNearestFit(
        activeLayout,
        dimension.w,
        dimension.h,
        target.x,
        target.y,
        target.i,
      );
      if (!fit) {
        return { layoutItem: null, reason: "Нет места для этого размера" };
      }
      return {
        layoutItem: normalizeLayoutItem({
          ...target,
          x: fit.x,
          y: fit.y,
          w: dimension.w,
          h: dimension.h,
          size,
        }),
        reason: null,
      };
    },
    [activeLayout],
  );

  const updateDragPreview = useCallback(
    (clientX: number, clientY: number) => {
      if (!draggingLibraryWidget || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const dimension = getDimensionForSize(draggingLibraryWidget.size);
      const stepX = gridCellSize + DASHBOARD_GRID_MARGIN_X;
      const stepY = gridCellSize + DASHBOARD_GRID_MARGIN_Y;
      const preferredX = Math.max(
        0,
        Math.min(
          DASHBOARD_GRID_COLS - dimension.w,
          Math.round((clientX - rect.left - gridCellSize / 2) / stepX),
        ),
      );
      const preferredY = Math.max(
        0,
        Math.min(
          getDashboardLayoutMaxRows() - dimension.h,
          Math.round((clientY - rect.top - gridCellSize / 2) / stepY),
        ),
      );
      const fit = findNearestFit(activeLayout, dimension.w, dimension.h, preferredX, preferredY);

      setDragPreview({
        x: fit?.x ?? preferredX,
        y: fit?.y ?? preferredY,
        w: dimension.w,
        h: dimension.h,
        valid: Boolean(fit),
      });
    },
    [activeLayout, draggingLibraryWidget, gridCellSize],
  );

  const finishLibraryPointerDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (!draggingLibraryWidget) return;

      const rect = canvasRef.current?.getBoundingClientRect();
      const isInsideCanvas = Boolean(
        rect &&
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom,
      );

      if (isInsideCanvas && rect) {
        const dimension = getDimensionForSize(draggingLibraryWidget.size);
        const stepX = gridCellSize + DASHBOARD_GRID_MARGIN_X;
        const stepY = gridCellSize + DASHBOARD_GRID_MARGIN_Y;
        const preferredX = Math.max(
          0,
          Math.min(
            DASHBOARD_GRID_COLS - dimension.w,
            Math.round((clientX - rect.left - gridCellSize / 2) / stepX),
          ),
        );
        const preferredY = Math.max(
          0,
          Math.min(
            getDashboardLayoutMaxRows() - dimension.h,
            Math.round((clientY - rect.top - gridCellSize / 2) / stepY),
          ),
        );
        const fit = findNearestFit(activeLayout, dimension.w, dimension.h, preferredX, preferredY);

        if (!fit) {
          setToast("Для этого виджета сейчас нет свободного места на холсте");
        } else {
          addWidget(
            normalizeLayoutItem({
              widgetId: draggingLibraryWidget.widgetId,
              i: buildInstanceId(draggingLibraryWidget.widgetId),
              x: fit.x,
              y: fit.y,
              w: dimension.w,
              h: dimension.h,
              size: draggingLibraryWidget.size,
              state: draggingLibraryWidget.state,
            }),
          );
          setToast("Виджет добавлен на холст");
        }
      }

      endLibraryDrag();
      setDragPreview(null);
    },
    [
      addWidget,
      activeLayout,
      draggingLibraryWidget,
      endLibraryDrag,
      gridCellSize,
    ],
  );

  useEffect(() => {
    if (!draggingLibraryWidget) return undefined;

    const handleMouseMove = (event: MouseEvent) => {
      updateDragPreview(event.clientX, event.clientY);
    };

    const handleMouseUp = (event: MouseEvent) => {
      finishLibraryPointerDrag(event.clientX, event.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [draggingLibraryWidget, finishLibraryPointerDrag, updateDragPreview]);

  const renderLayoutItem = useCallback(
    (item: LayoutItem, fallbackHeight = 120) => {
      const widget = widgetMap[item.widgetId];
      if (!widget) return null;
      const Component = widget.component as unknown as ComponentType<{
        widgetId?: WidgetId;
        size?: WidgetSize;
        state?: string;
        onStateChange?: (nextState: string) => void;
      }>;
      return (
        <WidgetShell
          instanceId={item.i}
          widgetId={item.widgetId}
          state={item.state}
          title={widget.title}
          category={widget.category}
          isEditing={isEditing}
          isSelected={isEditing && selectedWidgetInstanceId === item.i}
          onActivate={(_, anchor) => openWidgetMenu(item.i, anchor)}
        >
          <Suspense fallback={<Skeleton variant="rounded" height={fallbackHeight} />}>
            <Component
              widgetId={item.widgetId}
              size={item.size ?? widget.defaultSize}
              state={item.state}
              onStateChange={(next) => void handleWidgetStateChange(item.i, next)}
            />
          </Suspense>
        </WidgetShell>
      );
    },
    [handleWidgetStateChange, isEditing, openWidgetMenu, selectedWidgetInstanceId, widgetMap],
  );

  const selectedWidgetDefinition = selectedWidgetItem
    ? getWidgetDefinition(selectedWidgetItem.widgetId)
    : undefined;

  const selectedWidgetSizeOptions = selectedWidgetDefinition && selectedWidgetItem
    ? getV8GallerySizeOptions(selectedWidgetDefinition, selectedWidgetItem.state, selectedWidgetItem.size)
    : [];

  const handleCanvasDrop = useCallback(
    (event: ReactDragEvent) => {
      let parsed: Partial<DraggingLibraryWidget> | null = null;
      try {
        const raw =
          event.dataTransfer.getData("application/ecp-widget") ||
          event.dataTransfer.getData("text/plain");
        if (raw) parsed = JSON.parse(raw) as Partial<DraggingLibraryWidget>;
      } catch {
        /* ignore malformed transfer */
      }

      const base = draggingLibraryWidget;
      const widgetId = (parsed?.widgetId ?? base?.widgetId) as WidgetId | undefined;
      if (!widgetId) return;

      const definition = getWidgetDefinition(widgetId);
      const defaultState = definition?.defaultGalleryState ?? definition?.stateOptions?.[0]?.key;

      /** Слияние: в transfer часто нет `state` (JSON.stringify выбрасывает undefined), тогда берём из React-состояния dnd. */
      const resolved: DraggingLibraryWidget = {
        widgetId,
        size: (parsed?.size ?? base?.size ?? "compact") as WidgetSize,
        state: parsed?.state ?? base?.state ?? defaultState,
      };
      if (!dragPreview?.valid) {
        setToast("Для этого виджета сейчас нет свободного места на холсте");
        endLibraryDrag();
        setDragPreview(null);
        return;
      }

      addWidget(
        normalizeLayoutItem({
          widgetId: resolved.widgetId,
          i: buildInstanceId(resolved.widgetId),
          x: dragPreview.x,
          y: dragPreview.y,
          w: dragPreview.w,
          h: dragPreview.h,
          size: resolved.size,
          state: resolved.state,
        }),
      );
      endLibraryDrag();
      setDragPreview(null);
      setToast("Виджет добавлен на холст");
    },
    [addWidget, dragPreview, draggingLibraryWidget, endLibraryDrag],
  );

  const emptyStateTitle =
    firstTimeSetup && isEditing
      ? "Первая настройка главной страницы"
      : "Пустая главная страница";

  const emptyStateDescription = isEditing
    ? firstTimeSetup
      ? "Выберите стартовый шаблон роли или добавьте первый виджет из библиотеки."
      : hiddenTotal + deletedTotal > 0
        ? "Все виджеты скрыты или удалены в текущем черновике. Восстановите их из библиотеки или добавьте новые."
        : "Добавьте первый виджет или примените стартовый шаблон."
    : "Для настройки откройте профиль в правом верхнем углу и выберите «Редактировать главную страницу».";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: figmaTokens.colors.appBg,
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        overflowY: "hidden",
        display: "block",
        py: 0,
        px: 0,
        boxSizing: "border-box",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          minHeight: "100vh",
          borderRadius: 0,
          overflow: "hidden",
          border: "none",
          display: "grid",
          alignItems: "stretch",
          position: "relative",
          gridTemplateColumns: {
            xs: "1fr",
            md: isNavCollapsed ? "72px minmax(0, 1fr)" : "380px minmax(0, 1fr)",
          },
          bgcolor: figmaTokens.colors.pageBg,
        }}
      >
        <LeftNav collapsed={isNavCollapsed} />
        {isEditing && (
          <Box
            ref={libraryPanelRef}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              zIndex: 25,
              width: {
                xs: "min(100%, 380px)",
                md: libraryIsCompact ? 392 : "min(30vw, 600px)",
              },
              minWidth: { xs: 260, md: libraryIsCompact ? 392 : 520 },
              maxWidth: { xs: "100%", md: libraryIsCompact ? 392 : "min(72vw, 600px)" },
              pointerEvents: "none",
            }}
          >
            <Box
              sx={{
                height: "100%",
                pointerEvents: "auto",
                boxShadow: "8px 0 32px rgba(55, 69, 111, 0.12)",
              }}
            >
              <MacWidgetLibrary
                role={userRole}
                selected={visibleWidgetCounts}
                hidden={hiddenWidgetCounts}
                deleted={deletedWidgetCounts}
                recommended={recommendedWidgetIds}
                collapsed={libraryIsCompact}
                isDirty={isDirty}
                isSaving={isSaving}
                onExpandedMode={() => setLibraryManualCompact(false)}
                onToggleCompact={() => setLibraryManualCompact((value) => !value)}
                onBeginDrag={beginLibraryDrag}
                onEndDrag={() => {
                  endLibraryDrag();
                  setDragPreview(null);
                }}
                onReset={handleResetDraft}
                onSave={() => void handleSave()}
                onApplyPreset={applyTemplateToDraft}
              />
            </Box>
          </Box>
        )}
        <Box
          sx={{
            p: 0,
            bgcolor: figmaTokens.colors.pageBg,
            minHeight: 0,
            minWidth: 0,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack spacing={0} sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
            <TopBar isEditing={isEditing} onEnterEdit={startEdit} timeContext={timeContext} />
            <Box
              ref={contentRef}
              sx={{
                p: { xs: 1, md: 1.5 },
                position: "relative",
                flex: 1,
                minHeight: 0,
                overflowX: "hidden",
                overflowY: "auto",
                overscrollBehavior: "contain",
                scrollbarGutter: "stable",
              }}
            >
              {loadError ? (
                <Paper sx={{ p: 3 }}>
                  <Alert severity="error" sx={{ mb: 2 }}>
                    Не удалось загрузить персональную конфигурацию главной страницы.
                  </Alert>
                  <Stack direction="row" spacing={1}>
                    <Button variant="contained" onClick={() => void reload()}>
                      Повторить
                    </Button>
                    <Button variant="outlined" onClick={() => void resetPersisted()}>
                      Восстановить шаблон роли
                    </Button>
                  </Stack>
                </Paper>
              ) : isLoading ? (
                <Skeleton variant="rounded" height={400} />
              ) : activeLayout.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="h6" mb={1}>
                    {emptyStateTitle}
                  </Typography>
                  <Typography variant="body2" mb={2}>
                    {emptyStateDescription}
                  </Typography>
                  {isEditing ? (
                    <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap>
                      <Button
                        variant="contained"
                        onClick={() => {
                          setLibraryManualCompact(false);
                        }}
                      >
                        Открыть каталог виджетов
                      </Button>
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Вход в режим редактирования доступен только через профиль.
                    </Typography>
                  )}
                </Paper>
              ) : !isEditing ? (
                <Box sx={{ width: "100%", overflow: "visible", borderRadius: 2 }}>
                  <Box
                    sx={{
                      width: "100%",
                      maxWidth: "100%",
                      mx: "auto",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <DashboardGrid
                      width={effectiveDashboardCanvasWidth}
                      height={gridHeight}
                      rowHeight={gridCellSize}
                      minOuterHeightPx={dashboardCanvasHeight}
                      maxRows={dashboardMaxRows}
                      layout={activeLayout}
                      isEditing={false}
                      interactionLockedReason={null}
                      onInvalidAction={() => undefined}
                      onLayoutChange={() => undefined}
                    >
                    {activeLayout.map((item) => (
                      <Box key={item.i} data-grid={item}>
                        {renderLayoutItem(item, 160)}
                      </Box>
                    ))}
                  </DashboardGrid>
                  </Box>
                </Box>
              ) : (
                <Stack spacing={1.25} sx={{ minHeight: 0, flex: 1, overflow: "visible" }}>
                  <Box
                    sx={{
                      width: "100%",
                      maxWidth: "100%",
                      overflow: "visible",
                      borderRadius: 2,
                      position: "relative",
                      flex: 1,
                      minHeight: 0,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      ref={canvasRef}
                      sx={{
                        width: "100%",
                        maxWidth: "100%",
                        mx: "auto",
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                    {draggingLibraryWidget && (
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          zIndex: 20,
                          borderRadius: 2,
                          background: dragPreview?.valid
                            ? "rgba(72, 118, 255, 0.04)"
                            : "rgba(255, 91, 91, 0.04)",
                        }}
                        onDragOver={(event) => {
                          event.preventDefault();
                          updateDragPreview(event.clientX, event.clientY);
                        }}
                        onDragLeave={(event) => {
                          const related = event.relatedTarget as Node | null;
                          if (related && canvasRef.current?.contains(related)) return;
                          setDragPreview(null);
                        }}
                        onDrop={(event) => {
                          event.preventDefault();
                          handleCanvasDrop(event);
                        }}
                      />
                    )}
                    <DashboardGrid
                      width={effectiveDashboardCanvasWidth}
                      height={gridHeight}
                      rowHeight={gridCellSize}
                      dotGridStepPx={editDotGridStepPx}
                      minOuterHeightPx={dashboardCanvasHeight}
                      maxRows={dashboardMaxRows}
                      layout={activeLayout}
                      isEditing={isEditing}
                      previewItem={widgetResizePreview?.layoutItem
                        ? {
                            x: widgetResizePreview.layoutItem.x,
                            y: widgetResizePreview.layoutItem.y,
                            w: widgetResizePreview.layoutItem.w,
                            h: widgetResizePreview.layoutItem.h,
                            valid: true,
                          }
                        : dragPreview}
                      interactionLockedReason={interactionLockedReason}
                      onInvalidAction={(message) => setToast(message)}
                      onLayoutChange={(next) => {
                        if (!isEditing) return;
                        if (!isLayoutValid(next)) {
                          setToast("Нельзя размещать виджеты за пределами сетки дашборда");
                          setLayout(lastValidLayoutRef.current.map((item) => ({ ...item })));
                          return;
                        }
                        /* Сразу фиксируем последний валидный макет — иначе следующий (промежуточный) невалидный коллбек от сетки откатит к устаревшему ref до commit useEffect. */
                        lastValidLayoutRef.current = next;
                        setLayout(next);
                      }}
                    >
                      {activeLayout.map((item) => {
                        return (
                          <Box key={item.i} data-grid={item}>
                            {renderLayoutItem(item, isEditing ? 120 : 160)}
                          </Box>
                        );
                      })}
                    </DashboardGrid>
                    </Box>
                  </Box>
                </Stack>
              )}
            </Box>
          </Stack>
        </Box>
      </Paper>
      <WidgetContextMenu
        open={Boolean(isEditing && selectedWidgetItem && widgetContextMenuAnchor)}
        anchor={widgetContextMenuAnchor}
        selectedWidgetItem={selectedWidgetItem}
        selectedWidgetSizeOptions={selectedWidgetSizeOptions}
        selectedWidgetDefinition={selectedWidgetDefinition}
        sizeLabels={SIZE_LABELS}
        widgetResizeReason={widgetResizePreview?.reason}
        resolveResizeCandidate={resolveResizeCandidate}
        onPreview={setWidgetResizePreview}
        onApplySize={(nextLayoutItem, widgetInstanceId) => {
          const next = activeLayout.map((item) => (item.i === widgetInstanceId ? nextLayoutItem : item));
          setLayout(next);
          closeWidgetMenu();
          setWidgetResizePreview(null);
        }}
        onDelete={deleteWidget}
        onClose={() => {
          closeWidgetMenu();
          setWidgetResizePreview(null);
        }}
        onMessage={(message) => setToast(message)}
      />
      <Snackbar
        open={Boolean(actionError || validationMessage || toast)}
        message={actionError ?? validationMessage ?? toast ?? ""}
        autoHideDuration={3500}
        onClose={() => {
          setToast(null);
          setValidationMessage(null);
          clearActionError();
        }}
      />
    </Box>
  );
}
