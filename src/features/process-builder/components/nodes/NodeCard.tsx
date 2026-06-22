import type { CSSProperties } from "react";
import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Box, Stack, Typography } from "@mui/material";
import type { ProcessNodeData } from "../../types/process-builder.types";
import { getNodeKindVisual } from "../../utils/nodeKindVisuals";

/** Ровно на середине границы: смещение = половина ширины = 5px */
const handleStyle: CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: "50%",
  border: "1px solid rgba(0, 0, 0, 0.18)",
  background: "#FFFFFF",
  boxShadow: "none",
};

export interface NodeCardProps extends NodeProps {
  title: string;
  /** Сегменты нижней строки, объединяются через « · » */
  footerSegments?: string[];
}

export function NodeCard({ selected, data, title, footerSegments }: NodeCardProps) {
  const nodeData = data as unknown as ProcessNodeData;
  const locked = Boolean(data && typeof data === "object" && "_locked" in data && (data as { _locked?: boolean })._locked);
  const { Icon, iconBg, iconColor, typeLabel } = getNodeKindVisual(nodeData.kind);
  const description = "description" in nodeData ? nodeData.description : undefined;
  const footer =
    footerSegments && footerSegments.length > 0
      ? footerSegments.filter(Boolean).join(" · ")
      : "";
  const isStart = nodeData.kind === "start";

  return (
    <Box
      sx={{
        width: 224,
        position: "relative",
        px: "14px",
        py: "12px",
        bgcolor: "#FFFFFF",
        borderRadius: "16px",
        border: `1px solid ${selected ? "rgba(0, 0, 0, 0.12)" : "rgba(0, 0, 0, 0.08)"}`,
        opacity: locked ? 0.72 : 1,
        boxShadow: selected
          ? "0 0 0 2px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.08)"
          : "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.15s ease, border-color 0.15s ease",
        "&:hover": {
          borderColor: "rgba(0, 0, 0, 0.12)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        },
      }}
    >
      {locked ? (
        <LockOutlinedIcon sx={{ position: "absolute", top: 8, right: 8, fontSize: 12, color: "rgba(0,0,0,0.3)" }} />
      ) : null}
      {/* target handle только у не-Start нод */}
      {!isStart ? (
        <Handle
          type="target"
          position={Position.Left}
          style={{ ...handleStyle, left: -5, top: "50%", transform: "translateY(-50%)" }}
        />
      ) : null}
      <Stack direction="row" spacing="12px" alignItems="center">
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "10px",
            bgcolor: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon sx={{ fontSize: 20, color: iconColor }} />
        </Box>
        <Stack spacing={0} sx={{ minWidth: 0, flex: 1 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#111111", lineHeight: 1.3 }}>
            {title}
          </Typography>
          {!isStart ? (
            <Typography sx={{ fontSize: 13, fontWeight: 400, color: "#999999", lineHeight: 1.3, mt: "1px" }}>{typeLabel}</Typography>
          ) : null}
          {description ? (
            <Typography sx={{ fontSize: 12, fontWeight: 400, color: "#AAAAAA", lineHeight: 1.35, mt: "2px" }}>
              {String(description)}
            </Typography>
          ) : null}
        </Stack>
      </Stack>
      {footer ? (
        <Typography sx={{ fontSize: 11, fontWeight: 400, color: "#BBBBBB", mt: "6px", lineHeight: 1.35 }}>{footer}</Typography>
      ) : null}
      {nodeData.kind !== "end" && nodeData.kind !== "stageGroup" && nodeData.kind !== "condition" ? (
        <Handle
          type="source"
          position={Position.Right}
          style={{ ...handleStyle, right: -5, top: "50%", transform: "translateY(-50%)" }}
        />
      ) : null}
    </Box>
  );
}
