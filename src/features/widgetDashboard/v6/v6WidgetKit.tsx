import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import BookRoundedIcon from "@mui/icons-material/BookRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import GraphicEqRoundedIcon from "@mui/icons-material/GraphicEqRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import NewspaperRoundedIcon from "@mui/icons-material/NewspaperRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import WorkspacesRoundedIcon from "@mui/icons-material/WorkspacesRounded";
import { Box, ButtonBase, Chip as MuiChip, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

export const V6 = {
  p: "#1857C0",
  pC: "#D8E2FF",
  pCOn: "#001259",
  pM: "#3B7EE8",
  r: "#BA1A1A",
  rC: "#FFDAD6",
  rCOn: "#410002",
  rM: "#E53935",
  a: "#7D5700",
  aC: "#FFDEA9",
  aCOn: "#281800",
  aM: "#E08C00",
  g: "#1B6E36",
  gC: "#A2F6B5",
  gCOn: "#00210D",
  gM: "#2E9B58",
  tl: "#006874",
  tlC: "#9EEFFD",
  tlCOn: "#001F24",
  tlM: "#0097B2",
  pu: "#6B3FA0",
  puC: "#EBDDFF",
  puCOn: "#230060",
  puM: "#8B5CF6",
  t1: "#191C22",
  t2: "#43475A",
  t3: "#73778C",
  sf: "#FFFFFF",
  sf2: "#F8F9FE",
  sf3: "#ECEEF7",
  ol: "#C3C6D9",
} as const;

export function v6Accent(category: "analytics" | "operational" | "informational"): string {
  if (category === "analytics") return "linear-gradient(90deg,#1857C0,#5B9BF0)";
  if (category === "operational") return "linear-gradient(90deg,#1B6E36,#4CC97A)";
  return "linear-gradient(90deg,#B07400,#F0B800)";
}

export function v6HeaderIcon(widgetId: string): ReactNode {
  switch (widgetId) {
    case "kpi":
      return <InsightsRoundedIcon sx={{ fontSize: 18, color: V6.p }} />;
    case "chart":
      return <GraphicEqRoundedIcon sx={{ fontSize: 18, color: V6.p }} />;
    case "violations":
      return <WarningAmberRoundedIcon sx={{ fontSize: 18, color: V6.rM }} />;
    case "funnel":
      return <HubRoundedIcon sx={{ fontSize: 18, color: V6.p }} />;
    case "top5":
      return <StarRoundedIcon sx={{ fontSize: 18, color: V6.gM }} />;
    case "tasks":
      return <CheckBoxOutlinedIcon sx={{ fontSize: 18, color: V6.gM }} />;
    case "quickactions":
      return <BoltRoundedIcon sx={{ fontSize: 18, color: V6.aM }} />;
    case "favorites":
      return <StarRoundedIcon sx={{ fontSize: 18, color: V6.aM }} />;
    case "documents":
      return <DescriptionRoundedIcon sx={{ fontSize: 18, color: V6.p }} />;
    case "applications":
      return <WorkspacesRoundedIcon sx={{ fontSize: 18, color: V6.gM }} />;
    case "teamactivity":
      return <GroupsRoundedIcon sx={{ fontSize: 18, color: V6.puM }} />;
    case "calendar":
      return <CalendarMonthRoundedIcon sx={{ fontSize: 18, color: V6.p }} />;
    case "news":
      return <NewspaperRoundedIcon sx={{ fontSize: 18, color: V6.aM }} />;
    case "regulations":
      return <BookRoundedIcon sx={{ fontSize: 18, color: V6.p }} />;
    case "directory":
      return <GroupsRoundedIcon sx={{ fontSize: 18, color: V6.gM }} />;
    case "notifications":
      return <PsychologyRoundedIcon sx={{ fontSize: 18, color: V6.tlM }} />;
    default:
      return <InsightsRoundedIcon sx={{ fontSize: 18, color: V6.p }} />;
  }
}

export function V6Chip({
  c = "p",
  children,
  sm = false,
}: {
  c?: keyof typeof V6 | string;
  children: ReactNode;
  sm?: boolean;
}) {
  const bg = V6[`${c}C` as keyof typeof V6] ?? V6.pC;
  const color = V6[`${c}COn` as keyof typeof V6] ?? V6.pCOn;
  return (
    <MuiChip
      label={children}
      size="small"
      sx={{
        height: sm ? 18 : 24,
        fontSize: sm ? 9 : 11,
        fontWeight: 600,
        bgcolor: bg,
        color,
        "& .MuiChip-label": { px: sm ? 1 : 1.25 },
      }}
    />
  );
}

export function V6Progress({ pct, c = "p", h = 4 }: { pct: number; c?: keyof typeof V6 | string; h?: number }) {
  const bg = V6[`${c}C` as keyof typeof V6] ?? V6.pC;
  const fg = V6[`${c}M` as keyof typeof V6] ?? V6.pM;
  return (
    <Box sx={{ height: h, bgcolor: bg, borderRadius: 999, overflow: "hidden", flexShrink: 0 }}>
      <Box sx={{ height: "100%", width: `${Math.max(0, Math.min(100, pct))}%`, bgcolor: fg, borderRadius: 999 }} />
    </Box>
  );
}

export function V6Avatar({ t, bg = V6.pM, s = 28 }: { t: string; bg?: string; s?: number }) {
  return (
    <Box
      sx={{
        width: s,
        height: s,
        borderRadius: "50%",
        bgcolor: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 700,
        fontSize: s < 24 ? 8 : s < 30 ? 10 : 12,
        boxShadow: `0 2px 8px ${bg}55`,
        flexShrink: 0,
      }}
    >
      {t}
    </Box>
  );
}

export function V6SoftChip({ active = false, children }: { active?: boolean; children: ReactNode }) {
  return (
    <Box
      component="span"
      sx={{
        fontSize: 10,
        fontWeight: 600,
        px: 1.1,
        py: 0.4,
        borderRadius: 1,
        bgcolor: active ? V6.pC : V6.sf3,
        color: active ? V6.pM : V6.t2,
        border: `1px solid ${active ? `${V6.p}44` : `${V6.ol}44`}`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </Box>
  );
}

export function V6MetaRow({
  scope = "Отдел",
  subject = "ОГА",
  period = "7 дней",
  metric = "24 задачи",
  delta = "+8%",
}: {
  scope?: string;
  subject?: string;
  period?: string;
  metric?: string;
  delta?: string;
}) {
  const pos = delta.startsWith("+");
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.75}
      useFlexGap
      flexWrap="wrap"
      sx={{ mb: 1.5, px: 1.2, py: 0.85, bgcolor: V6.sf2, borderRadius: 1.25, border: `1px solid ${V6.ol}33` }}
    >
      <V6SoftChip active>{scope}: {subject}</V6SoftChip>
      <V6SoftChip>{period}</V6SoftChip>
      <Typography sx={{ fontSize: 11, fontWeight: 600, color: V6.t1 }}>{metric}</Typography>
      <Typography sx={{ fontSize: 10, fontWeight: 700, color: pos ? V6.gM : V6.rM, ml: "auto" }}>
        {pos ? "↑" : "↓"} {delta.replace(/^[+-]/, "")}
      </Typography>
    </Stack>
  );
}

export function V6Tabs({
  tabs,
  active,
  onChange,
  sm = false,
}: {
  tabs: Array<{ key: string; label: string }>;
  active: string;
  onChange: (key: string) => void;
  sm?: boolean;
}) {
  return (
    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
      {tabs.map((tab) => (
        <ButtonBase
          key={tab.key}
          onClick={() => onChange(tab.key)}
          sx={{
            px: 1.5,
            py: 0.55,
            borderRadius: 999,
            fontSize: sm ? 9 : 11,
            fontWeight: 500,
            color: active === tab.key ? "#fff" : V6.t2,
            bgcolor: active === tab.key ? V6.p : V6.sf3,
            boxShadow: active === tab.key ? `0 2px 8px ${V6.p}40` : "none",
          }}
        >
          {tab.label}
        </ButtonBase>
      ))}
    </Stack>
  );
}

export function V6Link({ children }: { children: ReactNode }) {
  return (
    <Stack direction="row" spacing={0.4} alignItems="center" sx={{ fontSize: 12, fontWeight: 500, color: V6.p }}>
      <Typography sx={{ fontSize: 12, fontWeight: 500, color: V6.p }}>{children}</Typography>
      <ArrowForwardIosRoundedIcon sx={{ fontSize: 11, color: V6.p }} />
    </Stack>
  );
}

export function V6SearchPlaceholder({ text }: { text: string }) {
  return (
    <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 1.5, px: 1.2, py: 0.95, bgcolor: V6.sf2, border: `1px solid ${V6.ol}44`, borderRadius: 1.25 }}>
      <SearchRoundedIcon sx={{ fontSize: 14, color: V6.t3 }} />
      <Typography sx={{ fontSize: 12, color: V6.t3 }}>{text}</Typography>
    </Stack>
  );
}

export function V6HeaderMenuButton() {
  return (
    <ButtonBase sx={{ width: 28, height: 28, borderRadius: 14, color: V6.t3 }}>
      <MoreVertRoundedIcon sx={{ fontSize: 16 }} />
    </ButtonBase>
  );
}

