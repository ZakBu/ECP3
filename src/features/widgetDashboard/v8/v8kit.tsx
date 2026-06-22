import { Box, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

export const C = {
  p: "#1857C0",
  pC: "#D8E2FF",
  pM: "#3B7EE8",
  rM: "#E53935",
  gM: "#2E9B58",
  t1: "#191C22",
  t3: "#73778C",
  sf: "#FFFFFF",
  sf2: "#F8F9FE",
  ol: "#C3C6D9",
} as const;

export function Chip({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ px: 1, py: 0.25, borderRadius: 999, bgcolor: C.pC, color: C.p, fontSize: 10, fontWeight: 700 }}>
      {children}
    </Box>
  );
}

export function W({
  title,
  sub,
  children,
  foot,
}: {
  title: string;
  sub?: string;
  children: ReactNode;
  foot?: ReactNode;
}) {
  return (
    <Box sx={{ height: "100%", borderRadius: "20px", border: "1px solid rgba(195,198,217,.3)", background: C.sf, overflow: "hidden" }}>
      <Box sx={{ height: 3, background: "linear-gradient(90deg,#1857C0,#5B9BF0)" }} />
      <Stack sx={{ px: 2, pt: 1.8, pb: 1.1, borderBottom: "1px solid rgba(195,198,217,.25)", bgcolor: "rgba(250,251,255,.95)" }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>{title}</Typography>
        {sub ? <Typography sx={{ fontSize: 11, color: C.t3 }}>{sub}</Typography> : null}
      </Stack>
      <Box sx={{ p: 1.5, height: "calc(100% - 90px)", overflow: "auto" }}>{children}</Box>
      <Box sx={{ px: 2, py: 1, borderTop: "1px solid rgba(195,198,217,.25)", bgcolor: "rgba(250,251,255,.95)" }}>
        {foot ?? <Typography sx={{ fontSize: 12, color: C.p }}>Подробнее</Typography>}
      </Box>
    </Box>
  );
}

