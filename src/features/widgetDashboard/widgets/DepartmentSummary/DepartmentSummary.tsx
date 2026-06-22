import { Grid, Paper, Typography } from "@mui/material";

const cards = [
  { label: "Задачи отдела", value: 128 },
  { label: "На согласовании", value: 22 },
  { label: "Просрочено", value: 6 },
  { label: "Исполнено", value: 94 },
];

export default function DepartmentSummary() {
  return (
    <Grid container spacing={1}>
      {cards.map((card) => (
        <Grid key={card.label} size={6}>
          <Paper sx={{ p: 1 }}>
            <Typography variant="caption">{card.label}</Typography>
            <Typography variant="h6">{card.value}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

