import type { WidgetSize } from "../types/widget.types";

const v7sizes = new Set<string>([
  "compact",
  "tall",
  "standard",
  "square",
  "wide",
  "wideTall",
  "wide4x2",
  "xwide",
  "xl",
]);

/** Маппинг легаси S/M/L/XL и пропуск v7-размеров как есть */
export function mapDashboardSizeToV7(size: WidgetSize | undefined, fallback: WidgetSize): string {
  const s = size ?? fallback;
  if (v7sizes.has(s as string)) return s as string;
  const legacy: Record<string, string> = {
    S: "compact",
    M: "standard",
    L: "square",
    XL: "xl",
  };
  return legacy[s as string] ?? (fallback as string);
}
