import type { WidgetSize } from "../../types/widget.types";
import { W07, withV7Fluid } from "../../v7/widgetLibraryV7Widgets";
import { mapDashboardSizeToV7 } from "../../v7/mapDashboardSizeToV7";

function QuickActionsWidgetInner({ size, state }: { size?: WidgetSize; state?: string }) {
  const st =
    state === "actions" || state === "services-a" || state === "services-b" || state === "services-c"
      ? state
      : "services-b";
  return <W07 size={mapDashboardSizeToV7(size, "compact")} state={st} />;
}

export default withV7Fluid(QuickActionsWidgetInner);
