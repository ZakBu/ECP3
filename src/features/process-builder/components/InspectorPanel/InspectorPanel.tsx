import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Box, IconButton, Stack, Switch, TextField, Typography } from "@mui/material";
import type { ReactNode } from "react";
import type { ProcessEdge, ProcessNode, ProcessNodeData, ValidationIssue } from "../../types/process-builder.types";
import { ValidationSummary } from "../ValidationSummary/ValidationSummary";
import { AccordionSection } from "../shared/AccordionSection";
import { SlidePanel } from "../shared/SlidePanel";

const inputRootSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#F2F2F2",
    borderRadius: "10px",
    fontSize: 14,
    color: "#111111",
    "& fieldset": { border: "none" },
    "&:hover fieldset": { border: "none" },
    "&.Mui-focused fieldset": { border: "1px solid rgba(0, 0, 0, 0.12)" },
    "&.Mui-focused": { bgcolor: "#EBEBEB" },
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#8E8E8E",
    opacity: 1,
  },
} as const;

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <Typography component="span" sx={{ fontSize: 13, fontWeight: 500, color: "#111111" }}>
      {children}
    </Typography>
  );
}

function inspectorSubtitleForNode(data: ProcessNodeData): string {
  switch (data.kind) {
    case "start":
      return "Точка входа в процесс";
    case "end":
      return "Завершение процесса";
    case "action":
      return "Настройте действие на этом шаге";
    case "approval":
      return "Согласование и маршрут";
    case "notification":
      return "Уведомление участникам";
    case "condition":
      return "Создайте условия для развилки процесса";
    case "stageGroup":
      return "Группа этапов";
  }
}

interface InspectorPanelProps {
  node: ProcessNode | null;
  edge: ProcessEdge | null;
  issues: ValidationIssue[];
  showErrorsPanel: boolean;
  onUpdateNode: (nodeId: string, patch: Record<string, unknown>) => void;
  onUpdateEdge: (edgeId: string, patch: Record<string, unknown>) => void;
  onToggleErrorsPanel: () => void;
  onClose: () => void;
}

