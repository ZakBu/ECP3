import type { WidgetSize } from "../../types/widget.types";
import { W05, withV7Fluid } from "../../v7/widgetLibraryV7Widgets";
import { mapDashboardSizeToV7 } from "../../v7/mapDashboardSizeToV7";

function Top5WidgetInner({ size }: { size?: WidgetSize }) {
  return <W05 size={mapDashboardSizeToV7(size, "compact")} />;
}

export default withV7Fluid(Top5WidgetInner);
