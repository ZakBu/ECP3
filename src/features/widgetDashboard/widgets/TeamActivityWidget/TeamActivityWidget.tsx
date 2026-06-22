import type { WidgetSize } from "../../types/widget.types";
import { W11, withV7Fluid } from "../../v7/widgetLibraryV7Widgets";
import { mapDashboardSizeToV7 } from "../../v7/mapDashboardSizeToV7";

function TeamActivityWidgetInner({ size }: { size?: WidgetSize }) {
  return <W11 size={mapDashboardSizeToV7(size, "standard")} />;
}

export default withV7Fluid(TeamActivityWidgetInner);
