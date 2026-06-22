import type { BusinessProcess, ValidationIssue } from "../types/process-builder.types";

export function validateProcess(process: BusinessProcess): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const startNodes = process.nodes.filter((node) => node.data.kind === "start");
  const endNodes = process.nodes.filter((node) => node.data.kind === "end");

  if (startNodes.length !== 1) {
    issues.push({
      id: "v-start-count",
      level: "error",
      message: "В процессе должен быть ровно один стартовый шаг.",
    });
  }

  if (endNodes.length < 1) {
    issues.push({
      id: "v-end-required",
      level: "error",
      message: "В процессе должен быть минимум один завершающий шаг.",
    });
  }

  if (!process.name.trim()) {
    issues.push({
      id: "v-process-name",
      level: "error",
      message: "Укажите название процесса.",
    });
  }

  const outgoingCount = new Map<string, number>();
  const incomingCount = new Map<string, number>();
  process.nodes.forEach((node) => {
    outgoingCount.set(node.id, 0);
    incomingCount.set(node.id, 0);
  });

  process.edges.forEach((edge) => {
    outgoingCount.set(edge.source, (outgoingCount.get(edge.source) ?? 0) + 1);
    incomingCount.set(edge.target, (incomingCount.get(edge.target) ?? 0) + 1);
  });

  process.nodes.forEach((node) => {
    const incoming = incomingCount.get(node.id) ?? 0;
    const outgoing = outgoingCount.get(node.id) ?? 0;
    if (incoming === 0 && outgoing === 0) {
      issues.push({
        id: `v-isolated-${node.id}`,
        level: "error",
        nodeId: node.id,
        message: `Шаг "${node.data.name || "Без названия"}" изолирован от процесса.`,
      });
    }

    if (node.data.kind === "condition" && outgoing < 2) {
      issues.push({
        id: `v-condition-outgoing-${node.id}`,
        level: "error",
        nodeId: node.id,
        message: `Условие "${node.data.name}" должно иметь минимум две исходящие ветки.`,
      });
    }

    if (node.data.kind === "approval" && !node.data.role?.trim()) {
      issues.push({
        id: `v-approval-role-${node.id}`,
        level: "error",
        nodeId: node.id,
        message: `Для шага согласования "${node.data.name}" укажите согласующего или роль.`,
      });
    }

    if (node.data.kind === "action" && !node.data.name.trim()) {
      issues.push({
        id: `v-action-name-${node.id}`,
        level: "error",
        nodeId: node.id,
        message: "Шаг действия должен иметь название.",
      });
    }
  });

  process.edges.forEach((edge) => {
    const source = process.nodes.find((node) => node.id === edge.source);
    if (source?.data.kind === "condition" && !edge.data?.label?.trim()) {
      issues.push({
        id: `v-condition-label-${edge.id}`,
        level: "error",
        edgeId: edge.id,
        message: "У каждой ветки условия должен быть label.",
      });
    }
  });

  return issues;
}

