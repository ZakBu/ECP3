import type { WidgetSize } from "../../types/widget.types";
import { W06, withV7Fluid } from "../../v7/widgetLibraryV7Widgets";
import { mapDashboardSizeToV7 } from "../../v7/mapDashboardSizeToV7";

function MyTasksInner({
  size,
  state,
  onStateChange,
}: {
  size?: WidgetSize;
  state?: string;
  onStateChange?: (nextState: string) => void;
}) {
  const st = state === "kanban" || state === "gantt" ? state : "list";
  return (
    <W06
      size={mapDashboardSizeToV7(size, "standard")}
      state={st}
      onStateChange={onStateChange}
    />
  );
}

export default withV7Fluid(MyTasksInner);
