import { useMemo } from "react";
import type { BusinessProcess } from "../types/process-builder.types";

export function useProcessValidationSummary(process: BusinessProcess | null, issuesCount: number) {
  return useMemo(() => {
    if (!process) {
      return {
        totalSteps: 0,
        approvals: 0,
        conditions: 0,
        manualActions: 0,
        longestPath: 0,
        danglingSteps: 0,
        unnamedBranches: 0,
        errors: 0,
      };
    }

    const totalSteps = process.nodes.filter((node) => node.data.kind !== "stageGroup").length;
    const approvals = process.nodes.filter((node) => node.data.kind === "approval").length;
    const conditions = process.nodes.filter((node) => node.data.kind === "condition").length;
    const manualActions = process.nodes.filter(
      (node) => node.data.kind === "action" && node.data.actionType === "manual",
    ).length;

    const outgoing = new Map<string, number>();
    const incoming = new Map<string, number>();
    process.nodes.forEach((node) => {
      outgoing.set(node.id, 0);
      incoming.set(node.id, 0);
    });
    process.edges.forEach((edge) => {
      outgoing.set(edge.source, (outgoing.get(edge.source) ?? 0) + 1);
      incoming.set(edge.target, (incoming.get(edge.target) ?? 0) + 1);
    });

    const danglingSteps = process.nodes.filter((node) => {
      const inCount = incoming.get(node.id) ?? 0;
      const outCount = outgoing.get(node.id) ?? 0;
      return inCount === 0 || outCount === 0;
    }).length;

    const unnamedBranches = process.edges.filter((edge) => {
      const source = process.nodes.find((node) => node.id === edge.source);
      return source?.data.kind === "condition" && !edge.data?.label?.trim();
    }).length;

    const longestPath = Math.max(1, totalSteps);

    return {
      totalSteps,
      approvals,
      conditions,
      manualActions,
      longestPath,
      danglingSteps,
      unnamedBranches,
      errors: issuesCount,
    };
  }, [issuesCount, process]);
}

