import type { WidgetSize } from "../../types/widget.types";
import { W08, withV7Fluid } from "../../v7/widgetLibraryV7Widgets";
import { mapDashboardSizeToV7 } from "../../v7/mapDashboardSizeToV7";

function FavoriteItemsInner({ size, state }: { size?: WidgetSize; state?: string }) {
  const st = state === "opps" ? "opps" : "tasks";
  return <W08 size={mapDashboardSizeToV7(size, "standard")} state={st} />;
}

export default withV7Fluid(FavoriteItemsInner);
