import { Box, Stack, Typography } from "@mui/material";
import { memo, useCallback } from "react";
import { figmaTokens } from "../../../../theme/figmaTokens";
import type { EditorMode } from "../../types/process-builder.types";
import type { PaletteKind } from "./stepPalette.config";
import { PALETTE_DRAG_MIME, STEP_PALETTE_SECTIONS } from "./stepPalette.config";

const chrome = figmaTokens.colors.processBuilderChrome;

interface StepPaletteProps {
  mode: EditorMode;
  onAddStep: (kind: PaletteKind) => void;
}

export const StepPalette = memo(function StepPalette({ mode, onAddStep }: StepPaletteProps) {
  const handleDragStart = useCallback(
    (event: React.DragEvent, kind: PaletteKind) => {
      if (mode !== "edit") {
        event.preventDefault();
        return;
      }
      event.dataTransfer.setData(PALETTE_DRAG_MIME, kind);
      event.dataTransfer.effectAllowed = "copy";
    },
    [mode],
  );

  const sections = STEP_PALETTE_SECTIONS.filter((s) => s.items.length > 0);

  return (
    <Box
      sx={{
        width: 264,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignSelf: "flex-start",
        py: 1.5,
        pl: 1.5,
        pr: 0.75,
        boxSizing: "border-box",
        bgcolor: "transparent",
        pointerEvents: "none",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          bgcolor: chrome.panelBg,
          border: chrome.panelBorder,
          borderRadius: `${figmaTokens.radius.lg}px`,
          boxShadow: chrome.panelShadow,
          overflow: "hidden",
          pointerEvents: "auto",
        }}
      >
        <Box
          sx={{
            maxHeight: "calc(100vh - 120px)",
            overflowY: "auto",
            overflowX: "hidden",
            px: 2,
            py: 2.25,
            scrollbarGutter: "stable",
          }}
        >
          <Stack spacing={2.5}>
            {sections.map((section) => (
              <Stack key={section.id} spacing={1.1}>
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: chrome.sectionLabel,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    lineHeight: 1.2,
                    pl: 0.35,
                  }}
                >
                  {section.title}
                </Typography>
                <Stack spacing={0.5}>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Box
                        key={item.kind}
                        draggable={mode === "edit"}
                        onDragStart={(e) => handleDragStart(e, item.kind)}
                        onClick={() => {
                          if (mode === "edit") onAddStep(item.kind);
                        }}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.25,
                          pl: 0.75,
                          pr: 1.25,
                          py: 1,
                          borderRadius: `${figmaTokens.radius.xs}px`,
                          cursor: mode === "edit" ? "grab" : "default",
                          opacity: mode === "edit" ? 1 : 0.38,
                          transition: "background-color 0.18s ease",
                          "&:active": { cursor: mode === "edit" ? "grabbing" : "default" },
                          "@media (prefers-reduced-motion: reduce)": {
                            transition: "none",
                          },
                          "&:hover":
                            mode === "edit"
                              ? {
                                  bgcolor: chrome.itemHover,
                                }
                              : undefined,
                        }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            bgcolor: item.iconBg,
                          }}
                        >
                          <Icon sx={{ fontSize: 18, color: item.iconColor }} />
                        </Box>
                        <Typography
                          sx={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: chrome.itemText,
                            lineHeight: 1.3,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {item.label}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
});
