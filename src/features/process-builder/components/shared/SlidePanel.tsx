import { Box } from "@mui/material";
import { figmaTokens } from "../../../../theme/figmaTokens";

interface SlidePanelProps {
  open: boolean;
  children: React.ReactNode;
  width?: number;
}

export function SlidePanel({ open, children, width = 320 }: SlidePanelProps) {
  const chrome = figmaTokens.colors.processBuilderChrome;
  return (
    <Box
      sx={{
        position: "absolute",
        right: 12,
        top: 12,
        width,
        maxHeight: "calc(100% - 24px)",
        height: "fit-content",
        borderRadius: `${figmaTokens.radius.lg}px`,
        border: chrome.panelBorder,
        bgcolor: chrome.panelBg,
        boxShadow: chrome.panelShadow,
        overflow: "auto",
        zIndex: 8,
        transform: open ? "translateX(0)" : "translateX(calc(100% + 24px))",
        transition: "transform 200ms ease-out",
        pointerEvents: open ? "auto" : "none",
      }}
    >
      {children}
    </Box>
  );
}
