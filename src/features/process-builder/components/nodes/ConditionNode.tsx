import type { CSSProperties } from "react";
import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { Box, Stack, Typography } from "@mui/material";
import type { ConditionNodeData } from "../../types/process-builder.types";
import { getNodeKindVisual } from "../../utils/nodeKindVisuals";

const handleStyle: CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: "50%",
  border: "1px solid rgba(0, 0, 0, 0.18)",
  background: "#FFFFFF",
  boxShadow: "none",
};

export function ConditionNode(props: NodeProps) {
  const data = props.data as unknown as ConditionNodeData;
  const { selected } = props;
  const { Icon, iconBg, iconColor } = getNodeKindVisual("condition");
  const branches = data.branches.length > 0 ? data.branches : ["Case", "Else"];
  const mainBranch = branches[0] ?? "Case";
  const elseBranch = branches[1] ?? "Else";

  return (
    <Box
      sx={{
        width: 224,
        position: "relative",
        bgcolor: "#FFFFFF",
        borderRadius: "16px",
        border: `1px solid ${selected ? "rgba(0, 0, 0, 0.12)" : "rgba(0, 0, 0, 0.08)"}`,
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
      <Handle
        type="target"
        position={Position.Left}
        style={{ ...handleStyle, left: -5, top: "50%", transform: "translateY(-50%)" }}
      />
      <Stack direction="row" spacing="12px" alignItems="center" sx={{ px: "14px", pt: "12px", pb: "10px" }}>
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
            {data.name}
          </Typography>
          <Typography sx={{ fontSize: 13, fontWeight: 400, color: "#999999", lineHeight: 1.3, mt: "1px" }}>If / else</Typography>
        </Stack>
      </Stack>
      <Stack sx={{ px: "14px", pb: "12px" }} spacing="6px">
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              height: 36,
              borderRadius: "8px",
              bgcolor: "#F5F5F5",
              display: "flex",
              alignItems: "center",
              px: "12px",
              mr: "10px",
            }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 400, color: "#444444" }} noWrap>
              {mainBranch}
            </Typography>
          </Box>
          <Handle
            type="source"
            position={Position.Right}
            id="branch-0"
            style={{
              ...handleStyle,
              right: -5,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
        </Box>
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              height: 36,
              borderRadius: "8px",
              bgcolor: "#F5F5F5",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: "12px",
              mr: "10px",
            }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 400, color: "#999999" }} noWrap>
              {elseBranch}
            </Typography>
          </Box>
          <Handle
            type="source"
            position={Position.Right}
            id="branch-1"
            style={{
              ...handleStyle,
              right: -5,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
        </Box>
      </Stack>
    </Box>
  );
}
