import type { WidgetSize } from "../../types/widget.types";
import { W04, withV7Fluid } from "../../v7/widgetLibraryV7Widgets";
import { mapDashboardSizeToV7 } from "../../v7/mapDashboardSizeToV7";

function FunnelWidgetInner({ size }: { size?: WidgetSize }) {
  return <W04 size={mapDashboardSizeToV7(size, "compact")} />;
}

export default withV7Fluid(FunnelWidgetInner);
