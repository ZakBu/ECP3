import { Box, Stack, Typography } from "@mui/material";
import type { WidgetId, WidgetSize } from "../../types/widget.types";

interface SpecWidgetProps {
  widgetId?: WidgetId;
  size?: WidgetSize;
}

const THEME = {
  analytics: {
    accent: "#3D8BDB",
    soft: "#E8F3FF",
    line: "#B8D7F2",
  },
  operational: {
    accent: "#74A33D",
    soft: "#EEF6E6",
    line: "#CFE5B9",
  },
  informational: {
    accent: "#C58A34",
    soft: "#FBF2E3",
    line: "#EAD4A8",
  },
};

const ANALYTICS = new Set<WidgetId>(["kpi", "chart", "violations", "funnel", "top5"]);
const INFORMATIONAL = new Set<WidgetId>([
  "news",
  "notifications",
  "regulations",
  "directory",
]);

const getCategory = (widgetId: WidgetId): "analytics" | "operational" | "informational" => {
  if (ANALYTICS.has(widgetId)) return "analytics";
  if (INFORMATIONAL.has(widgetId)) return "informational";
  return "operational";
};

const DotRow = ({ color }: { color: string }) => (
  <Stack direction="row" spacing={0.7} alignItems="center">
    {[1, 2, 3, 4].map((n) => (
      <Box key={n} sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: color, opacity: 0.75 - n * 0.1 }} />
    ))}
  </Stack>
);

const MiniBars = ({ color }: { color: string }) => (
  <Stack direction="row" spacing={0.5} alignItems="flex-end" sx={{ height: 44 }}>
    {[40, 62, 48, 78, 54, 68, 52, 82].map((v, idx) => (
      <Box
        key={`${v}-${idx}`}
        sx={{
          flex: 1,
          height: `${v}%`,
          borderRadius: "4px 4px 0 0",
          bgcolor: color,
          opacity: 0.85,
        }}
      />
    ))}
  </Stack>
);

const renderBySize = (
  widgetId: WidgetId,
  size: WidgetSize,
  palette: { accent: string; soft: string; line: string },
) => {
  if (widgetId === "news" || widgetId === "notifications") {
    return (
      <Stack spacing={0.7}>
        {[1, 2, 3].map((n) => (
          <Box key={n} sx={{ bgcolor: "#fff", borderRadius: 1.1, px: 1, py: 0.7, border: `1px solid ${palette.line}` }}>
            <Typography variant="caption" sx={{ color: "#46505D", fontWeight: 600 }}>
              {n === 1 ? "Новая возможность" : n === 2 ? "Обновление раздела" : "Новый реестр"}
            </Typography>
          </Box>
        ))}
      </Stack>
    );
  }

  if (size === "S") {
    return (
      <Stack spacing={1}>
        <Box sx={{ bgcolor: "#fff", borderRadius: 1.4, border: `1px solid ${palette.line}`, p: 1 }}>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#2B333E", lineHeight: 1 }}>12</Typography>
          <DotRow color={palette.accent} />
        </Box>
      </Stack>
    );
  }

  if (size === "M") {
    return (
      <Stack direction="row" spacing={0.8}>
        {[1, 2].map((n) => (
          <Box key={n} sx={{ flex: 1, bgcolor: "#fff", borderRadius: 1.2, border: `1px solid ${palette.line}`, p: 0.9 }}>
            <Typography variant="caption" sx={{ color: "#5D6775" }}>Показатель</Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#2D3641" }}>{n === 1 ? "24" : "7"}</Typography>
            <DotRow color={palette.accent} />
          </Box>
        ))}
      </Stack>
    );
  }

  if (size === "L") {
    return (
      <Stack spacing={0.9}>
        {[72, 56, 84].map((v) => (
          <Box key={v} sx={{ bgcolor: "#fff", borderRadius: 1.2, border: `1px solid ${palette.line}`, px: 1, py: 0.7 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="caption" sx={{ color: "#5B6673" }}>Строка</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#2C3641" }}>{v}%</Typography>
            </Stack>
            <Box sx={{ mt: 0.5, height: 6, borderRadius: 99, bgcolor: palette.soft }}>
              <Box sx={{ width: `${v}%`, height: "100%", borderRadius: 99, bgcolor: palette.accent }} />
            </Box>
          </Box>
        ))}
      </Stack>
    );
  }

  return (
    <Stack spacing={0.9}>
      <Stack direction="row" spacing={0.7}>
        {[24, 9, 6, 3].map((v) => (
          <Box key={v} sx={{ flex: 1, px: 0.8, py: 0.7, borderRadius: 1.2, bgcolor: "#fff", border: `1px solid ${palette.line}` }}>
            <Typography variant="caption" sx={{ color: "#5A6471" }}>Плитка</Typography>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#2D3641", lineHeight: 1.2 }}>{v}</Typography>
          </Box>
        ))}
      </Stack>
      <Box sx={{ bgcolor: "#fff", borderRadius: 1.2, border: `1px solid ${palette.line}`, px: 1, py: 0.8 }}>
        <MiniBars color={palette.accent} />
      </Box>
    </Stack>
  );
};

export default function SpecWidget({ widgetId = "kpi", size = "M" }: SpecWidgetProps) {
  const category = getCategory(widgetId);
  const palette = THEME[category];

  return (
    <Box
      sx={{
        height: "100%",
        borderRadius: 1.8,
        border: `1px solid ${palette.line}`,
        bgcolor: palette.soft,
        p: 0.9,
      }}
    >
      <Box sx={{ flex: 1, minHeight: 0 }}>{renderBySize(widgetId, size, palette)}</Box>
    </Box>
  );
}

