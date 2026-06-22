import type { BusinessProcess, ProcessStatus } from "../types/process-builder.types";

export function createProcessFromTemplate(
  source: Pick<BusinessProcess, "nodes" | "edges" | "category" | "tags" | "version">,
  title: string,
): BusinessProcess {
  const id = `proc-${Date.now()}`;
  return {
    id,
    name: title,
    description: "Новый процесс на основе шаблона",
    status: "draft",
    updatedAt: new Date().toLocaleDateString("ru-RU"),
    owner: "Текущий пользователь",
    category: source.category,
    tags: source.tags,
    version: source.version ?? "1.0",
    nodes: structuredClone(source.nodes),
    edges: structuredClone(source.edges),
  };
}

export function getStatusLabel(status: ProcessStatus): string {
  switch (status) {
    case "draft":
      return "Черновик";
    case "published":
      return "Опубликован";
    case "validationError":
      return "Ошибка валидации";
    case "archived":
      return "Архив";
    default:
      return "Черновик";
  }
}

