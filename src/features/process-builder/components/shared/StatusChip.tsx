import { Chip } from "@mui/material";
import { figmaTokens } from "../../../../theme/figmaTokens";
import type { ProcessStatus } from "../../types/process-builder.types";
import { getStatusLabel } from "../../utils/process-mappers";

interface StatusChipProps {
  status: ProcessStatus;
}

function pickBg(status: ProcessStatus) {
  if (status === "published") return figmaTokens.colors.publishedBg;
  if (status === "validationError") return figmaTokens.colors.dangerBg;
  if (status === "archived") return figmaTokens.colors.archivedBg;
  return figmaTokens.colors.draftBg;
}

export function StatusChip({ status }: StatusChipProps) {
  return (
    <Chip
      size="small"
      label={getStatusLabel(status)}
      sx={{
        bgcolor: pickBg(status),
        height: 22,
        fontSize: 11,
        fontWeight: 600,
      }}
    />
  );
}
