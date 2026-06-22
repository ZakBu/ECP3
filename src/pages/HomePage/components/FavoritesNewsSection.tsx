import { Box } from "@mui/material";
import type { ReactNode } from "react";

interface FavoritesNewsSectionProps {
  favorites: ReactNode;
  sidePanel: ReactNode;
}

export default function FavoritesNewsSection({
  favorites,
  sidePanel,
}: FavoritesNewsSectionProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "3fr 2fr",
        gap: 1.5,
      }}
    >
      {favorites}
      {sidePanel}
    </Box>
  );
}

