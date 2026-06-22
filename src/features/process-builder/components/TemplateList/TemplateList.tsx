import { Button, Paper, Stack, Typography } from "@mui/material";
import { figmaTokens } from "../../../../theme/figmaTokens";
import type { TemplateProcess } from "../../types/process-builder.types";

interface TemplateListProps {
  templates: TemplateProcess[];
  onCreateFromTemplate: (templateId: string) => void;
}

export function TemplateList({ templates, onCreateFromTemplate }: TemplateListProps) {
  if (templates.length === 0) {
    return (
      <Paper sx={{ p: 2, textAlign: "center" }}>
        <Typography sx={{ fontSize: 14, color: figmaTokens.colors.textSecondary }}>Шаблоны не найдены</Typography>
      </Paper>
    );
  }
  return (
    <Stack spacing={1}>
      {templates.map((template) => (
        <Paper key={template.id} sx={{ p: 1.4, border: `1px solid ${figmaTokens.colors.outline}`, borderRadius: 2 }}>
          <Stack spacing={0.8}>
            <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{template.title}</Typography>
            <Typography sx={{ fontSize: 12, color: figmaTokens.colors.textSecondary }}>{template.description}</Typography>
            <Button size="small" variant="outlined" onClick={() => onCreateFromTemplate(template.id)} sx={{ alignSelf: "flex-start" }}>
              Использовать шаблон
            </Button>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}

