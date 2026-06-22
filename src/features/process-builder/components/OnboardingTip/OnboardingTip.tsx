import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { figmaTokens } from "../../../../theme/figmaTokens";

interface OnboardingTipProps {
  title: string;
  description: string;
  onDismiss: () => void;
}

export function OnboardingTip({ title, description, onDismiss }: OnboardingTipProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        position: "absolute",
        left: 16,
        top: 64,
        zIndex: 11,
        border: `1px solid ${figmaTokens.colors.outline}`,
        boxShadow: figmaTokens.shadow.float,
        borderRadius: `${figmaTokens.radius.sm}px`,
        p: 1.2,
        maxWidth: 290,
      }}
    >
      <Stack spacing={0.8}>
        <Stack direction="row" spacing={0.7} alignItems="center">
          <InfoOutlinedIcon sx={{ fontSize: 16, color: figmaTokens.colors.primary }} />
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: figmaTokens.colors.textPrimary }}>{title}</Typography>
        </Stack>
        <Typography sx={{ fontSize: 12, color: figmaTokens.colors.textSecondary, lineHeight: 1.4 }}>{description}</Typography>
        <Box>
          <Button size="small" onClick={onDismiss} sx={{ textTransform: "none", p: 0, minWidth: 0 }}>
            Понятно
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
