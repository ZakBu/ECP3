import type { NodeProps } from "@xyflow/react";
import { Box, Typography } from "@mui/material";
import { figmaTokens } from "../../../../theme/figmaTokens";
import type { StageGroupNodeData } from "../../types/process-builder.types";

const colorMap = {
  blue: "#EAF2FF",
  mint: "#E7F8F2",
  gray: "#F2F4F8",
};

export function StageGroupNode(props: NodeProps) {
  const data = props.data as unknown as StageGroupNodeData;
  const color = colorMap[(data.colorTag ?? "blue") as keyof typeof colorMap];
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: `${figmaTokens.radius.md}px`,
        border: `1px dashed ${figmaTokens.colors.outline}`,
        bgcolor: color,
        p: 1.25,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.5)",
      }}
    >
      <Typography sx={{ fontSize: 13, fontWeight: 700, color: figmaTokens.colors.textPrimary }}>{data.name}</Typography>
      {data.description ? (
        <Typography sx={{ fontSize: 11, color: figmaTokens.colors.textSecondary }}>{data.description}</Typography>
      ) : null}
    </Box>
  );
}

