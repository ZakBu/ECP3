import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Slide,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { DashboardPresetId } from "../../config/dashboardPresets";

interface EditModeBarProps {
  onReset: () => void;
  onSave: () => void;
  onCancel: () => void;
  onApplyTemplate: (presetId: DashboardPresetId) => void;
  isDirty: boolean;
  isSaving?: boolean;
  hiddenCount?: number;
  deletedCount?: number;
}

export default function EditModeBar({
  onReset,
  onSave,
  onCancel,
  onApplyTemplate,
  isDirty,
  isSaving = false,
  hiddenCount = 0,
  deletedCount = 0,
}: EditModeBarProps) {
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [openTemplateDialog, setOpenTemplateDialog] = useState(false);
  const [template, setTemplate] = useState<DashboardPresetId>("executive");

  return (
    <>
      <Slide in direction="down" timeout={200}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            mb: 1,
            bgcolor: "rgba(58,50,69,0.86)",
            backdropFilter: "blur(20px) saturate(140%)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Toolbar sx={{ gap: 2 }}>
            <DragIndicatorIcon />
            <Typography fontWeight={700}>Режим редактирования</Typography>
            {isDirty && <Chip size="small" color="warning" label="Есть несохранённые изменения" />}
            {hiddenCount > 0 && <Chip size="small" color="info" label={`Скрыто: ${hiddenCount}`} />}
            {deletedCount > 0 && <Chip size="small" color="error" label={`Удалено до сохранения: ${deletedCount}`} />}
            <Box sx={{ flexGrow: 1 }} />
            <Select
              size="small"
              value={template}
              onChange={(event) => setTemplate(event.target.value as DashboardPresetId)}
              sx={{ minWidth: 220, bgcolor: "rgba(255,255,255,0.92)" }}
            >
              <MenuItem value="executive">Для руководителя</MenuItem>
              <MenuItem value="balanced">Для аналитика</MenuItem>
              <MenuItem value="operator">Для исполнителя</MenuItem>
            </Select>
            <Button
              color="inherit"
              variant="outlined"
              onClick={() => {
                if (isDirty) {
                  setOpenTemplateDialog(true);
                  return;
                }
                onApplyTemplate(template);
              }}
            >
              Применить шаблон
            </Button>
            <Button color="inherit" variant="outlined" onClick={() => setOpenResetDialog(true)}>
              Сбросить к стандарту
            </Button>
            <Button color="inherit" variant="outlined" onClick={onCancel}>
              Отменить
            </Button>
            <Button color="inherit" variant="contained" onClick={onSave} disabled={!isDirty || isSaving}>
              Сохранить
            </Button>
          </Toolbar>
        </AppBar>
      </Slide>
      <Dialog open={openTemplateDialog} onClose={() => setOpenTemplateDialog(false)}>
        <DialogTitle>Применить шаблон поверх текущего черновика?</DialogTitle>
        <DialogContent>
          Текущий черновик будет заменён раскладкой шаблона. Несохранённые изменения не исчезнут до нажатия
          «Сохранить», но будут перезаписаны внутри черновика.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTemplateDialog(false)}>Отмена</Button>
          <Button
            onClick={() => {
              onApplyTemplate(template);
              setOpenTemplateDialog(false);
            }}
            variant="contained"
          >
            Применить шаблон
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openResetDialog} onClose={() => setOpenResetDialog(false)}>
        <DialogTitle>Сбросить настройки?</DialogTitle>
        <DialogContent>
          Черновик будет приведён к стандартному шаблону вашей роли. После этого изменения можно сохранить или отменить.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResetDialog(false)}>Отмена</Button>
          <Button
            color="error"
            onClick={() => {
              onReset();
              setOpenResetDialog(false);
            }}
          >
            Сбросить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