export function InspectorPanel(props: InspectorPanelProps) {
  const hasExecutionFields = Boolean(
    props.node && ("role" in props.node.data || "sla" in props.node.data),
  );
  const isConditionNode = Boolean(props.node && props.node.data.kind === "condition");

  return (
    <SlidePanel open={Boolean(props.node || props.edge)} width={368}>
      <Stack sx={{ p: 2.25, pb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Box sx={{ minWidth: 0, pr: 1 }}>
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 600,
                color: "#111111",
                letterSpacing: "-0.02em",
                lineHeight: 1.3,
              }}
            >
              {props.node ? "Свойства шага" : "Свойства перехода"}
            </Typography>
            <Typography sx={{ fontSize: 13, color: "#6B6B6B", lineHeight: 1.45, mt: 0.5 }}>
              {props.node ? inspectorSubtitleForNode(props.node.data as ProcessNodeData) : `${props.edge?.source} → ${props.edge?.target}`}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={props.onClose}
            aria-label="Закрыть панель"
            sx={{
              color: "#8E8E8E",
              mt: -0.25,
              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.05)" },
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Stack>

        {props.node ? (
          <>
            <AccordionSection title="Основное" defaultExpanded hideTopRule>
              <Stack spacing={1.75}>
                <Stack spacing={0.65}>
                  <FieldLabel>Название</FieldLabel>
                  <TextField
                    size="small"
                    hiddenLabel
                    fullWidth
                    value={props.node.data.name}
                    onChange={(event) => props.onUpdateNode(props.node!.id, { name: event.target.value })}
                    sx={inputRootSx}
                  />
                </Stack>
                {"description" in props.node.data ? (
                  <Stack spacing={0.65}>
                    <FieldLabel>Описание</FieldLabel>
                    <TextField
                      size="small"
                      hiddenLabel
                      fullWidth
                      value={props.node.data.description ?? ""}
                      multiline
                      minRows={3}
                      placeholder="Необязательно"
                      onChange={(event) => props.onUpdateNode(props.node!.id, { description: event.target.value })}
                      sx={inputRootSx}
                    />
                  </Stack>
                ) : null}
                {isConditionNode ? (
                  <Typography sx={{ fontSize: 12, color: "#8E8E8E", lineHeight: 1.5 }}>
                    Первый исход — ветка «If», второй — «Else». Подписи веток редактируются на схеме.
                  </Typography>
                ) : null}
              </Stack>
            </AccordionSection>

            {hasExecutionFields ? (
              <AccordionSection title="Исполнение" defaultExpanded>
                <Stack spacing={1.75}>
                  {"role" in props.node.data ? (
                    <Stack spacing={0.65}>
                      <FieldLabel>Исполнитель / роль</FieldLabel>
                      <TextField
                        size="small"
                        hiddenLabel
                        fullWidth
                        value={props.node.data.role ?? ""}
                        placeholder="Например, руководитель группы"
                        onChange={(event) => props.onUpdateNode(props.node!.id, { role: event.target.value })}
                        sx={inputRootSx}
                      />
                    </Stack>
                  ) : null}
                  {"sla" in props.node.data ? (
                    <Stack spacing={0.65}>
                      <FieldLabel>SLA</FieldLabel>
                      <TextField
                        size="small"
                        hiddenLabel
                        fullWidth
                        value={props.node.data.sla ?? ""}
                        placeholder="Срок или условие"
                        onChange={(event) => props.onUpdateNode(props.node!.id, { sla: event.target.value })}
                        sx={inputRootSx}
                      />
                    </Stack>
                  ) : null}
                </Stack>
              </AccordionSection>
            ) : null}

            {"escalationEnabled" in props.node.data ? (
              <AccordionSection title="Расширенные">
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0.25 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#111111" }}>Эскалация</Typography>
                  <Switch
                    checked={Boolean(props.node.data.escalationEnabled)}
                    onChange={(event) => props.onUpdateNode(props.node!.id, { escalationEnabled: event.target.checked })}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": { color: "#111111" },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#111111", opacity: 1 },
                    }}
                  />
                </Stack>
              </AccordionSection>
            ) : null}
          </>
        ) : (
          <AccordionSection title="Переход" defaultExpanded hideTopRule>
            <Stack spacing={1.75}>
              <Stack spacing={0.65}>
                <FieldLabel>Подпись на схеме</FieldLabel>
                <TextField
                  size="small"
                  hiddenLabel
                  fullWidth
                  value={props.edge?.data?.label ?? ""}
                  placeholder="Например, Да / Нет"
                  onChange={(event) => props.onUpdateEdge(props.edge!.id, { label: event.target.value })}
                  sx={inputRootSx}
                />
              </Stack>
              <Stack spacing={0.65}>
                <FieldLabel>Условие перехода</FieldLabel>
                <TextField
                  size="small"
                  hiddenLabel
                  fullWidth
                  value={props.edge?.data?.condition ?? ""}
                  placeholder="Необязательно"
                  onChange={(event) => props.onUpdateEdge(props.edge!.id, { condition: event.target.value })}
                  sx={inputRootSx}
                />
              </Stack>
              <Stack spacing={0.65}>
                <FieldLabel>Комментарий</FieldLabel>
                <TextField
                  size="small"
                  hiddenLabel
                  fullWidth
                  value={props.edge?.data?.comment ?? ""}
                  placeholder="Необязательно"
                  onChange={(event) => props.onUpdateEdge(props.edge!.id, { comment: event.target.value })}
                  sx={inputRootSx}
                />
              </Stack>
            </Stack>
          </AccordionSection>
        )}

        <ValidationSummary issues={props.issues} expanded={props.showErrorsPanel} onToggle={props.onToggleErrorsPanel} />
      </Stack>
    </SlidePanel>
  );
}
