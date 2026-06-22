import type { TemplateProcess } from "../types/process-builder.types";
import { mockProcesses } from "./processes";

const processSeed = (id: string) => {
  const base = mockProcesses.find((item) => item.id === id);
  if (!base) {
    throw new Error(`Template source process ${id} not found`);
  }
  return {
    nodes: structuredClone(base.nodes),
    edges: structuredClone(base.edges),
    category: base.category,
    tags: base.tags,
    version: "1.0",
  };
};

export const mockTemplates: TemplateProcess[] = [
  {
    id: "tpl-1",
    title: "Согласование документа",
    description: "Классический маршрут с юридическим согласованием.",
    processSeed: processSeed("proc-1"),
  },
  {
    id: "tpl-2",
    title: "Публикация регламента",
    description: "Подготовка, проверка и публикация регламентирующего документа.",
    processSeed: processSeed("proc-3"),
  },
  {
    id: "tpl-3",
    title: "Обработка обращения",
    description: "Маршрут принятия и обработки обращения гражданина.",
    processSeed: processSeed("proc-2"),
  },
  {
    id: "tpl-4",
    title: "Запрос данных между подразделениями",
    description: "Согласованный обмен служебной информацией.",
    processSeed: processSeed("proc-4"),
  },
  {
    id: "tpl-5",
    title: "Подготовка и выпуск уведомления",
    description: "Проверка контента и отправка уведомлений по каналам.",
    processSeed: processSeed("proc-3"),
  },
];

