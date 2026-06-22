import axios from "axios";
import type { DashboardConfig } from "../types/widget.types";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

const client = axios.create({
  baseURL: API_BASE,
});

export async function fetchDashboardConfig(): Promise<DashboardConfig | null> {
  try {
    const { data } = await client.get<DashboardConfig>("/api/v1/user/dashboard/config");
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function updateDashboardConfig(config: DashboardConfig): Promise<void> {
  await client.put("/api/v1/user/dashboard/config", {
    schemaVersion: config.schemaVersion,
    layout: config.layout,
    widgetSettings: config.widgetSettings,
  });
}

export async function resetDashboardConfigOnServer(): Promise<void> {
  await client.delete("/api/v1/user/dashboard/config");
}

export async function fetchRoleTemplate(role: string): Promise<DashboardConfig> {
  const { data } = await client.get<DashboardConfig>(`/api/v1/dashboard/templates/${role}`);
  return data;
}
