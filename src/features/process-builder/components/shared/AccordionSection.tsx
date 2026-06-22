import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { Box, Stack, Typography } from "@mui/material";
import { useCallback, useState } from "react";

interface AccordionSectionProps {
  title: string;
  defaultExpanded?: boolean;
  /** Первая секция в панели — без линии сверху */
  hideTopRule?: boolean;
  children: React.ReactNode;
}

export function AccordionSection({ title, defaultExpanded = false, hideTopRule = false, children }: AccordionSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const toggle = useCallback(() => setExpanded((v) => !v), []);

  return (
    <Box
      sx={{
        ...(hideTopRule
          ? { pt: 0, mt: 0, borderTop: "none" }
          : { borderTop: "1px solid rgba(0, 0, 0, 0.06)", pt: 1.75, mt: 0.25 }),
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        onClick={toggle}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        sx={{
          cursor: "pointer",
          userSelect: "none",
          py: 0.25,
          mx: -0.25,
          px: 0.25,
          borderRadius: "8px",
          "&:focus-visible": { outline: "2px solid rgba(0, 0, 0, 0.15)", outlineOffset: 2 },
        }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#111111", letterSpacing: "-0.01em" }}>{title}</Typography>
        <ExpandMoreRoundedIcon
          sx={{
            fontSize: 22,
            color: "#8E8E8E",
            transform: expanded ? "rotate(180deg)" : "none",
            transition: "transform 0.18s ease",
          }}
        />
      </Stack>
      {expanded ? <Box sx={{ pt: 1.75, pb: 0.25 }}>{children}</Box> : null}
    </Box>
  );
}
