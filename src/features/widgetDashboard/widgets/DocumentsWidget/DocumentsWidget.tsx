import type { WidgetSize } from "../../types/widget.types";
import { W09, withV7Fluid } from "../../v7/widgetLibraryV7Widgets";
import { mapDashboardSizeToV7 } from "../../v7/mapDashboardSizeToV7";

function DocumentsWidgetInner({ size, state }: { size?: WidgetSize; state?: string }) {
  const st =
    state === "pending" || state === "approval" ? state : "recent";
  return <W09 size={mapDashboardSizeToV7(size, "compact")} state={st} />;
}

export default withV7Fluid(DocumentsWidgetInner);
