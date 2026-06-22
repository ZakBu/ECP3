import { useEffect } from "react";

interface UseProcessHotkeysParams {
  onDelete: () => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClearSelection: () => void;
}

export function useProcessHotkeys(params: UseProcessHotkeysParams) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes("mac");
      const withCmdCtrl = isMac ? event.metaKey : event.ctrlKey;

      if ((event.key === "Delete" || event.key === "Backspace") && !event.repeat) {
        params.onDelete();
      }

      if (withCmdCtrl && event.key.toLowerCase() === "s") {
        event.preventDefault();
        params.onSave();
      }

      if (withCmdCtrl && event.key.toLowerCase() === "z" && !event.shiftKey) {
        event.preventDefault();
        params.onUndo();
      }

      if (withCmdCtrl && event.shiftKey && event.key.toLowerCase() === "z") {
        event.preventDefault();
        params.onRedo();
      }

      if (event.key === "Escape") {
        params.onClearSelection();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [params]);
}

