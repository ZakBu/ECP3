import type { NodeProps } from "@xyflow/react";
import type { EndNodeData } from "../../types/process-builder.types";
import { NodeCard } from "./NodeCard";

export function EndNode(props: NodeProps) {
  const data = props.data as unknown as EndNodeData;
  return <NodeCard {...props} title={data.name} />;
}

