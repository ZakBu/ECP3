import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Box, IconButton, Paper, Stack, Typography } from "@mui/material";
import { figmaTokens } from "../../../../theme/figmaTokens";
import type { BusinessProcess } from "../../types/process-builder.types";
import { StatusDot } from "../shared/StatusDot";

interface ProcessCardProps {
  process: BusinessProcess;
  selected: boolean;
  onClick: () => void;
}

export function ProcessCard({ process, selected, onClick }: ProcessCardProps) {
  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        p: 1.6,
        borderRadius: 2,
        border: `1px solid ${selected ? figmaTokens.colors.primary : figmaTokens.colors.outline}`,
        bgcolor: figmaTokens.colors.surfaceLow,
        cursor: "pointer",
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        boxShadow: selected ? `0 0 0 1px ${figmaTokens.colors.primary}22` : "none",
        "&:hover": { borderColor: figmaTokens.colors.primaryHover, boxShadow: figmaTokens.shadow.lift },
        "& .quick-actions": { opacity: 0, transition: "opacity 120ms ease" },
        "&:hover .quick-actions": { opacity: 1 },
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              bgcolor: figmaTokens.colors.infoBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: figmaTokens.colors.primary,
              fontSize: 14,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            BP
          </Box>
          <Stack direction="row" spacing={0.2} className="quick-actions">
            <IconButton size="small" onClick={(e) => e.stopPropagation()}>
              <EditOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton size="small" onClick={(e) => e.stopPropagation()}>
              <ContentCopyOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton size="small" onClick={(e) => e.stopPropagation()}>
              <ArchiveOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Stack>
        </Stack>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: figmaTokens.colors.textPrimary, lineHeight: 1.35 }}>
          {process.name}
        </Typography>
        <Typography sx={{ fontSize: 12, color: figmaTokens.colors.textSecondary }} noWrap>
          {process.description}
        </Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={0.8} alignItems="center">
            <StatusDot status={process.status} />
            <Typography sx={{ fontSize: 12, color: figmaTokens.colors.textSecondary }}>
              {process.status === "published"
                ? "Опубликован"
                : process.status === "archived"
                  ? "Архив"
                  : process.status === "validationError"
                    ? "Требует правок"
                    : "Черновик"}
            </Typography>
          </Stack>
          <Typography sx={{ fontSize: 12, color: figmaTokens.colors.textMuted }}>
            {process.updatedAt}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

