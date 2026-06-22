import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Box, Button, InputBase, Paper, Skeleton, Stack, Tab, Tabs, Typography } from "@mui/material";
import { figmaTokens } from "../../../../theme/figmaTokens";
import type { BusinessProcess, ProcessTab, TemplateProcess } from "../../types/process-builder.types";
import { ProcessCard } from "../ProcessCard/ProcessCard";
import { TemplateList } from "../TemplateList/TemplateList";

interface ProcessListPanelProps {
  isLoading: boolean;
  error: string | null;
  tab: ProcessTab;
  search: string;
  processes: BusinessProcess[];
  templates: TemplateProcess[];
  activeProcessId: string | null;
  onTabChange: (tab: ProcessTab) => void;
  onSearchChange: (value: string) => void;
  onCreateProcess: () => void;
  onSelectProcess: (id: string) => void;
  onCreateFromTemplate: (templateId: string) => void;
}

export function ProcessListPanel(props: ProcessListPanelProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        borderRadius: `${figmaTokens.radius.md}px`,
        border: `1px solid ${figmaTokens.colors.outline}`,
        height: "calc(100vh - 108px)",
        overflow: "auto",
        bgcolor: figmaTokens.colors.surfaceLow,
        boxShadow: figmaTokens.shadow.node,
      }}
    >
      <Stack spacing={1.3}>
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: figmaTokens.colors.textPrimary }}>Процессы</Typography>
        <Paper
          elevation={0}
          sx={{ px: 1.2, py: 0.4, display: "flex", alignItems: "center", border: `1px solid ${figmaTokens.colors.outline}`, bgcolor: figmaTokens.colors.surfaceLow }}
        >
          <SearchOutlinedIcon sx={{ fontSize: 18, color: figmaTokens.colors.textMuted }} />
          <InputBase
            value={props.search}
            onChange={(event) => props.onSearchChange(event.target.value)}
            placeholder="Поиск процесса"
            sx={{ fontSize: 13, ml: 1, width: "100%" }}
          />
        </Paper>
        <Tabs value={props.tab} onChange={(_, next: ProcessTab) => props.onTabChange(next)} sx={{ minHeight: 36 }} variant="fullWidth">
          <Tab value="my" label="Мои" />
          <Tab value="templates" label="Шаблоны" />
          <Tab value="drafts" label="Черновики" />
        </Tabs>
        <Button variant="contained" onClick={props.onCreateProcess}>
          Создать процесс
        </Button>

        {props.error ? (
          <Paper sx={{ p: 1.2, border: `1px solid ${figmaTokens.colors.danger}`, color: figmaTokens.colors.danger }}>
            Ошибка загрузки списка процессов
          </Paper>
        ) : null}

        {props.isLoading ? (
          <Stack spacing={1}>
            <Skeleton variant="rounded" height={94} />
            <Skeleton variant="rounded" height={94} />
            <Skeleton variant="rounded" height={94} />
          </Stack>
        ) : props.tab === "templates" ? (
          <TemplateList templates={props.templates} onCreateFromTemplate={props.onCreateFromTemplate} />
        ) : props.processes.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography sx={{ fontSize: 14, color: figmaTokens.colors.textSecondary }}>
              {props.search ? "По вашему запросу процессы не найдены" : "Список процессов пуст"}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1}>
            {props.processes.map((process) => (
              <ProcessCard key={process.id} process={process} selected={process.id === props.activeProcessId} onClick={() => props.onSelectProcess(process.id)} />
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

