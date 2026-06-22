import type { WidgetSize } from "../../types/widget.types";
import { W01, withV7Fluid } from "../../v7/widgetLibraryV7Widgets";
import { mapDashboardSizeToV7 } from "../../v7/mapDashboardSizeToV7";

function KpiCountersInner({ size }: { size?: WidgetSize }) {
  return <W01 size={mapDashboardSizeToV7(size, "compact")} />;
}

export default withV7Fluid(KpiCountersInner);
