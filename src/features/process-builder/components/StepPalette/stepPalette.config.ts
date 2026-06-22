import CallSplitIcon from "@mui/icons-material/CallSplit";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import type { SvgIconComponent } from "@mui/icons-material";
import type { NodeKind } from "../../types/process-builder.types";

export type PaletteKind = Exclude<NodeKind, "start">;

export interface StepPaletteItem {
  kind: PaletteKind;
  label: string;
  description?: string;
  icon: SvgIconComponent;
  iconBg: string;
  iconColor: string;
}

export interface StepPaletteSection {
  id: string;
  /** Заголовок группы (как в Agent Builder: Core / Logic / …) */
  title: string;
  /** Короткая подсказка под заголовком секции */
  subtitle?: string;
  items: StepPaletteItem[];
}

/**
 * Библиотека шагов ЕЦП ГД в логике Agent Builder:
 * базовые правила → исполнение → ветвление → связь → финиш.
 */
export const STEP_PALETTE_SECTIONS: StepPaletteSection[] = [
  {
    id: "core",
    title: "Базовые",
    items: [],
  },
  {
    id: "execution",
    title: "Исполнение",
    items: [
      {
        kind: "action",
        label: "Действие",
        description: "Ручной или системный шаг",
        icon: PersonOutlineIcon,
        iconBg: "#E8F1FB",
        iconColor: "#005FAD",
      },
      {
        kind: "approval",
        label: "Согласование",
        description: "Цикл approve",
        icon: CheckCircleOutlineIcon,
        iconBg: "#E8F5EE",
        iconColor: "#1B6B3A",
      },
    ],
  },
  {
    id: "logic",
    title: "Логика",
    items: [
      {
        kind: "condition",
        label: "Условие",
        description: "If / else по веткам",
        icon: CallSplitIcon,
        iconBg: "#FDEBD0",
        iconColor: "#9A7B52",
      },
      {
        kind: "stageGroup",
        label: "Этап",
        description: "Группировка шагов",
        icon: FolderOpenOutlinedIcon,
        iconBg: "#F4F5F7",
        iconColor: "#2E3238",
      },
    ],
  },
  {
    id: "comms",
    title: "Связь",
    items: [
      {
        kind: "notification",
        label: "Уведомление",
        description: "Каналы inbox / email",
        icon: NotificationsNoneOutlinedIcon,
        iconBg: "#F3E8FF",
        iconColor: "#6B2F9A",
      },
    ],
  },
  {
    id: "finish",
    title: "Завершение",
    items: [
      {
        kind: "end",
        label: "Конец процесса",
        description: "Успех, отклонение, отмена",
        icon: HubOutlinedIcon,
        iconBg: "#ECEEF2",
        iconColor: "#5C6169",
      },
    ],
  },
];

export const PALETTE_DRAG_MIME = "application/x-ecp-process-node";
