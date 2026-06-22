import type { WidgetSize } from "../../types/widget.types";
import { W02, withV7Fluid } from "../../v7/widgetLibraryV7Widgets";
import { mapDashboardSizeToV7 } from "../../v7/mapDashboardSizeToV7";

function AnalyticsWidgetInner({ size, state }: { size?: WidgetSize; state?: string }) {
  const st = state === "line" || state === "donut" ? state : "bar";
  return <W02 size={mapDashboardSizeToV7(size, "compact")} state={st} />;
}

export default withV7Fluid(AnalyticsWidgetInner);
