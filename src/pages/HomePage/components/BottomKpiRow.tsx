import { Box } from "@mui/material";
import type { ReactNode } from "react";

interface BottomKpiRowProps {
  left: ReactNode;
  right: ReactNode;
}

export default function BottomKpiRow({ left, right }: BottomKpiRowProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 1.5,
      }}
    >
      {left}
      {right}
    </Box>
  );
}

