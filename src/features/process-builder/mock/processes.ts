import type { BusinessProcess, ProcessEdge, ProcessNode } from "../types/process-builder.types";

const now = "12.05.2026";

function buildStressProcess(): BusinessProcess {
  const nodes: ProcessNode[] = [
    {
      id: "ss",
      type: "start",
      position: { x: 40, y: 220 },
      data: { kind: "start", name: "Старт (нагрузка)", triggerType: "manual" },
    },
  ];
  for (let i = 0; i < 21; i++) {
    nodes.push({
      id: `sa-${i}`,
      type: "action",
      position: { x: 200 + i * 150, y: 180 + (i % 5) * 36 },
      data: {
        kind: "action",
        name: `Шаг ${i + 1}`,
        actionType: "manual",
        required: true,
        role: "Исполнитель",
        sla: `${(i % 8) + 1} ч`,
      },
    });
  }
  const edges: ProcessEdge[] = [{ id: "es-0", source: "ss", target: "sa-0", type: "processEdge", data: { label: "Старт" } }];
  for (let i = 0; i < 20; i++) {
    edges.push({ id: `e-sa-${i}`, source: `sa-${i}`, target: `sa-${i + 1}`, type: "processEdge", data: { label: "" } });
  }
  return {
    id: "proc-stress",
    name: "Нагрузочный тест (22 шага)",
    description: "Длинная цепочка для проверки производительности канваса.",
    status: "draft",
    updatedAt: now,
    owner: "Стресс Тест",
    category: "QA",
    tags: ["perf"],
    version: "0.1",
    nodes,
    edges,
  };
}

