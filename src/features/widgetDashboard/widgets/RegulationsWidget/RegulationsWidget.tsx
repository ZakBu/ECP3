import type { WidgetSize } from "../../types/widget.types";
import { W15, withV7Fluid } from "../../v7/widgetLibraryV7Widgets";
import { mapDashboardSizeToV7 } from "../../v7/mapDashboardSizeToV7";

function RegulationsWidgetInner({ size }: { size?: WidgetSize }) {
  return <W15 size={mapDashboardSizeToV7(size, "standard")} />;
}

export default withV7Fluid(RegulationsWidgetInner);
