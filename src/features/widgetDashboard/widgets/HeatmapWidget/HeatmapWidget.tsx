import type { WidgetSize } from "../../types/widget.types";
import { W19, withV7Fluid } from "../../v7/widgetLibraryV7Widgets";
import { mapDashboardSizeToV7 } from "../../v7/mapDashboardSizeToV7";

function HeatmapWidgetInner({ size }: { size?: WidgetSize }) {
  return <W19 size={mapDashboardSizeToV7(size, "square")} />;
}

export default withV7Fluid(HeatmapWidgetInner);
