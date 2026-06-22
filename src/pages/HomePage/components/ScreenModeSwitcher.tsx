import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import type { TaskMode } from "../../../theme/figmaTokens";

interface ScreenModeSwitcherProps {
  value: TaskMode;
  onChange: (mode: TaskMode) => void;
}

export default function ScreenModeSwitcher({ value, onChange }: ScreenModeSwitcherProps) {
  return (
    <ToggleButtonGroup
      size="small"
      value={value}
      exclusive
      onChange={(_, mode: TaskMode | null) => {
        if (mode) onChange(mode);
      }}
    >
      <ToggleButton value="gantt">Экран 1 (Gantt)</ToggleButton>
      <ToggleButton value="list">Экран 2 (List)</ToggleButton>
      <ToggleButton value="kanban">Экран 3 (Kanban)</ToggleButton>
    </ToggleButtonGroup>
  );
}

