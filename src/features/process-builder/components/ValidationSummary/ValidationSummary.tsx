import { Box, Button, Stack, Typography } from "@mui/material";
import type { ValidationIssue } from "../../types/process-builder.types";

interface ValidationSummaryProps {
  issues: ValidationIssue[];
  expanded: boolean;
  onToggle: () => void;
}

export function ValidationSummary({ issues, expanded, onToggle }: ValidationSummaryProps) {
  const count = issues.length;

  return (
    <Box sx={{ borderTop: "1px solid rgba(0, 0, 0, 0.06)", mt: 2, pt: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#111111" }}>Проверка процесса</Typography>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ ml: "auto" }}>
          {count > 0 ? (
            <Typography
              component="span"
              sx={{
                fontSize: 12,
                fontWeight: 500,
                color: "#6B6B6B",
                bgcolor: "rgba(0, 0, 0, 0.05)",
                px: 1,
                py: 0.35,
                borderRadius: "999px",
                lineHeight: 1.4,
              }}
            >
              Ошибок: {count}
            </Typography>
          ) : (
            <Typography sx={{ fontSize: 12, fontWeight: 500, color: "#8E8E8E" }}>Без замечаний</Typography>
          )}
          <Button
            size="small"
            onClick={onToggle}
            sx={{
              textTransform: "none",
              fontSize: 13,
              fontWeight: 500,
              color: "#6B6B6B",
              minWidth: 0,
              px: 0.75,
              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
            }}
          >
            {expanded ? "Скрыть" : "Показать ошибки"}
          </Button>
        </Stack>
      </Stack>
      {expanded ? (
        <Stack spacing={1} sx={{ mt: 1.25 }}>
          {count === 0 ? (
            <Typography sx={{ fontSize: 13, color: "#8E8E8E", lineHeight: 1.5 }}>Нарушений не обнаружено.</Typography>
          ) : (
            issues.map((issue) => (
              <Box
                key={issue.id}
                sx={{
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: "#353740",
                  p: 1.25,
                  borderRadius: "10px",
                  bgcolor: "#FAF9FD",
                  border: "1px solid rgba(0, 0, 0, 0.06)",
                }}
              >
                {issue.message}
              </Box>
            ))
          )}
        </Stack>
      ) : null}
    </Box>
  );
}
