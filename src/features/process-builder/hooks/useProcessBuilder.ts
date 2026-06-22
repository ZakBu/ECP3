import { useMemo } from "react";
import { useProcessBuilderStore } from "../store/processBuilder.store";
import type { BusinessProcess } from "../types/process-builder.types";

export function useProcessBuilder() {
  const store = useProcessBuilderStore();

  const activeProcess = useMemo<BusinessProcess | null>(
    () => store.processes.find((item) => item.id === store.activeProcessId) ?? null,
    [store.activeProcessId, store.processes],
  );

  const filteredProcesses = useMemo(() => {
    const term = store.search.trim().toLowerCase();
    return store.processes.filter((process) => {
      const matchesTab =
        store.tab === "my"
          ? process.status !== "archived"
          : store.tab === "drafts"
            ? process.status === "draft"
            : false;
      const matchesSearch =
        term.length === 0 ||
        process.name.toLowerCase().includes(term) ||
        process.description.toLowerCase().includes(term) ||
        process.owner.toLowerCase().includes(term);

      return matchesTab && matchesSearch;
    });
  }, [store.processes, store.search, store.tab]);

  return {
    ...store,
    activeProcess,
    filteredProcesses,
  };
}

