import type { NodeProps } from "@xyflow/react";
import type { ApprovalNodeData } from "../../types/process-builder.types";
import { NodeCard } from "./NodeCard";

export function ApprovalNode(props: NodeProps) {
  const data = props.data as unknown as ApprovalNodeData;
  return <NodeCard {...props} title={data.name} />;
}

