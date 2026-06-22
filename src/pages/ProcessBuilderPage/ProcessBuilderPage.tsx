import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Box, Button, InputBase, Paper, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProcessCard } from "../../features/process-builder/components/ProcessCard/ProcessCard";
import { useProcessBuilderStore } from "../../features/process-builder/store/processBuilder.store";
import { figmaTokens } from "../../theme/figmaTokens";
import LeftNav from "../HomePage/components/LeftNav";
import TopBar from "../HomePage/components/TopBar";

type ListTab = "drafts" | "published" | "templates";

export default function ProcessBuilderPage() {
  const navigate = useNavigate();
  const processes = useProcessBuilderStore((state) => state.processes);
  const templates = useProcessBuilderStore((state) => state.templates);
  const selectProcess = useProcessBuilderStore((state) => state.selectProcess);
  const createFromTemplate = useProcessBuilderStore((state) => state.createFromTemplate);
  const [tab, setTab] = useState<ListTab>("drafts");
  const [search, setSearch] = useState("");

  const filteredProcesses = useMemo(() => {
    const term = search.trim().toLowerCase();
    const matchesSearch = (p: (typeof processes)[number]) =>
      term.length === 0 ||
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.owner.toLowerCase().includes(term);

    const active = processes.filter((p) => p.status !== "archived");

    if (tab === "drafts") {
      return active
        .filter((p) => p.status === "draft" || p.status === "validationError")
        .filter(matchesSearch);
    }
    if (tab === "published") {
      return active.filter((p) => p.status === "published").filter(matchesSearch);
    }
    return [];
  }, [processes, search, tab]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: figmaTokens.colors.appBg, width: "100vw", display: "block" }}>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          minHeight: "100vh",
          borderRadius: 0,
          overflow: "hidden",
          border: "none",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "380px minmax(0,1fr)",
          },
          bgcolor: figmaTokens.colors.pageBg,
        }}
      >
        <LeftNav />
        <Box sx={{ p: 0, bgcolor: figmaTokens.colors.pageBg, minWidth: 0 }}>
          <TopBar isEditing={false} onEnterEdit={() => undefined} />
          <Box sx={{ p: 3, minWidth: 0, maxWidth: 1240, mx: "auto" }}>
            <Stack spacing={2}>
              <Stack spacing={1} alignItems="center" sx={{ py: 3 }}>
                <Typography sx={{ fontSize: 22, fontWeight: 700, color: figmaTokens.colors.textPrimary }}>
                  Конструктор бизнес-процессов
                </Typography>
                <Typography sx={{ fontSize: 14, color: figmaTokens.colors.textSecondary, textAlign: "center", maxWidth: 520 }}>
                  Моделируйте сценарии и управляйте процессами портала.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate("/process-builder/new")}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "999px",
                    px: 2.3,
                    minHeight: 40,
                  }}
                >
                  Создать
                </Button>
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
                <Tabs
                  value={tab}
                  onChange={(_, value: ListTab) => setTab(value)}
                  sx={{
                    minHeight: 32,
                    "& .MuiTab-root": { minHeight: 32, textTransform: "none", fontSize: 13, fontWeight: 500, px: 1.2 },
                  }}
                >
                  <Tab value="drafts" label="Черновики" />
                  <Tab value="published" label="В проде" />
                  <Tab value="templates" label="Шаблоны" />
                </Tabs>
                {tab === "drafts" || tab === "published" ? (
                  <Paper
                    elevation={0}
                    sx={{
                      px: 1.2,
                      py: 0.4,
                      display: "flex",
                      alignItems: "center",
                      border: `1px solid ${figmaTokens.colors.outline}`,
                      borderRadius: "999px",
                      bgcolor: figmaTokens.colors.surfaceLow,
                      minWidth: 280,
                    }}
                  >
                    <SearchOutlinedIcon sx={{ fontSize: 18, color: figmaTokens.colors.textMuted }} />
                    <InputBase
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Поиск процесса"
                      sx={{ fontSize: 13, ml: 1, width: "100%" }}
                    />
                  </Paper>
                ) : null}
              </Stack>

              {tab === "templates" ? (
                templates.length === 0 ? (
                  <Typography sx={{ fontSize: 14, color: figmaTokens.colors.textSecondary, textAlign: "center", py: 4 }}>
                    Шаблоны пока не добавлены.
                  </Typography>
                ) : (
                  <Box
                    sx={{
                      display: "grid",
                      gap: 1.2,
                      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    }}
                  >
                    {templates.map((template) => (
                      <Paper
                        key={template.id}
                        elevation={0}
                        sx={{ p: 2, borderRadius: 2, border: `1px solid ${figmaTokens.colors.outline}`, bgcolor: figmaTokens.colors.surfaceLow }}
                      >
                        <Stack spacing={0.8}>
                          <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{template.title}</Typography>
                          <Typography sx={{ fontSize: 12, color: figmaTokens.colors.textSecondary }}>{template.description}</Typography>
                          <Button size="small" variant="outlined" onClick={() => createFromTemplate(template.id)} sx={{ alignSelf: "flex-start" }}>
                            Использовать шаблон
                          </Button>
                        </Stack>
                      </Paper>
                    ))}
                  </Box>
                )
              ) : filteredProcesses.length === 0 ? (
                <Typography sx={{ fontSize: 14, color: figmaTokens.colors.textSecondary, textAlign: "center", py: 4 }}>
                  {tab === "published"
                    ? "Пока нет процессов в проде. Опубликуйте черновик, чтобы он появился здесь."
                    : "Пока нет черновиков. Нажмите «Создать»."}
                </Typography>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gap: 1.2,
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  }}
                >
                  {filteredProcesses.map((process) => (
                    <ProcessCard
                      key={process.id}
                      process={process}
                      selected={false}
                      onClick={() => {
                        selectProcess(process.id);
                        navigate(`/process-builder/${process.id}`);
                      }}
                    />
                  ))}
                </Box>
              )}
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

