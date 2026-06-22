import { useEffect, useState, type RefObject } from "react";

/**
 * Ширина/высота области под холст. Высота — доступное место в flex-колонке; по ней считается
 * число рядов сетки без вертикальной прокрутки (`computeDashboardMaxRowsFromHeight`).
 */
export function useDashboardCanvasSize(contentRef: RefObject<HTMLDivElement | null>) {
  const [gridWidth, setGridWidth] = useState(1260);
  const [gridHeight, setGridHeight] = useState(945);

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      const aw = Math.max(280, Math.floor(rect?.width ?? 1260));
      const ah = Math.max(280, Math.floor(rect?.height ?? 945));
      setGridWidth(aw);
      setGridHeight(ah);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [contentRef]);

  return { gridWidth, gridHeight };
}
