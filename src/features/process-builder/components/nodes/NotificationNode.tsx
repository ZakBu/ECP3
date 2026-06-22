import type { NodeProps } from "@xyflow/react";
import type { NotificationNodeData } from "../../types/process-builder.types";
import { NodeCard } from "./NodeCard";

export function NotificationNode(props: NodeProps) {
  const data = props.data as unknown as NotificationNodeData;
  return <NodeCard {...props} title={data.name} />;
}

