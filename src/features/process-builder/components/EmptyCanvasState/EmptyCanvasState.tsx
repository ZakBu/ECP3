import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import { Button, Paper, Stack, Typography } from "@mui/material";

interface EmptyCanvasStateProps {
  onCreate: () => void;
  onOpenTemplates: () => void;
}

export function EmptyCanvasState({ onCreate, onOpenTemplates }: EmptyCanvasStateProps) {
  return (
    <Paper sx={{ p: 4, borderRadius: 3, textAlign: "center", border: "1px solid #D7D8D9" }}>
      <Stack spacing={1.2} alignItems="center">
        <FolderOpenOutlinedIcon sx={{ fontSize: 44, color: "#6A7380" }} />
        <Typography sx={{ fontSize: 20, fontWeight: 700 }}>Процесс не выбран</Typography>
        <Typography sx={{ fontSize: 14, color: "#5F6876", maxWidth: 480 }}>
          Откройте существующий процесс или создайте новый, чтобы начать моделирование бизнес-сценария.
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={onCreate}>
            Создать процесс
          </Button>
          <Button variant="outlined" onClick={onOpenTemplates}>
            Открыть шаблоны
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

