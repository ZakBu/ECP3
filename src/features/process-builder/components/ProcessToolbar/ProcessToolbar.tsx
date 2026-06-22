import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Box, Button, Chip, IconButton, Menu, MenuItem, Stack, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { figmaTokens } from "../../../../theme/figmaTokens";
import type { BusinessProcess, EditorMode, ProcessStatus, SaveState, ValidationIssue } from "../../types/process-builder.types";
import { getStatusLabel } from "../../utils/process-mappers";

const toolbarIconBtnSx = {
  width: 40,
  height: 40,
  color: figmaTokens.colors.textSecondary,
  "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
} as const;

function toolbarStatusChipSx(status: ProcessStatus) {
  switch (status) {
    case "published":
      return { bgcolor: "#E8EDF4", color: "#546175" };
    case "draft":
      return { bgcolor: "#EBECEF", color: "#4B5563" };
    case "validationError":
      return { bgcolor: figmaTokens.colors.dangerBg, color: figmaTokens.colors.danger };
    case "archived":
      return { bgcolor: "#F0F1F3", color: figmaTokens.colors.textMuted };
    default:
      return { bgcolor: "#EBECEF", color: "#4B5563" };
  }
}

interface ProcessToolbarProps {
  process: BusinessProcess;
  mode: EditorMode;
  issues: ValidationIssue[];
  unsaved: boolean;
  saveState: SaveState;
  onBack: () => void;
  onSetMode: (mode: EditorMode) => void;
  onRenameProcess: (name: string) => void;
  onSave: () => void;
  onValidate: () => void;
  onPublish: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onAutoLayout: () => void;
  onHelp: () => void;
}

