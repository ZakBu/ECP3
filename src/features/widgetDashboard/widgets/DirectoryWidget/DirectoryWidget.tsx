import type { WidgetSize } from "../../types/widget.types";
import { W16, withV7Fluid } from "../../v7/widgetLibraryV7Widgets";
import { mapDashboardSizeToV7 } from "../../v7/mapDashboardSizeToV7";

function DirectoryWidgetInner({ size }: { size?: WidgetSize; state?: string }) {
  return <W16 size={mapDashboardSizeToV7(size, "standard")} />;
}

export default withV7Fluid(DirectoryWidgetInner);
