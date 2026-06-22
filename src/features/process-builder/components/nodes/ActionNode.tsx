import type { NodeProps } from "@xyflow/react";
import type { ActionNodeData } from "../../types/process-builder.types";
import { NodeCard } from "./NodeCard";

export function ActionNode(props: NodeProps) {
  const data = props.data as unknown as ActionNodeData;
  return <NodeCard {...props} title={data.name || "Без названия"} />;
}

