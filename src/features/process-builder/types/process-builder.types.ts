import type { Edge, Node, XYPosition } from "@xyflow/react";

export type ProcessStatus = "draft" | "published" | "validationError" | "archived";
export type ProcessTab = "my" | "templates" | "drafts";
export type EditorMode = "view" | "edit";

export type NodeKind =
  | "start"
  | "action"
  | "approval"
  | "condition"
  | "notification"
  | "end"
  | "stageGroup";

export interface ProcessMeta {
  id: string;
  name: string;
  description: string;
  status: ProcessStatus;
  updatedAt: string;
  owner: string;
  category?: string;
  tags?: string[];
  version?: string;
}

export interface StartNodeData {
  [key: string]: unknown;
  kind: "start";
  name: string;
  description?: string;
  triggerType: "manual" | "event" | "schedule";
  sla?: string;
}

export interface ActionNodeData {
  [key: string]: unknown;
  kind: "action";
  name: string;
  description?: string;
  role?: string;
  sla?: string;
  actionType: "manual" | "system";
  required: boolean;
}

export interface ApprovalNodeData {
  [key: string]: unknown;
  kind: "approval";
  name: string;
  description?: string;
  role?: string;
  approvalMode: "single" | "anyOfGroup" | "sequentialAll";
  sla?: string;
  escalationEnabled: boolean;
}

export interface ConditionNodeData {
  [key: string]: unknown;
  kind: "condition";
  name: string;
  description?: string;
  branches: string[];
}

export interface NotificationNodeData {
  [key: string]: unknown;
  kind: "notification";
  name: string;
  channel: "inbox" | "email" | "both";
  recipients?: string;
  textTemplate?: string;
}

export interface EndNodeData {
  [key: string]: unknown;
  kind: "end";
  name: string;
  resultType: "success" | "rejected" | "cancelled";
}

export interface StageGroupNodeData {
  [key: string]: unknown;
  kind: "stageGroup";
  name: string;
  description?: string;
  colorTag?: "blue" | "mint" | "gray";
}

export type ProcessNodeData =
  | StartNodeData
  | ActionNodeData
  | ApprovalNodeData
  | ConditionNodeData
  | NotificationNodeData
  | EndNodeData
  | StageGroupNodeData;

export interface ProcessEdgeData {
  [key: string]: unknown;
  label?: string;
  condition?: string;
  comment?: string;
  isDefaultBranch?: boolean;
}

export type ProcessNode = Node<ProcessNodeData>;
export type ProcessEdge = Edge<ProcessEdgeData>;

export interface BusinessProcess extends ProcessMeta {
  nodes: ProcessNode[];
  edges: ProcessEdge[];
  isTemplateSource?: boolean;
}

export interface TemplateProcess {
  id: string;
  title: string;
  description: string;
  processSeed: Omit<BusinessProcess, "id" | "status" | "updatedAt" | "owner" | "name" | "description">;
}

export interface ValidationIssue {
  id: string;
  level: "error" | "warning";
  message: string;
  nodeId?: string;
  edgeId?: string;
}

export interface SaveState {
  state: "idle" | "saving" | "saved" | "error";
  message?: string;
}

export interface PublishState {
  state: "idle" | "blocked" | "success";
  message?: string;
}

export interface AddNodeRequest {
  kind: Exclude<NodeKind, "start">;
  sourceNodeId?: string;
  position?: XYPosition;
}

