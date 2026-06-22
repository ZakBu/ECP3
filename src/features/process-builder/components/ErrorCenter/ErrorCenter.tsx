import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { figmaTokens } from "../../../../theme/figmaTokens";
import type { ValidationIssue } from "../../types/process-builder.types";
import { SlidePanel } from "../shared/SlidePanel";

interface ErrorCenterProps {
  open: boolean;
  issues: ValidationIssue[];
  onClose: () => void;
  onSelectIssue: (issue: ValidationIssue) => void;
}

export function ErrorCenter({ open, issues, onClose, onSelectIssue }: ErrorCenterProps) {
  return (
    <SlidePanel open={open} width={360}>
      <Stack spacing={1.2} sx={{ p: 1.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: figmaTokens.colors.textPrimary }}>Ошибки валидации</Typography>
            <Typography sx={{ fontSize: 12, color: figmaTokens.colors.textMuted }}>
              {issues.length > 0 ? `Найдено: ${issues.length}` : "Ошибок не найдено"}
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>

        {issues.length === 0 ? (
          <Typography sx={{ fontSize: 13, color: figmaTokens.colors.textSecondary }}>Нарушений не обнаружено.</Typography>
        ) : (
          <Stack spacing={0.7}>
            {issues.map((issue) => (
              <Box
                key={issue.id}
                onClick={() => onSelectIssue(issue)}
                sx={{
                  border: `1px solid ${issue.level === "error" ? "#F2C7C8" : figmaTokens.colors.outline}`,
                  bgcolor: issue.level === "error" ? "#FFF6F6" : figmaTokens.colors.surfaceLow,
                  borderRadius: `${figmaTokens.radius.sm}px`,
                  p: 1,
                  cursor: "pointer",
                  transition: "border-color 120ms ease",
                  "&:hover": {
                    borderColor: issue.level === "error" ? figmaTokens.colors.danger : figmaTokens.colors.primary,
                  },
                }}
              >
                <Stack direction="row" spacing={0.8} alignItems="flex-start">
                  {issue.level === "error" ? (
                    <ErrorOutlineRoundedIcon sx={{ fontSize: 16, color: figmaTokens.colors.danger, mt: 0.1 }} />
                  ) : (
                    <WarningAmberRoundedIcon sx={{ fontSize: 16, color: figmaTokens.colors.warning, mt: 0.1 }} />
                  )}
                  <Typography sx={{ fontSize: 12, lineHeight: 1.45, color: figmaTokens.colors.textPrimary }}>{issue.message}</Typography>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Stack>
    </SlidePanel>
  );
}
