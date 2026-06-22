import { useEffect, useMemo, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Snackbar, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { useBeforeUnload } from "react-router-dom";
import { figmaTokens } from "../../../../theme/figmaTokens";
import { useProcessBuilder } from "../../hooks/useProcessBuilder";
import { useProcessHotkeys } from "../../hooks/useProcessHotkeys";
import { ErrorCenter } from "../ErrorCenter/ErrorCenter";
import { EmptyCanvasState } from "../EmptyCanvasState/EmptyCanvasState";
import { InspectorPanel } from "../InspectorPanel/InspectorPanel";
import { ProcessCanvas } from "../ProcessCanvas/ProcessCanvas";
import { ProcessToolbar } from "../ProcessToolbar/ProcessToolbar";
import { StepPalette } from "../StepPalette/StepPalette";
import type { PaletteKind } from "../StepPalette/stepPalette.config";

export function ProcessBuilderScreen() {
  const navigate = useNavigate();
  const pb = useProcessBuilder();
  const [confirmDeleteNode, setConfirmDeleteNode] = useState(false);
  const [confirmDeleteProcess, setConfirmDeleteProcess] = useState(false);
  const [confirmPublish, setConfirmPublish] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const tooNarrow = useMediaQuery("(max-width:1199.95px)");

  const selectedNode = useMemo(
    () => pb.activeProcess?.nodes.find((node) => node.id === pb.selectedNodeId) ?? null,
    [pb.activeProcess, pb.selectedNodeId],
  );
  const selectedEdge = useMemo(
    () => pb.activeProcess?.edges.find((edge) => edge.id === pb.selectedEdgeId) ?? null,
    [pb.activeProcess, pb.selectedEdgeId],
  );

  const invalidNodeIds = useMemo(() => {
    const ids = new Set<string>();
    for (const issue of pb.validationIssues) {
      if (issue.level === "error" && issue.nodeId) ids.add(issue.nodeId);
    }
    return ids;
  }, [pb.validationIssues]);

  const invalidEdgeIds = useMemo(() => {
    const ids = new Set<string>();
    for (const issue of pb.validationIssues) {
      if (issue.level === "error" && issue.edgeId) ids.add(issue.edgeId);
    }
    return ids;
  }, [pb.validationIssues]);

  useBeforeUnload((event) => {
    if (pb.unsaved) {
      event.preventDefault();
    }
  });

  useProcessHotkeys({
    onDelete: () => {
      if (pb.selectedNodeId || pb.selectedEdgeId) setConfirmDeleteNode(true);
    },
    onSave: () => void pb.save(),
    onUndo: pb.undo,
    onRedo: pb.redo,
    onClearSelection: () => pb.setSelection(null, null),
  });

  useEffect(() => {
    if (!pb.activeProcessId && pb.processes.length > 0) {
      pb.selectProcess(pb.processes[0].id);
    }
  }, [pb]);

  useEffect(() => {
    if (!pb.unsaved || pb.mode !== "edit") return;
    const timer = window.setTimeout(() => {
      void pb.save();
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [pb.unsaved, pb.mode, pb.save]);

  useEffect(() => {
    if (pb.publishState.state === "blocked") {
      pb.setErrorsPanel(true);
    }
  }, [pb.publishState.state, pb]);

  if (tooNarrow) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          bgcolor: figmaTokens.colors.pageBg,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            maxWidth: 440,
            p: 3,
            borderRadius: 2,
            border: `1px solid ${figmaTokens.colors.outline}`,
            bgcolor: figmaTokens.colors.surfaceLow,
          }}
        >
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: figmaTokens.colors.textPrimary, mb: 1 }}>
            Конструктор доступен в desktop-версии
          </Typography>
          <Typography sx={{ fontSize: 14, color: figmaTokens.colors.textSecondary, lineHeight: 1.5 }}>
            Для редактирования процессов откройте портал на экране от 1280px или увеличьте окно браузера.
          </Typography>
        </Paper>
      </Box>
    );
  }

  const addFromPalette = (kind: PaletteKind) => {
    pb.addNode({ kind, sourceNodeId: pb.selectedNodeId ?? undefined });
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          bgcolor: figmaTokens.colors.canvasWorkspace,
          height: "100vh",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {pb.activeProcess ? (
          <>
            {/* Холст на весь экран: сетка до верхнего и левого края в отступах вокруг плавающих панелей */}
            <Box sx={{ position: "absolute", inset: 0, zIndex: 0 }}>
              <ProcessCanvas
                mode={pb.mode}
                nodes={pb.activeProcess.nodes}
                edges={pb.activeProcess.edges}
                selectedNodeId={pb.selectedNodeId}
                liveFocusNodeId={pb.liveFocusNodeId}
                invalidNodeIds={invalidNodeIds}
                invalidEdgeIds={invalidEdgeIds}
                onNodesChange={pb.applyNodeChanges}
                onEdgesChange={pb.applyEdgeChanges}
                onConnect={pb.connect}
                onSelectionChange={pb.setSelection}
                onAddNode={pb.addNode}
                onUndo={pb.undo}
                onRedo={pb.redo}
                onAutoLayout={pb.autoArrange}
                onDeleteSelection={pb.deleteSelection}
              />
            </Box>
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                pointerEvents: "none",
              }}
            >
              <Box sx={{ flexShrink: 0, pointerEvents: "auto" }}>
                <ProcessToolbar
                  process={pb.activeProcess}
                  mode={pb.mode}
                  issues={pb.validationIssues}
                  unsaved={pb.unsaved}
                  saveState={pb.saveState}
                  onBack={() => navigate("/process-builder")}
                  onSetMode={pb.setMode}
                  onRenameProcess={pb.renameActiveProcess}
                  onSave={() => void pb.save()}
                  onValidate={() => {
                    pb.validate();
                    pb.setErrorsPanel(true);
                  }}
                  onPublish={() => setConfirmPublish(true)}
                  onDuplicate={pb.duplicateActive}
                  onArchive={pb.archiveActive}
                  onDelete={() => setConfirmDeleteProcess(true)}
                  onAutoLayout={pb.autoArrange}
                  onHelp={() => setHelpOpen(true)}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flex: 1,
                  minHeight: 0,
                  minWidth: 0,
                  position: "relative",
                  pointerEvents: "none",
                }}
              >
                <StepPalette mode={pb.mode} onAddStep={addFromPalette} />
                <Box sx={{ flex: 1, minWidth: 0, minHeight: 0, pointerEvents: "none" }} aria-hidden />
                <InspectorPanel
                  node={selectedNode}
                  edge={selectedEdge}
                  issues={pb.validationIssues}
                  showErrorsPanel={pb.showErrorsPanel}
                  onUpdateNode={(id, patch) => {
                    if (id) pb.updateNodeData(id, patch);
                  }}
                  onUpdateEdge={pb.updateEdgeData}
                  onToggleErrorsPanel={pb.toggleErrorsPanel}
                  onClose={() => pb.setSelection(null, null)}
                />
                <ErrorCenter
                  open={pb.showErrorsPanel}
                  issues={pb.validationIssues}
                  onClose={() => pb.setErrorsPanel(false)}
                  onSelectIssue={(issue) => {
                    if (issue.nodeId) pb.setSelection(issue.nodeId, null);
                    if (issue.edgeId) pb.setSelection(null, issue.edgeId);
                    pb.setErrorsPanel(false);
                  }}
                />
              </Box>
            </Box>
          </>
        ) : (
          <Box sx={{ flex: 1, p: 3, display: "flex", flexDirection: "column", minHeight: 0 }}>
            <EmptyCanvasState onCreate={pb.createProcess} onOpenTemplates={() => navigate("/process-builder")} />
          </Box>
        )}
      </Box>

      <Dialog open={confirmDeleteNode} onClose={() => setConfirmDeleteNode(false)}>
        <DialogTitle>Удалить выбранный элемент?</DialogTitle>
        <DialogContent>Элемент будет удалён из текущего черновика процесса.</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteNode(false)}>Отмена</Button>
          <Button
            color="error"
            onClick={() => {
              pb.deleteSelection();
              setConfirmDeleteNode(false);
            }}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDeleteProcess} onClose={() => setConfirmDeleteProcess(false)}>
        <DialogTitle>Удалить процесс?</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 14 }}>Процесс будет удалён из mock-хранилища. Действие необратимо в этой сессии.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteProcess(false)}>Отмена</Button>
          <Button
            color="error"
            onClick={() => {
              if (pb.activeProcessId) pb.deleteProcess(pb.activeProcessId);
              navigate("/process-builder");
              setConfirmDeleteProcess(false);
            }}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmPublish} onClose={() => setConfirmPublish(false)}>
        <DialogTitle>Опубликовать процесс?</DialogTitle>
        <DialogContent>Перед публикацией будет выполнена проверка. При наличии ошибок публикация будет заблокирована.</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmPublish(false)}>Отмена</Button>
          <Button
            variant="contained"
            onClick={async () => {
              await pb.publish();
              setConfirmPublish(false);
            }}
          >
            Опубликовать
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={helpOpen} onClose={() => setHelpOpen(false)} aria-labelledby="process-builder-help-title">
        <DialogTitle id="process-builder-help-title">Справка</DialogTitle>
        <DialogContent>
          <Typography
            component="ul"
            sx={{
              pl: 2.5,
              m: 0,
              fontSize: 14,
              color: figmaTokens.colors.textSecondary,
              lineHeight: 1.7,
              "& kbd": {
                fontSize: 12,
                px: 0.6,
                py: 0.15,
                borderRadius: 0.5,
                bgcolor: figmaTokens.colors.surfaceVariant,
                border: `1px solid ${figmaTokens.colors.outline}`,
                fontFamily: "ui-monospace, monospace",
              },
            }}
          >
            <li>
              <kbd>Ctrl</kbd> + <kbd>S</kbd> / <kbd>⌘</kbd> + <kbd>S</kbd> — сохранить черновик
            </li>
            <li>
              <kbd>Ctrl</kbd> + <kbd>Z</kbd> / <kbd>⌘</kbd> + <kbd>Z</kbd> — отменить действие
            </li>
            <li>
              <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd> / <kbd>⌘</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd> — повторить
            </li>
            <li>
              <kbd>Delete</kbd> или <kbd>Backspace</kbd> — удалить выбранный узел или связь
            </li>
            <li>
              <kbd>Esc</kbd> — снять выделение
            </li>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpOpen(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={Boolean(pb.toastMessage)} autoHideDuration={3500} message={pb.toastMessage ?? ""} onClose={pb.clearToast} />
    </>
  );
}
