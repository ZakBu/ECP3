import { Box } from "@mui/material";
import type { ReactNode } from "react";

interface ServicesStripProps {
  content: ReactNode;
}

export default function ServicesStrip({ content }: ServicesStripProps) {
  return <Box sx={{ width: "100%" }}>{content}</Box>;
}

