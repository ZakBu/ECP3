import { LinearProgress, Stack, Typography } from "@mui/material";

const milestones = [
  { label: "Подготовка данных", value: 90 },
  { label: "Внутреннее согласование", value: 65 },
  { label: "Публикация", value: 35 },
];

export default function GanttWidget() {
  return (
    <Stack spacing={1.5}>
      {milestones.map((m) => (
        <Stack key={m.label} spacing={0.5}>
          <Typography variant="caption">{m.label}</Typography>
          <LinearProgress variant="determinate" value={m.value} />
        </Stack>
      ))}
    </Stack>
  );
}

