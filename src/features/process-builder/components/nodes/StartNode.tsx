import type { NodeProps } from "@xyflow/react";
import type { StartNodeData } from "../../types/process-builder.types";
import { NodeCard } from "./NodeCard";

export function StartNode(props: NodeProps) {
  const data = props.data as unknown as StartNodeData;
  return <NodeCard {...props} title={data.name} />;
}