export function ProcessToolbar(props: ProcessToolbarProps) {
  const [moreAnchor, setMoreAnchor] = useState<HTMLElement | null>(null);
  const errorCount = props.issues.filter((issue) => issue.level === "error").length;
  const publishDisabled = errorCount > 0 || props.mode !== "edit";
  const statusSx = toolbarStatusChipSx(props.process.status);

  return (
    <Box
      component="header"
      sx={{
        flexShrink: 0,
        px: 2,
        py: 1.25,
        bgcolor: "transparent",
        borderBottom: "none",
        borderRadius: 0,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} sx={{ minHeight: 44 }}>
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ minWidth: 0, flex: "1 1 auto" }}>
          <Tooltip title="Назад к процессам">
            <IconButton
              size="medium"
              onClick={props.onBack}
              aria-label="Назад к процессам"
              sx={toolbarIconBtnSx}
            >
              <ChevronLeftIcon sx={{ fontSize: 22 }} />
            </IconButton>
          </Tooltip>
          <TextField
            variant="standard"
            value={props.process.name}
            onChange={(event) => props.onRenameProcess(event.target.value)}
            hiddenLabel
            InputProps={{ disableUnderline: true }}
            inputProps={{ "aria-label": "Название процесса" }}
            sx={{
              minWidth: 160,
              maxWidth: 420,
              flex: "0 1 auto",
              "& .MuiInputBase-input": {
                fontSize: 16,
                fontWeight: 500,
                color: "#222222",
                padding: 0,
                lineHeight: 1.3,
              },
            }}
          />
          <Chip
            size="small"
            label={getStatusLabel(props.process.status)}
            sx={{
              height: 26,
              fontSize: 12,
              fontWeight: 500,
              borderRadius: "999px",
              px: 0.25,
              ...statusSx,
              "& .MuiChip-label": { px: 1.25 },
            }}
          />
          {props.unsaved ? (
            <Tooltip title="Есть несохранённые изменения">
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: figmaTokens.colors.unsavedDot, flexShrink: 0 }} />
            </Tooltip>
          ) : null}
          {props.saveState.state === "saving" ? (
            <Typography sx={{ fontSize: 12, color: figmaTokens.colors.textMuted, flexShrink: 0 }}>Сохранение...</Typography>
          ) : null}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>
          <Tooltip title="Дополнительно">
            <IconButton
              size="medium"
              onClick={(event) => setMoreAnchor(event.currentTarget)}
              aria-label="Дополнительные действия"
              sx={toolbarIconBtnSx}
            >
              <MoreVertIcon sx={{ fontSize: 22 }} />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            size="medium"
            onClick={props.onPublish}
            disabled={publishDisabled}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: 14,
              borderRadius: "999px",
              px: 2,
              minHeight: 40,
              boxShadow: "none",
              bgcolor: figmaTokens.colors.primary,
              color: figmaTokens.colors.onPrimary,
              "&:hover": {
                boxShadow: "none",
                bgcolor: figmaTokens.colors.primaryHover,
              },
              "&.Mui-disabled": {
                bgcolor: figmaTokens.colors.surfaceVariant,
                color: figmaTokens.colors.textMuted,
              },
            }}
          >
            Опубликовать
          </Button>
          <ToggleButtonGroup
            exclusive
            value={props.mode}
            onChange={(_, value: EditorMode | null) => value && props.onSetMode(value)}
            aria-label="Режим редактора"
            sx={{
              ml: 1,
              p: 0.5,
              bgcolor: "#E6E8EC",
              borderRadius: "999px",
              border: "none",
              gap: 0.25,
              "& .MuiToggleButtonGroup-grouped": {
                border: 0,
                mx: 0,
              },
            }}
          >
            <ToggleButton
              value="edit"
              aria-label="Редактирование"
              sx={{
                border: "none",
                borderRadius: "999px !important",
                minWidth: 40,
                px: 1.25,
                py: 0.75,
                color: figmaTokens.colors.textSecondary,
                "&.Mui-selected": {
                  bgcolor: "#FFFFFF",
                  color: figmaTokens.colors.textPrimary,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  "&:hover": { bgcolor: "#FFFFFF" },
                },
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.5)",
                  "&.Mui-selected": { bgcolor: "#FFFFFF" },
                },
              }}
            >
              <EditOutlinedIcon sx={{ fontSize: 18 }} />
            </ToggleButton>
            <ToggleButton
              value="view"
              aria-label="Просмотр"
              sx={{
                border: "none",
                borderRadius: "999px !important",
                minWidth: 40,
                px: 1.25,
                py: 0.75,
                color: figmaTokens.colors.textSecondary,
                "&.Mui-selected": {
                  bgcolor: "#FFFFFF",
                  color: figmaTokens.colors.textPrimary,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  "&:hover": { bgcolor: "#FFFFFF" },
                },
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.5)",
                  "&.Mui-selected": { bgcolor: "#FFFFFF" },
                },
              }}
            >
              <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>

      <Menu anchorEl={moreAnchor} open={Boolean(moreAnchor)} onClose={() => setMoreAnchor(null)}>
        <MenuItem
          onClick={() => {
            props.onSave();
            setMoreAnchor(null);
          }}
        >
          <SaveOutlinedIcon sx={{ fontSize: 18, mr: 1, color: figmaTokens.colors.textMuted }} />
          Сохранить
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.onHelp();
            setMoreAnchor(null);
          }}
        >
          <HelpOutlineRoundedIcon sx={{ fontSize: 18, mr: 1, color: figmaTokens.colors.textMuted }} />
          Справка
        </MenuItem>
        <MenuItem
          disabled={props.mode !== "edit"}
          onClick={() => {
            props.onAutoLayout();
            setMoreAnchor(null);
          }}
        >
          <AutoFixHighOutlinedIcon sx={{ fontSize: 18, mr: 1, color: figmaTokens.colors.textMuted }} />
          Автовыравнивание
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.onDuplicate();
            setMoreAnchor(null);
          }}
        >
          <ContentCopyOutlinedIcon sx={{ fontSize: 18, mr: 1, color: figmaTokens.colors.textMuted }} />
          Дублировать
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.onArchive();
            setMoreAnchor(null);
          }}
        >
          <ArchiveOutlinedIcon sx={{ fontSize: 18, mr: 1, color: figmaTokens.colors.textMuted }} />
          Архивировать
        </MenuItem>
        <MenuItem onClick={() => setMoreAnchor(null)}>Экспорт JSON</MenuItem>
        <MenuItem
          onClick={() => {
            props.onDelete();
            setMoreAnchor(null);
          }}
          sx={{ color: figmaTokens.colors.danger }}
        >
          <DeleteOutlineIcon sx={{ fontSize: 18, mr: 1 }} />
          Удалить
        </MenuItem>
      </Menu>
    </Box>
  );
}
