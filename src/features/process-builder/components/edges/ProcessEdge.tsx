import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from "@xyflow/react";
import { Box } from "@mui/material";
import type { ProcessEdgeData } from "../../types/process-builder.types";

export function ProcessEdge(props: EdgeProps) {
  const edgeData = (props.data ?? {}) as ProcessEdgeData;
  const [path, labelX, labelY] = getBezierPath(props);
  return (
    <>
      <BaseEdge
        path={path}
        style={{
          stroke: props.selected ? "rgba(129, 140, 153, 0.95)" : "rgba(156, 163, 175, 0.82)",
          strokeWidth: props.selected ? 1.5 : 1.2,
        }}
      />
      {edgeData.label ? (
        <EdgeLabelRenderer>
          <Box
            sx={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
              px: 0.65,
              py: 0.15,
              borderRadius: "999px",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              bgcolor: "#FFFFFF",
              color: "#6B7280",
              fontSize: 10,
              fontWeight: 500,
            }}
          >
            {edgeData.label}
          </Box>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}

