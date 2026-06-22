import { ToggleButton, ToggleButtonGroup } from "@mui/material";

interface ViewSwitcherProps {
  value: string;
  options: string[];
  onChange: (next: string) => void;
}

const labelFor = (key: string): string => {
  if (key === "list") return "Список";
  if (key === "kanban") return "Канбан";
  if (key === "gantt") return "Гантт";
  return key;
};

export default function ViewSwitcher({ value, options, onChange }: ViewSwitcherProps) {
  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={value}
      onChange={(_, next) => {
        if (next) onChange(next);
      }}
    >
      {options.map((option) => (
        <ToggleButton key={option} value={option} sx={{ textTransform: "none", fontSize: 12 }}>
          {labelFor(option)}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
