import type { WidgetSize } from "../../types/widget.types";
import { W18, withV7Fluid } from "../../v7/widgetLibraryV7Widgets";
import { mapDashboardSizeToV7 } from "../../v7/mapDashboardSizeToV7";

function OivWidgetInner({ size }: { size?: WidgetSize }) {
  return <W18 size={mapDashboardSizeToV7(size, "wide")} />;
}

export default withV7Fluid(OivWidgetInner);
