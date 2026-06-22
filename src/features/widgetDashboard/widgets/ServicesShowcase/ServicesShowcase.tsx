import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";

const services = [
  "СБИС",
  "Портал мэра",
  "СПС УП",
  "Вики",
  "ИАС УГД",
  "МосЭДО",
  "Задачник",
  "ИАС ОГД",
  "ИАИС РиН",
  "АИС ЭП",
];

export default function ServicesShowcase() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(132px, 1fr))",
        gap: 1,
      }}
    >
      {services.map((name) => (
        <Box key={name}>
          <Paper
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1,
              py: 0.65,
              border: "1px solid",
              borderColor: "#e5e9f2",
              bgcolor: "#fff",
              minHeight: 42,
            }}
            elevation={0}
          >
            <Avatar sx={{ width: 28, height: 28, bgcolor: "#e9f3ff", color: "#1976d2", fontSize: 12 }}>
              {name[0]}
            </Avatar>
            <Stack sx={{ minWidth: 0 }}>
              <Typography variant="caption" noWrap>
                {name}
              </Typography>
            </Stack>
          </Paper>
        </Box>
      ))}
    </Box>
  );
}

