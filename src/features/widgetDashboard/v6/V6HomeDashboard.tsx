import { Box, Stack } from "@mui/material";
import AnalyticsWidget from "../widgets/AnalyticsWidget/AnalyticsWidget";
import AiAssistantWidget from "../widgets/AiAssistantWidget/AiAssistantWidget";
import MyTasks from "../widgets/MyTasks/MyTasks";
import TeamActivityWidget from "../widgets/TeamActivityWidget/TeamActivityWidget";
import Top5Widget from "../widgets/Top5Widget/Top5Widget";
import { V6, V6Chip, V6HeaderMenuButton, V6Link, v6Accent, v6HeaderIcon } from "./v6WidgetKit";

function V6Card({
  widgetId,
  title,
  sub,
  badge,
  badgeColor = "p",
  category,
  footer = true,
  children,
}: {
  widgetId: string;
  title: string;
  sub?: string;
  badge?: string;
  badgeColor?: string;
  category: "analytics" | "operational" | "informational";
  footer?: boolean;
  children: React.ReactNode;
}) {
  const iconBg =
    widgetId === "notifications"
      ? V6.tlC
      : category === "operational"
        ? V6.gC
        : category === "analytics"
          ? V6.pC
          : V6.aC;

  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: "20px",
        border: "1px solid rgba(195,198,217,.3)",
        boxShadow: "0 1px 3px rgba(0,0,0,.04),0 4px 16px rgba(0,0,0,.06)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        height: "100%",
        minHeight: 0,
      }}
    >
      <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: v6Accent(category), zIndex: 1 }} />
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.25}
        sx={{ px: 2, pt: 2.4, pb: 1.4, borderBottom: "1px solid rgba(195,198,217,.25)", bgcolor: "rgba(250,251,255,.95)" }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "12px",
            background: iconBg,
            boxShadow: `0 2px 10px ${iconBg}55`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {v6HeaderIcon(widgetId)}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ fontSize: 14, fontWeight: 500, color: V6.t1, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {title}
          </Box>
          {sub && (
            <Box sx={{ fontSize: 11, color: V6.t3, mt: 0.1, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {sub}
            </Box>
          )}
        </Box>
        {badge && <V6Chip c={badgeColor} sm>{badge}</V6Chip>}
        <V6HeaderMenuButton />
      </Stack>
      <Box sx={{ p: "14px 16px", flex: 1, minHeight: 0, overflow: "hidden" }}>{children}</Box>
      {footer && (
        <Box sx={{ px: 2, py: "8px", borderTop: "1px solid rgba(195,198,217,.25)", bgcolor: "rgba(250,251,255,.95)" }}>
          <V6Link>Подробнее</V6Link>
        </Box>
      )}
    </Box>
  );
}

export default function V6HomeDashboard() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "8fr 4fr 4fr",
        gridTemplateRows: "repeat(2, minmax(0, 1fr))",
        gap: 1.25,
        height: "675px",
      }}
    >
      <Box sx={{ gridColumn: "1 / 2", gridRow: "1 / 2", minWidth: 0, minHeight: 0 }}>
        <V6Card widgetId="tasks" title="Мои задачи" sub="Список задач" badge="3 срочных" badgeColor="r" category="operational">
          <MyTasks size="XL" state="list" />
        </V6Card>
      </Box>
      <Box sx={{ gridColumn: "2 / 3", gridRow: "1 / 2", minWidth: 0, minHeight: 0 }}>
        <V6Card widgetId="chart" title="Аналитический график" sub="Задачи по дням" category="analytics">
          <AnalyticsWidget size="M" state="bar" />
        </V6Card>
      </Box>
      <Box sx={{ gridColumn: "2 / 3", gridRow: "2 / 3", minWidth: 0, minHeight: 0 }}>
        <V6Card widgetId="top5" title="Топ-5 показателей" sub="Рейтинг по метрикам" category="analytics">
          <Top5Widget size="M" />
        </V6Card>
      </Box>
      <Box sx={{ gridColumn: "3 / 4", gridRow: "1 / 2", minWidth: 0, minHeight: 0 }}>
        <V6Card widgetId="notifications" title="AI-ассистент" sub="Задайте вопрос ИИ" category="operational" footer={false}>
          <AiAssistantWidget size="L" state="idle" />
        </V6Card>
      </Box>
      <Box sx={{ gridColumn: "1 / 2", gridRow: "2 / 3", width: "31%", minWidth: 0, minHeight: 0 }}>
        <V6Card widgetId="teamactivity" title="Активность команды" sub="Последние действия" category="operational" footer={false}>
          <TeamActivityWidget size="S" />
        </V6Card>
      </Box>
    </Box>
  );
}

