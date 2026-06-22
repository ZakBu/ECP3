import { Box, Stack, Typography } from "@mui/material";
import { figmaTokens } from "../../../../../theme/figmaTokens";
import type { WidgetSize } from "../../../types/widget.types";

const bars = [
  { id: "CDP-128", top: 34, left: 4, width: 180, color: "#EE5B5B" },
  { id: "CDP-127", top: 58, left: 8, width: 160, color: "#E8A645" },
  { id: "CDP-126", top: 82, left: 48, width: 190, color: "#E8A645" },
  { id: "CDP-124", top: 108, left: 240, width: 360, color: "#5BA9D8" },
  { id: "CDP-125", top: 130, left: 240, width: 70, color: "#5BA9D8" },
];

interface GanttViewProps {
  size?: WidgetSize;
}

export default function GanttView({ size = "M" }: GanttViewProps) {
  const visibleBars = size === "S" ? bars.slice(0, 2) : size === "M" ? bars.slice(0, 3) : bars;
  const trackHeight = size === "S" ? 110 : size === "M" ? 140 : 180;
  return (
    <Stack spacing={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="caption" color="text.secondary">
          28 апр - 11 мая 2025
        </Typography>
      </Stack>
      <Box
        sx={{
          position: "relative",
          height: trackHeight,
          border: `1px solid ${figmaTokens.colors.outline}`,
          borderRadius: 1.5,
          bgcolor: figmaTokens.colors.surfaceLow,
          overflow: "hidden",
        }}
      >
        {visibleBars.map((bar) => (
          <Box
            key={bar.id}
            sx={{
              position: "absolute",
              left: bar.left,
              top: bar.top,
              width: bar.width,
              height: 14,
              borderRadius: 0.5,
              bgcolor: bar.color,
              color: "#fff",
              fontSize: 10,
              px: 0.5,
            }}
          >
            {bar.id}
          </Box>
        ))}
      </Box>
    </Stack>
  );
}

