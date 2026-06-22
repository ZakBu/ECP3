import { Box } from "@mui/material";
import { figmaTokens } from "../../../../theme/figmaTokens";
import type { ProcessStatus } from "../../types/process-builder.types";

interface StatusDotProps {
  status: ProcessStatus;
  size?: number;
}

function pickColor(status: ProcessStatus) {
  if (status === "published") return figmaTokens.colors.success;
  if (status === "validationError") return figmaTokens.colors.danger;
  if (status === "archived") return figmaTokens.colors.textMuted;
  return figmaTokens.colors.primary;
}

export function StatusDot({ status, size = 8 }: StatusDotProps) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        bgcolor: pickColor(status),
        flexShrink: 0,
      }}
    />
  );
}
