import { Box, Paper, Stack, Typography } from "@mui/material";
import { figmaTokens } from "../../../../../theme/figmaTokens";
import type { WidgetSize } from "../../../types/widget.types";

const columns = [
  { title: "НОВАЯ (3)", status: "Новая", color: "#52A8D4" },
  { title: "В РАБОТЕ (2)", status: "В работе", color: "#82B46A" },
  { title: "НА СОГЛАСОВАНИИ (3)", status: "На согласовании", color: "#8F98A8" },
  { title: "ПРОСРОЧЕНО (1)", status: "Просрочено", color: "#E56A6A" },
];

interface KanbanViewProps {
  size?: WidgetSize;
}

export default function KanbanView({ size = "M" }: KanbanViewProps) {
  const visibleCols = size === "S" ? columns.slice(0, 1) : size === "M" ? columns.slice(0, 2) : columns;
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${Math.max(1, visibleCols.length)}, minmax(0, 1fr))`,
        gap: 1,
      }}
    >
      {visibleCols.map((col) => (
        <Stack key={col.title} spacing={1}>
          <Typography variant="subtitle2" color="text.secondary">
            {col.title}
          </Typography>
          <Paper
            elevation={0}
            sx={{
              border: `1px solid ${figmaTokens.colors.outline}`,
              borderRadius: 1.5,
              p: 1,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              СDP-1289
            </Typography>
            <Typography variant="body1" fontWeight={600} mt={0.5}>
              Внести данные аэрофотосъемки
            </Typography>
            <Typography variant="caption" display="block" mt={0.5}>
              Артем Рычков
            </Typography>
            <Box
              sx={{
                mt: 1,
                borderRadius: 0.5,
                px: 0.75,
                py: 0.25,
                color: "#fff",
                bgcolor: col.color,
                fontSize: 11,
                width: "fit-content",
              }}
            >
              {col.status}
            </Box>
          </Paper>
        </Stack>
      ))}
    </Box>
  );
}

