import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { InputBase, Paper } from "@mui/material";
import { figmaTokens } from "../../../../theme/figmaTokens";

interface SearchFieldProps {
  placeholder?: string;
}

export default function SearchField({ placeholder = "Поиск..." }: SearchFieldProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        px: 1,
        py: 0.5,
        display: "flex",
        alignItems: "center",
        gap: 0.75,
        borderRadius: 1,
        border: `1px solid ${figmaTokens.colors.outline}`,
        bgcolor: figmaTokens.colors.surfaceLow,
      }}
    >
      <SearchOutlinedIcon sx={{ fontSize: 16, color: figmaTokens.colors.textMuted }} />
      <InputBase
        placeholder={placeholder}
        sx={{ fontSize: 12, color: figmaTokens.colors.textSecondary, width: "100%" }}
      />
    </Paper>
  );
}
