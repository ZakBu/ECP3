import type { WidgetSize } from "../../types/widget.types";
import { W17, withV7Fluid } from "../../v7/widgetLibraryV7Widgets";
import { mapDashboardSizeToV7 } from "../../v7/mapDashboardSizeToV7";

function AiAssistantWidgetInner({ size, state }: { size?: WidgetSize; state?: string }) {
  const st = state === "chat" ? "chat" : "idle";
  return <W17 size={mapDashboardSizeToV7(size, "tall")} state={st} />;
}

export default withV7Fluid(AiAssistantWidgetInner);
