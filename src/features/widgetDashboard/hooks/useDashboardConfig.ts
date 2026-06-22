import { useCallback, useEffect, useState } from "react";
import {
  getDashboardConfig,
  getRoleTemplate,
  resetDashboardConfig,
  saveDashboardConfig,
  seedMockUser,
} from "../api/dashboardService";
import { useDashboardStore } from "../store/dashboardStore";
import type { UserRole } from "../types/role.types";

export function useDashboardConfig(userId: string, role: UserRole) {
  const { setConfig, toConfig, markSaved } = useDashboardStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      seedMockUser(userId, role);
      const existing = await getDashboardConfig(userId);
      if (existing) {
        setConfig(existing);
      } else {
        const template = await getRoleTemplate(role, userId);
        setConfig(template);
      }
    } catch {
      setLoadError("Не удалось загрузить конфигурацию дашборда");
    } finally {
      setIsLoading(false);
    }
  }, [role, setConfig, userId]);

  const save = useCallback(async () => {
    setIsSaving(true);
    setActionError(null);
    try {
      await saveDashboardConfig(toConfig());
      markSaved();
      return true;
    } catch {
      setActionError("Не удалось сохранить конфигурацию");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [markSaved, toConfig]);

  const resetPersisted = useCallback(async () => {
    setActionError(null);
    try {
      const config = await resetDashboardConfig(userId, role);
      setConfig(config);
      markSaved();
      return true;
    } catch {
      setActionError("Не удалось сбросить к шаблону роли");
      return false;
    }
  }, [markSaved, role, setConfig, userId]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    isLoading,
    isSaving,
    loadError,
    actionError,
    save,
    resetPersisted,
    reload: load,
    clearActionError: () => setActionError(null),
  };
}
