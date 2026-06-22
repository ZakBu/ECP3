import type { WidgetSize } from "../../types/widget.types";
import { W10, withV7Fluid } from "../../v7/widgetLibraryV7Widgets";
import { mapDashboardSizeToV7 } from "../../v7/mapDashboardSizeToV7";

function ApplicationsWidgetInner({ size, state }: { size?: WidgetSize; state?: string }) {
  const st = state === "archive" ? "archive" : "active";
  return <W10 size={mapDashboardSizeToV7(size, "tall")} state={st} />;
}

export default withV7Fluid(ApplicationsWidgetInner);
