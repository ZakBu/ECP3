import { useCallback, useMemo, useState } from "react";
import type {
  DraggingLibraryWidget,
  LayoutItem,
  WidgetMenuAnchor,
  WidgetResizePreview,
} from "../../../features/widgetDashboard/types/widget.types";

export function useHomePageUiState(activeLayout: LayoutItem[]) {
  const [draggingLibraryWidget, setDraggingLibraryWidget] = useState<DraggingLibraryWidget | null>(null);
  const [libraryCollapsedWhileDragging, setLibraryCollapsedWhileDragging] = useState(false);
  const [selectedWidgetInstanceId, setSelectedWidgetInstanceId] = useState<string | null>(null);
  const [widgetContextMenuAnchor, setWidgetContextMenuAnchor] = useState<WidgetMenuAnchor | null>(null);
  const [widgetResizePreview, setWidgetResizePreview] = useState<WidgetResizePreview | null>(null);

  const selectedWidgetItem = useMemo(
    () => activeLayout.find((item) => item.i === selectedWidgetInstanceId) ?? null,
    [activeLayout, selectedWidgetInstanceId],
  );

  const beginLibraryDrag = (payload: DraggingLibraryWidget) => {
    setDraggingLibraryWidget(payload);
  };

  const endLibraryDrag = () => {
    setDraggingLibraryWidget(null);
    setLibraryCollapsedWhileDragging(false);
  };

  /** Сворачивание витрины только после того, как перетаскивание вышло за её границы (см. HomePage + ref панели). */
  const collapseLibraryForDragExit = useCallback(() => {
    setLibraryCollapsedWhileDragging(true);
  }, []);

  const openWidgetMenu = (instanceId: string, anchor: WidgetMenuAnchor) => {
    setSelectedWidgetInstanceId(instanceId);
    setWidgetContextMenuAnchor(anchor);
    setWidgetResizePreview(null);
  };

  const closeWidgetMenu = () => {
    setSelectedWidgetInstanceId(null);
    setWidgetContextMenuAnchor(null);
    setWidgetResizePreview(null);
  };

  return {
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
  };
}
