import { useEffect } from "react";
import { useDashboardStore } from "../store/dashboardStore";

export function useEditMode() {
  const { isDirty, isEditing } = useDashboardStore();

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (isEditing && isDirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty, isEditing]);
}

