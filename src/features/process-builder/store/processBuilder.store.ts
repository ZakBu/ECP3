import { addEdge, applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import { create } from "zustand";
import { mockProcesses } from "../mock/processes";
import { mockTemplates } from "../mock/templates";
import type {
  AddNodeRequest,
  BusinessProcess,
  ConditionNodeData,
  EditorMode,
  ProcessEdge,
  ProcessNode,
  ProcessStatus,
  ProcessTab,
  PublishState,
  SaveState,
  TemplateProcess,
  ValidationIssue,
} from "../types/process-builder.types";
import { autoLayout } from "../utils/layout";
import { createProcessFromTemplate } from "../utils/process-mappers";
import { validateProcess } from "../utils/validation";

const cloneProcess = (process: BusinessProcess): BusinessProcess => structuredClone(process);

interface HistoryState {
  nodes: ProcessNode[];
  edges: ProcessEdge[];
}

interface ProcessBuilderStore {
  isLoading: boolean;
  loadError: string | null;
  processes: BusinessProcess[];
  templates: TemplateProcess[];
  activeProcessId: string | null;
  tab: ProcessTab;
  search: string;
  mode: EditorMode;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  validationIssues: ValidationIssue[];
  saveState: SaveState;
  publishState: PublishState;
  toastMessage: string | null;
  unsaved: boolean;
  inspectorCollapsed: boolean;
  showErrorsPanel: boolean;
  liveFocusNodeId: string | null;
  historyPast: HistoryState[];
  historyFuture: HistoryState[];
  setSearch: (value: string) => void;
  setTab: (tab: ProcessTab) => void;
  selectProcess: (id: string) => void;
  createProcess: () => void;
  createFromTemplate: (templateId: string) => void;
  deleteProcess: (id: string) => void;
  archiveActive: () => void;
  duplicateActive: () => void;
  setMode: (mode: EditorMode) => void;
  renameActiveProcess: (name: string) => void;
  setSelection: (nodeId: string | null, edgeId: string | null) => void;
  applyNodeChanges: (changes: unknown[]) => void;
  applyEdgeChanges: (changes: unknown[]) => void;
  connect: (params: { source: string; target: string; sourceHandle?: string | null; targetHandle?: string | null }) => void;
  addNode: (request: AddNodeRequest) => void;
  deleteSelection: () => void;
  updateNodeData: (nodeId: string, patch: Record<string, unknown>) => void;
  updateEdgeData: (edgeId: string, patch: Record<string, unknown>) => void;
  validate: () => ValidationIssue[];
  save: () => Promise<void>;
  publish: () => Promise<boolean>;
  clearToast: () => void;
  autoArrange: () => void;
  undo: () => void;
  redo: () => void;
  dismissLoadError: () => void;
  toggleErrorsPanel: () => void;
  setErrorsPanel: (value: boolean) => void;
  setInspectorCollapsed: (value: boolean) => void;
  generateDemoFlowFromAttachment: (fileName: string) => void;
  generateDemoFlowFromAttachmentLive: (fileName: string) => Promise<void>;
}

function statusToMode(status: ProcessStatus): EditorMode {
  return status === "published" ? "view" : "edit";
}

function pickConditionSourceHandle(source: ProcessNode, edges: ProcessEdge[]): string | undefined {
  if (source.type !== "condition") return undefined;
  const branches = (source.data as ConditionNodeData).branches.length;
  const used = new Set(
    edges.filter((e) => e.source === source.id).map((e) => e.sourceHandle ?? "branch-0"),
  );
  for (let i = 0; i < branches; i++) {
    const h = `branch-${i}`;
    if (!used.has(h)) return h;
  }
  return `branch-${Math.max(0, branches - 1)}`;
}

function buildNode(kind: AddNodeRequest["kind"], index: number, sourceNode?: ProcessNode): ProcessNode {
  const id = `${kind}-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
  const baseX = sourceNode ? sourceNode.position.x + 280 : 240 + index * 20;
  const baseY = sourceNode ? sourceNode.position.y : 180 + index * 24;

  const common = { id, position: { x: baseX, y: baseY }, type: kind };
  switch (kind) {
    case "action":
      return { ...common, data: { kind: "action", name: "Новый шаг действия", actionType: "manual", required: true } };
    case "approval":
      return { ...common, data: { kind: "approval", name: "Новое согласование", approvalMode: "single", escalationEnabled: false } };
    case "condition":
      return { ...common, data: { kind: "condition", name: "Новое условие", branches: ["Да", "Нет"] } };
    case "notification":
      return { ...common, data: { kind: "notification", name: "Новое уведомление", channel: "inbox" } };
    case "end":
      return { ...common, data: { kind: "end", name: "Завершение", resultType: "success" } };
    case "stageGroup":
      return {
        ...common,
        position: sourceNode ? { x: sourceNode.position.x + 120, y: sourceNode.position.y - 80 } : { x: 220, y: 80 },
        style: { width: 420, height: 280 },
        data: { kind: "stageGroup", name: "Новый этап", colorTag: "blue" },
      };
    default:
      return { ...common, data: { kind: "action", name: "Новый шаг", actionType: "manual", required: true } };
  }
}

function buildDemoFlow(fileName: string): { nodes: ProcessNode[]; edges: ProcessEdge[]; order: string[] } {
  const suffix = Date.now().toString(36);
  const startId = `start-${suffix}`;
  const actionRegisterId = `action-register-${suffix}`;
  const approvalCompletenessId = `approval-complete-${suffix}`;
  const conditionPriorityId = `condition-priority-${suffix}`;
  const actionFastTrackId = `action-fast-${suffix}`;
  const approvalFastLeadId = `approval-fast-lead-${suffix}`;
  const actionStandardReviewId = `action-standard-review-${suffix}`;
  const conditionRiskId = `condition-risk-${suffix}`;
  const approvalSecurityId = `approval-security-${suffix}`;
  const approvalLegalId = `approval-legal-${suffix}`;
  const notifyId = `notify-${suffix}`;
  const endId = `end-${suffix}`;

  const nodes: ProcessNode[] = [
    {
      id: startId,
      type: "start",
      position: { x: 120, y: 220 },
      data: { kind: "start", name: "Старт", triggerType: "manual", description: "Запуск после загрузки файла" },
    },
    {
      id: actionRegisterId,
      type: "action",
      position: { x: 360, y: 220 },
      data: {
        kind: "action",
        name: "Регистрация обращения",
        description: `Создано из файла: ${fileName}`,
        actionType: "manual",
        required: true,
        role: "Секретариат",
      },
    },
    {
      id: approvalCompletenessId,
      type: "approval",
      position: { x: 620, y: 220 },
      data: {
        kind: "approval",
        name: "Проверка комплектности",
        approvalMode: "single",
        escalationEnabled: true,
        role: "Координатор ЕЦП ГД",
      },
    },
    {
      id: conditionPriorityId,
      type: "condition",
      position: { x: 900, y: 220 },
      data: {
        kind: "condition",
        name: "Определение приоритета",
        branches: ["Да, срочно", "Нет, стандарт"],
      },
    },
    {
      id: actionFastTrackId,
      type: "action",
      position: { x: 1170, y: 120 },
      data: {
        kind: "action",
        name: "Ускоренная экспертиза",
        actionType: "system",
        required: true,
        role: "Дежурный эксперт",
      },
    },
    {
      id: approvalFastLeadId,
      type: "approval",
      position: { x: 1420, y: 120 },
      data: {
        kind: "approval",
        name: "Согласование руководителя смены",
        approvalMode: "single",
        escalationEnabled: true,
        role: "Руководитель смены",
      },
    },
    {
      id: actionStandardReviewId,
      type: "action",
      position: { x: 1170, y: 320 },
      data: {
        kind: "action",
        name: "Плановая экспертиза",
        actionType: "manual",
        required: true,
        role: "Профильный эксперт",
      },
    },
    {
      id: conditionRiskId,
      type: "condition",
      position: { x: 1420, y: 320 },
      data: {
        kind: "condition",
        name: "Есть риски/замечания?",
        branches: ["Да, есть", "Нет"],
      },
    },
    {
      id: approvalSecurityId,
      type: "approval",
      position: { x: 1660, y: 420 },
      data: {
        kind: "approval",
        name: "Проверка службы безопасности",
        approvalMode: "single",
        escalationEnabled: false,
        role: "СБ и комплаенс",
      },
    },
    {
      id: approvalLegalId,
      type: "approval",
      position: { x: 1880, y: 220 },
      data: {
        kind: "approval",
        name: "Юридическое согласование",
        approvalMode: "single",
        escalationEnabled: false,
        role: "Юридический отдел",
      },
    },
    {
      id: notifyId,
      type: "notification",
      position: { x: 2140, y: 220 },
      data: {
        kind: "notification",
        name: "Уведомление заявителя",
        channel: "both",
        textTemplate: "Решение по обращению готово",
      },
    },
    {
      id: endId,
      type: "end",
      position: { x: 2400, y: 220 },
      data: { kind: "end", name: "Завершение", resultType: "success" },
    },
  ];

  const edges: ProcessEdge[] = [
    { id: `edge-${startId}-${actionRegisterId}`, source: startId, target: actionRegisterId, type: "processEdge", data: { label: "" } },
    {
      id: `edge-${actionRegisterId}-${approvalCompletenessId}`,
      source: actionRegisterId,
      target: approvalCompletenessId,
      type: "processEdge",
      data: { label: "" },
    },
    {
      id: `edge-${approvalCompletenessId}-${conditionPriorityId}`,
      source: approvalCompletenessId,
      target: conditionPriorityId,
      type: "processEdge",
      data: { label: "" },
    },
    {
      id: `edge-${conditionPriorityId}-${actionFastTrackId}`,
      source: conditionPriorityId,
      target: actionFastTrackId,
      sourceHandle: "branch-0",
      type: "processEdge",
      data: { label: "Да, срочно" },
    },
    {
      id: `edge-${conditionPriorityId}-${actionStandardReviewId}`,
      source: conditionPriorityId,
      target: actionStandardReviewId,
      sourceHandle: "branch-1",
      type: "processEdge",
      data: { label: "Нет, стандарт" },
    },
    {
      id: `edge-${actionFastTrackId}-${approvalFastLeadId}`,
      source: actionFastTrackId,
      target: approvalFastLeadId,
      type: "processEdge",
      data: { label: "" },
    },
    {
      id: `edge-${actionStandardReviewId}-${conditionRiskId}`,
      source: actionStandardReviewId,
      target: conditionRiskId,
      type: "processEdge",
      data: { label: "" },
    },
    {
      id: `edge-${conditionRiskId}-${approvalLegalId}`,
      source: conditionRiskId,
      target: approvalLegalId,
      sourceHandle: "branch-1",
      type: "processEdge",
      data: { label: "Нет" },
    },
    {
      id: `edge-${conditionRiskId}-${approvalSecurityId}`,
      source: conditionRiskId,
      target: approvalSecurityId,
      sourceHandle: "branch-0",
      type: "processEdge",
      data: { label: "Да, есть" },
    },
    {
      id: `edge-${approvalSecurityId}-${approvalLegalId}`,
      source: approvalSecurityId,
      target: approvalLegalId,
      type: "processEdge",
      data: { label: "" },
    },
    {
      id: `edge-${approvalFastLeadId}-${approvalLegalId}`,
      source: approvalFastLeadId,
      target: approvalLegalId,
      type: "processEdge",
      data: { label: "" },
    },
    {
      id: `edge-${approvalLegalId}-${notifyId}`,
      source: approvalLegalId,
      target: notifyId,
      type: "processEdge",
      data: { label: "" },
    },
    { id: `edge-${notifyId}-${endId}`, source: notifyId, target: endId, type: "processEdge", data: { label: "" } },
  ];

  return {
    nodes: autoLayout(nodes, edges) as ProcessNode[],
    edges,
    order: [
      startId,
      actionRegisterId,
      approvalCompletenessId,
      conditionPriorityId,
      actionFastTrackId,
      approvalFastLeadId,
      actionStandardReviewId,
      conditionRiskId,
      approvalSecurityId,
      approvalLegalId,
      notifyId,
      endId,
    ],
  };
}

export const useProcessBuilderStore = create<ProcessBuilderStore>((set, get) => ({
  isLoading: false,
  loadError: null,
  processes: mockProcesses,
  templates: mockTemplates,
  activeProcessId: mockProcesses[0]?.id ?? null,
  tab: "my",
  search: "",
  mode: statusToMode(mockProcesses[0]?.status ?? "draft"),
  selectedNodeId: null,
  selectedEdgeId: null,
  validationIssues: validateProcess(mockProcesses[0]),
  saveState: { state: "idle" },
  publishState: { state: "idle" },
  toastMessage: null,
  unsaved: false,
  inspectorCollapsed: false,
  showErrorsPanel: false,
  liveFocusNodeId: null,
  historyPast: [],
  historyFuture: [],

  setSearch: (value) => set({ search: value }),
  setTab: (tab) => set({ tab }),
  selectProcess: (id) =>
    set((state) => {
      const process = state.processes.find((item) => item.id === id);
      if (!process) return state;
      return {
        activeProcessId: id,
        selectedNodeId: null,
        selectedEdgeId: null,
        liveFocusNodeId: null,
        mode: statusToMode(process.status),
        validationIssues: validateProcess(process),
        publishState: { state: "idle" },
        saveState: { state: "idle" },
        historyPast: [],
        historyFuture: [],
        unsaved: false,
      };
    }),
  createProcess: () =>
    set((state) => {
      const id = `proc-${Date.now()}`;
      const process: BusinessProcess = {
        id,
        name: "Новый процесс",
        description: "Описание не заполнено",
        status: "draft",
        updatedAt: new Date().toLocaleDateString("ru-RU"),
        owner: "Текущий пользователь",
        version: "1.0",
        nodes: [
          {
            id: "start-root",
            type: "start",
            position: { x: 120, y: 220 },
            data: { kind: "start", name: "Старт", triggerType: "manual", description: "Создан автоматически" },
          },
        ],
        edges: [],
      };
      return {
        processes: [process, ...state.processes],
        activeProcessId: id,
        mode: "edit",
        tab: "drafts",
        selectedNodeId: null,
        selectedEdgeId: null,
        liveFocusNodeId: null,
        validationIssues: validateProcess(process),
        unsaved: true,
        toastMessage: "Новый процесс создан",
      };
    }),
  createFromTemplate: (templateId) =>
    set((state) => {
      const template = state.templates.find((item) => item.id === templateId);
      if (!template) return state;
      const process = createProcessFromTemplate(template.processSeed, template.title);
      return {
        processes: [process, ...state.processes],
        activeProcessId: process.id,
        mode: "edit",
        selectedNodeId: null,
        selectedEdgeId: null,
        liveFocusNodeId: null,
        validationIssues: validateProcess(process),
        unsaved: true,
        toastMessage: `Создан процесс на основе шаблона: ${template.title}`,
      };
    }),
  deleteProcess: (id) =>
    set((state) => {
      const next = state.processes.filter((item) => item.id !== id);
      return {
        processes: next,
        activeProcessId: next[0]?.id ?? null,
        selectedNodeId: null,
        selectedEdgeId: null,
        liveFocusNodeId: null,
      };
    }),
  archiveActive: () =>
    set((state) => ({
      processes: state.processes.map((item) =>
        item.id === state.activeProcessId ? { ...item, status: "archived", updatedAt: new Date().toLocaleDateString("ru-RU") } : item,
      ),
      toastMessage: "Процесс перенесён в архив",
    })),
  duplicateActive: () =>
    set((state) => {
      const active = state.processes.find((item) => item.id === state.activeProcessId);
      if (!active) return state;
      const copy = cloneProcess(active);
      copy.id = `proc-${Date.now()}`;
      copy.name = `${active.name} (копия)`;
      copy.status = "draft";
      copy.updatedAt = new Date().toLocaleDateString("ru-RU");
      return {
        processes: [copy, ...state.processes],
        activeProcessId: copy.id,
        mode: "edit",
        unsaved: true,
      };
    }),
  setMode: (mode) => set({ mode }),
  renameActiveProcess: (name) =>
    set((state) => ({
      processes: state.processes.map((process) =>
        process.id === state.activeProcessId
          ? { ...process, name, updatedAt: new Date().toLocaleDateString("ru-RU") }
          : process,
      ),
      unsaved: true,
    })),
  setSelection: (nodeId, edgeId) => set({ selectedNodeId: nodeId, selectedEdgeId: edgeId }),

  applyNodeChanges: (changes) =>
    set((state) => {
      if (state.mode !== "edit") return state;
      const active = state.processes.find((item) => item.id === state.activeProcessId);
      if (!active) return state;
      const nextNodes = applyNodeChanges(changes as never, active.nodes as never) as ProcessNode[];
      const prevSnapshot = { nodes: active.nodes, edges: active.edges };
      return {
        processes: state.processes.map((item) => (item.id === active.id ? { ...item, nodes: nextNodes } : item)),
        historyPast: [...state.historyPast, prevSnapshot].slice(-40),
        historyFuture: [],
        unsaved: true,
      };
    }),
  applyEdgeChanges: (changes) =>
    set((state) => {
      if (state.mode !== "edit") return state;
      const active = state.processes.find((item) => item.id === state.activeProcessId);
      if (!active) return state;
      const nextEdges = applyEdgeChanges(changes as never, active.edges as never) as ProcessEdge[];
      const prevSnapshot = { nodes: active.nodes, edges: active.edges };
      return {
        processes: state.processes.map((item) => (item.id === active.id ? { ...item, edges: nextEdges } : item)),
        historyPast: [...state.historyPast, prevSnapshot].slice(-40),
        historyFuture: [],
        unsaved: true,
      };
    }),
  connect: (params) =>
    set((state) => {
      if (state.mode !== "edit") return state;
      const active = state.processes.find((item) => item.id === state.activeProcessId);
      if (!active) return state;
      const nextEdges = addEdge({ ...params, id: `edge-${Date.now()}`, type: "processEdge", data: { label: "" } }, active.edges as never) as ProcessEdge[];
      return {
        processes: state.processes.map((item) => (item.id === active.id ? { ...item, edges: nextEdges } : item)),
        unsaved: true,
      };
    }),
  addNode: (request) =>
    set((state) => {
      if (state.mode !== "edit") return state;
      const active = state.processes.find((item) => item.id === state.activeProcessId);
      if (!active) return state;
      const source = request.sourceNodeId ? active.nodes.find((item) => item.id === request.sourceNodeId) : undefined;
      const node = buildNode(request.kind, active.nodes.length, source);
      if (request.position) node.position = request.position;

      const edges = [...active.edges];
      if (source && request.kind !== "stageGroup") {
        const sourceHandle = pickConditionSourceHandle(source, edges);
        edges.push({
          id: `edge-${source.id}-${node.id}-${Date.now()}`,
          source: source.id,
          target: node.id,
          type: "processEdge",
          ...(sourceHandle ? { sourceHandle } : {}),
          data: { label: request.kind === "condition" ? "Ветка" : "" },
        });
      }

      return {
        processes: state.processes.map((item) =>
          item.id === active.id
            ? { ...item, nodes: [...item.nodes, node], edges, updatedAt: new Date().toLocaleDateString("ru-RU") }
            : item,
        ),
        selectedNodeId: node.id,
        selectedEdgeId: null,
        unsaved: true,
      };
    }),
  deleteSelection: () =>
    set((state) => {
      if (state.mode !== "edit") return state;
      const active = state.processes.find((item) => item.id === state.activeProcessId);
      if (!active) return state;
      let nodes = active.nodes;
      let edges = active.edges;
      if (state.selectedNodeId) {
        nodes = nodes.filter((node) => node.id !== state.selectedNodeId);
        edges = edges.filter((edge) => edge.source !== state.selectedNodeId && edge.target !== state.selectedNodeId);
      }
      if (state.selectedEdgeId) {
        edges = edges.filter((edge) => edge.id !== state.selectedEdgeId);
      }
      return {
        processes: state.processes.map((item) => (item.id === active.id ? { ...item, nodes, edges } : item)),
        selectedNodeId: null,
        selectedEdgeId: null,
        unsaved: true,
      };
    }),
  updateNodeData: (nodeId, patch) =>
    set((state) => {
      const active = state.processes.find((item) => item.id === state.activeProcessId);
      if (!active) return state;
      return {
        processes: state.processes.map((item) =>
          item.id === active.id
            ? {
                ...item,
                nodes: item.nodes.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...patch } } : node)),
              }
            : item,
        ),
        unsaved: true,
      };
    }),
  updateEdgeData: (edgeId, patch) =>
    set((state) => {
      const active = state.processes.find((item) => item.id === state.activeProcessId);
      if (!active) return state;
      return {
        processes: state.processes.map((item) =>
          item.id === active.id
            ? {
                ...item,
                edges: item.edges.map((edge) =>
                  edge.id === edgeId ? { ...edge, data: { ...(edge.data ?? {}), ...patch } } : edge,
                ),
              }
            : item,
        ),
        unsaved: true,
      };
    }),
  validate: () => {
    const state = get();
    const active = state.processes.find((item) => item.id === state.activeProcessId);
    if (!active) return [];
    const issues = validateProcess(active);
    set({ validationIssues: issues });
    return issues;
  },
  save: async () => {
    set({ saveState: { state: "saving" } });
    await new Promise((resolve) => setTimeout(resolve, 700));
    const state = get();
    const active = state.processes.find((item) => item.id === state.activeProcessId);
    if (!active) {
      set({ saveState: { state: "error", message: "Процесс не выбран" } });
      return;
    }
    set((current) => ({
      processes: current.processes.map((item) =>
        item.id === active.id ? { ...item, updatedAt: new Date().toLocaleDateString("ru-RU") } : item,
      ),
      saveState: { state: "saved", message: "Черновик сохранён" },
      toastMessage: "Изменения сохранены",
      unsaved: false,
    }));
  },
  publish: async () => {
    const issues = get().validate();
    if (issues.length > 0) {
      set({
        publishState: { state: "blocked", message: "Публикация заблокирована из-за ошибок валидации" },
        toastMessage: "Исправьте ошибки валидации перед публикацией",
      });
      return false;
    }
    await new Promise((resolve) => setTimeout(resolve, 800));
    set((state) => ({
      processes: state.processes.map((item) =>
        item.id === state.activeProcessId ? { ...item, status: "published", updatedAt: new Date().toLocaleDateString("ru-RU") } : item,
      ),
      publishState: { state: "success", message: "Процесс опубликован" },
      toastMessage: "Процесс успешно опубликован",
      mode: "view",
      unsaved: false,
    }));
    return true;
  },
  clearToast: () => set({ toastMessage: null }),
  autoArrange: () =>
    set((state) => {
      const active = state.processes.find((item) => item.id === state.activeProcessId);
      if (!active) return state;
      return {
        processes: state.processes.map((item) =>
          item.id === active.id ? { ...item, nodes: autoLayout(active.nodes, active.edges) as ProcessNode[] } : item,
        ),
        unsaved: true,
      };
    }),
  undo: () =>
    set((state) => {
      const active = state.processes.find((item) => item.id === state.activeProcessId);
      if (!active || state.historyPast.length === 0) return state;
      const previous = state.historyPast[state.historyPast.length - 1];
      return {
        processes: state.processes.map((item) =>
          item.id === active.id ? { ...item, nodes: previous.nodes, edges: previous.edges } : item,
        ),
        historyPast: state.historyPast.slice(0, -1),
        historyFuture: [{ nodes: active.nodes, edges: active.edges }, ...state.historyFuture].slice(0, 40),
      };
    }),
  redo: () =>
    set((state) => {
      const active = state.processes.find((item) => item.id === state.activeProcessId);
      if (!active || state.historyFuture.length === 0) return state;
      const next = state.historyFuture[0];
      return {
        processes: state.processes.map((item) =>
          item.id === active.id ? { ...item, nodes: next.nodes, edges: next.edges } : item,
        ),
        historyPast: [...state.historyPast, { nodes: active.nodes, edges: active.edges }].slice(-40),
        historyFuture: state.historyFuture.slice(1),
      };
    }),
  dismissLoadError: () => set({ loadError: null }),
  toggleErrorsPanel: () => set((state) => ({ showErrorsPanel: !state.showErrorsPanel })),
  setErrorsPanel: (value) => set({ showErrorsPanel: value }),
  setInspectorCollapsed: (value) => set({ inspectorCollapsed: value }),
  generateDemoFlowFromAttachment: (fileName) =>
    set((state) => {
      const active = state.processes.find((item) => item.id === state.activeProcessId);
      if (!active) return state;
      const flow = buildDemoFlow(fileName);
      const updated: BusinessProcess = {
        ...active,
        nodes: flow.nodes,
        edges: flow.edges,
        description: `Демо-схема сгенерирована из файла: ${fileName}`,
        updatedAt: new Date().toLocaleDateString("ru-RU"),
      };
      return {
        processes: state.processes.map((item) => (item.id === active.id ? updated : item)),
        selectedNodeId: null,
        selectedEdgeId: null,
        liveFocusNodeId: null,
        validationIssues: validateProcess(updated),
        mode: "edit",
        unsaved: true,
        showErrorsPanel: false,
        toastMessage: "Демо-схема построена автоматически",
      };
    }),
  generateDemoFlowFromAttachmentLive: async (fileName) => {
    const state = get();
    const active = state.processes.find((item) => item.id === state.activeProcessId);
    if (!active) return;

    const flow = buildDemoFlow(fileName);

    const STEP_DELAY_MS = 1100;
    for (let i = 1; i <= flow.order.length; i++) {
      const visibleNodeIds = new Set(flow.order.slice(0, i));
      const nodes = flow.nodes.filter((node) => visibleNodeIds.has(node.id));
      const edges = flow.edges.filter((edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target));
      const focusedNodeId = flow.order[i - 1] ?? null;

      set((current) => ({
        processes: current.processes.map((item) =>
          item.id === active.id
            ? {
                ...item,
                nodes,
                edges,
                description: `Демо-схема сгенерирована из файла: ${fileName}`,
                updatedAt: new Date().toLocaleDateString("ru-RU"),
              }
            : item,
        ),
        selectedNodeId: null,
        selectedEdgeId: null,
        liveFocusNodeId: focusedNodeId,
        mode: "edit",
        unsaved: true,
        showErrorsPanel: false,
      }));

      await new Promise((resolve) => window.setTimeout(resolve, STEP_DELAY_MS));
    }

    const updated = get().processes.find((item) => item.id === active.id);
    if (!updated) return;
    set({
      validationIssues: validateProcess(updated),
      toastMessage: "Демо-схема построена в live-режиме",
      liveFocusNodeId: null,
    });
  },
}));