export const mockProcesses: BusinessProcess[] = [
  {
    id: "proc-1",
    name: "Согласование документа",
    description: "Базовый сценарий согласования с юридическим блоком.",
    status: "published",
    updatedAt: now,
    owner: "Иван Петров",
    category: "Документооборот",
    tags: ["согласование", "юридический"],
    version: "2.1",
    nodes: [
      {
        id: "s1",
        type: "start",
        position: { x: 80, y: 220 },
        data: { kind: "start", name: "Старт", triggerType: "manual", description: "Запуск по кнопке" },
      },
      {
        id: "a1",
        type: "action",
        position: { x: 350, y: 220 },
        data: { kind: "action", name: "Проверка комплекта", actionType: "manual", required: true, role: "Исполнитель", sla: "8 ч" },
      },
      {
        id: "ap1",
        type: "approval",
        position: { x: 640, y: 220 },
        data: { kind: "approval", name: "Согласование юристом", approvalMode: "single", role: "Юрист", sla: "24 ч", escalationEnabled: true },
      },
      {
        id: "e1",
        type: "end",
        position: { x: 920, y: 220 },
        data: { kind: "end", name: "Документ согласован", resultType: "success" },
      },
    ],
    edges: [
      { id: "e-s1-a1", source: "s1", target: "a1", type: "processEdge", data: { label: "Начать" } },
      { id: "e-a1-ap1", source: "a1", target: "ap1", type: "processEdge", data: { label: "На согласование" } },
      { id: "e-ap1-e1", source: "ap1", target: "e1", type: "processEdge", data: { label: "Одобрено" } },
    ],
  },
  {
    id: "proc-2",
    name: "Подготовка ответа",
    description: "Сбор данных и выпуск официального ответа.",
    status: "draft",
    updatedAt: now,
    owner: "Елена Смирнова",
    category: "Обращения",
    tags: ["ответ", "подготовка"],
    version: "0.9",
    nodes: [
      { id: "s2", type: "start", position: { x: 80, y: 220 }, data: { kind: "start", name: "Регистрация обращения", triggerType: "event" } },
      { id: "a2", type: "action", position: { x: 360, y: 220 }, data: { kind: "action", name: "Собрать материалы", actionType: "manual", required: true, role: "Аналитик", sla: "16 ч" } },
      { id: "n2", type: "notification", position: { x: 640, y: 220 }, data: { kind: "notification", name: "Уведомить заявителя", channel: "both", recipients: "Заявитель" } },
      { id: "e2", type: "end", position: { x: 920, y: 220 }, data: { kind: "end", name: "Ответ отправлен", resultType: "success" } },
    ],
    edges: [
      { id: "e-s2-a2", source: "s2", target: "a2", type: "processEdge", data: { label: "В работу" } },
      { id: "e-a2-n2", source: "a2", target: "n2", type: "processEdge", data: { label: "Подготовлено" } },
      { id: "e-n2-e2", source: "n2", target: "e2", type: "processEdge", data: { label: "Отправить" } },
    ],
  },
  {
    id: "proc-3",
    name: "Публикация уведомления",
    description: "Сценарий подготовки и публикации уведомлений.",
    status: "draft",
    updatedAt: now,
    owner: "Максим Орлов",
    category: "Публикации",
    tags: ["уведомления"],
    version: "1.0",
    nodes: [
      { id: "s3", type: "start", position: { x: 80, y: 260 }, data: { kind: "start", name: "Старт", triggerType: "schedule", description: "Ежедневно 10:00" } },
      { id: "g3", type: "stageGroup", position: { x: 280, y: 100 }, data: { kind: "stageGroup", name: "Этап подготовки", description: "Формирование контента", colorTag: "mint" }, style: { width: 480, height: 320 } },
      { id: "a3", type: "action", position: { x: 340, y: 210 }, parentId: "g3", extent: "parent", data: { kind: "action", name: "Подготовить текст", actionType: "manual", required: true, role: "Редактор", sla: "6 ч" } },
      { id: "c3", type: "condition", position: { x: 620, y: 260 }, data: { kind: "condition", name: "Канал публикации", branches: ["Email", "Inbox"] } },
      { id: "n3a", type: "notification", position: { x: 870, y: 180 }, data: { kind: "notification", name: "Email-рассылка", channel: "email", recipients: "Подписчики" } },
      { id: "n3b", type: "notification", position: { x: 870, y: 340 }, data: { kind: "notification", name: "Портал Inbox", channel: "inbox", recipients: "ЛК сотрудников" } },
      { id: "e3", type: "end", position: { x: 1140, y: 260 }, data: { kind: "end", name: "Опубликовано", resultType: "success" } },
    ],
    edges: [
      { id: "e-s3-a3", source: "s3", target: "a3", type: "processEdge", data: { label: "Подготовка" } },
      { id: "e-a3-c3", source: "a3", target: "c3", type: "processEdge", data: { label: "Готово" } },
      { id: "e-c3-n3a", source: "c3", target: "n3a", sourceHandle: "branch-0", type: "processEdge", data: { label: "Email", condition: "канал=email" } },
      { id: "e-c3-n3b", source: "c3", target: "n3b", sourceHandle: "branch-1", type: "processEdge", data: { label: "Inbox", isDefaultBranch: true, condition: "канал=inbox" } },
      { id: "e-n3a-e3", source: "n3a", target: "e3", type: "processEdge", data: { label: "Завершить" } },
      { id: "e-n3b-e3", source: "n3b", target: "e3", type: "processEdge", data: { label: "Завершить" } },
    ],
  },
  {
    id: "proc-4",
    name: "Запрос данных между системами",
    description: "Интеграционный процесс межсистемного обмена.",
    status: "validationError",
    updatedAt: now,
    owner: "Анна Кузнецова",
    category: "Интеграции",
    tags: ["API", "данные"],
    version: "0.7",
    nodes: [
      { id: "s4", type: "start", position: { x: 80, y: 220 }, data: { kind: "start", name: "Входящий запрос", triggerType: "event" } },
      { id: "a4", type: "action", position: { x: 350, y: 220 }, data: { kind: "action", name: "", actionType: "system", required: true, role: "Интеграционный сервис", sla: "2 ч" } },
      { id: "c4", type: "condition", position: { x: 620, y: 220 }, data: { kind: "condition", name: "Данные валидны?", branches: ["Да", "Нет"] } },
      { id: "ap4", type: "approval", position: { x: 900, y: 220 }, data: { kind: "approval", name: "Согласование отправки", approvalMode: "single", escalationEnabled: false } },
    ],
    edges: [
      { id: "e-s4-a4", source: "s4", target: "a4", type: "processEdge", data: { label: "Обработать" } },
      { id: "e-a4-c4", source: "a4", target: "c4", type: "processEdge", data: { label: "Проверка" } },
      { id: "e-c4-ap4", source: "c4", target: "ap4", sourceHandle: "branch-0", type: "processEdge", data: { label: "" } },
    ],
  },
  {
    id: "proc-5",
    name: "Архивный процесс с ошибками",
    description: "Старый регламент, оставлен для просмотра.",
    status: "archived",
    updatedAt: now,
    owner: "Сергей Волков",
    category: "Архив",
    version: "0.3",
    nodes: [
      { id: "s5", type: "start", position: { x: 80, y: 220 }, data: { kind: "start", name: "Старт", triggerType: "manual" } },
      { id: "a5", type: "action", position: { x: 360, y: 220 }, data: { kind: "action", name: "Архивная проверка", actionType: "manual", required: false, role: "Оператор", sla: "48 ч" } },
      { id: "e5", type: "end", position: { x: 640, y: 220 }, data: { kind: "end", name: "Закрыт", resultType: "cancelled" } },
    ],
    edges: [
      { id: "e-s5-a5", source: "s5", target: "a5", type: "processEdge", data: { label: "Запуск" } },
      { id: "e-a5-e5", source: "a5", target: "e5", type: "processEdge", data: { label: "Закрыть" } },
    ],
  },
  buildStressProcess(),
];

