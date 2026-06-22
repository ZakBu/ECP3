import { Box, Stack, Typography } from "@mui/material";
import { figmaTokens } from "../../../../theme/figmaTokens";

interface HelpModeOverlayProps {
  active: boolean;
}

export function HelpModeOverlay({ active }: HelpModeOverlayProps) {
  if (!active) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 7,
        pointerEvents: "none",
        bgcolor: "rgba(0, 95, 173, 0.03)",
      }}
    >
      <Stack
        sx={{
          position: "absolute",
          right: 18,
          top: 64,
          p: 1.2,
          borderRadius: `${figmaTokens.radius.sm}px`,
          border: `1px solid ${figmaTokens.colors.outline}`,
          bgcolor: "rgba(255,255,255,0.95)",
          boxShadow: figmaTokens.shadow.float,
          maxWidth: 280,
        }}
      >
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: figmaTokens.colors.textPrimary }}>Режим подсказок</Typography>
        <Typography sx={{ fontSize: 12, color: figmaTokens.colors.textSecondary, lineHeight: 1.4 }}>
          Выберите шаг, чтобы редактировать свойства справа. Drag and drop из левой палитры или используйте быстрые действия внизу.
        </Typography>
      </Stack>
    </Box>
  );
}
