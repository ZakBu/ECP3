import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import PanToolOutlinedIcon from "@mui/icons-material/PanToolOutlined";
import RedoOutlinedIcon from "@mui/icons-material/RedoOutlined";
import UndoOutlinedIcon from "@mui/icons-material/UndoOutlined";
import { Box, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Background,
  BackgroundVariant,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type EdgeTypes,
  type NodeTypes,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { figmaTokens } from "../../../../theme/figmaTokens";
import type { AddNodeRequest, EditorMode, ProcessEdge, ProcessNode } from "../../types/process-builder.types";
import { PALETTE_DRAG_MIME, type PaletteKind } from "../StepPalette/stepPalette.config";
import { ProcessEdge as ProcessEdgeComponent } from "../edges/ProcessEdge";
import { ActionNode } from "../nodes/ActionNode";
import { ApprovalNode } from "../nodes/ApprovalNode";
import { ConditionNode } from "../nodes/ConditionNode";
import { EndNode } from "../nodes/EndNode";
import { NotificationNode } from "../nodes/NotificationNode";
import { StageGroupNode } from "../nodes/StageGroupNode";
import { StartNode } from "../nodes/StartNode";

interface ProcessCanvasProps {
  mode: EditorMode;
  nodes: ProcessNode[];
  edges: ProcessEdge[];
  selectedNodeId: string | null;
  liveFocusNodeId?: string | null;
  invalidNodeIds: Set<string>;
  invalidEdgeIds: Set<string>;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onSelectionChange: (nodeId: string | null, edgeId: string | null) => void;
  onAddNode: (request: AddNodeRequest) => void;
  onUndo: () => void;
  onRedo: () => void;
  onAutoLayout: () => void;
  onDeleteSelection: () => void;
}

const nodeTypes: NodeTypes = {
  start: StartNode,
  action: ActionNode,
  approval: ApprovalNode,
  condition: ConditionNode,
  notification: NotificationNode,
  end: EndNode,
  stageGroup: StageGroupNode,
};

const edgeTypes: EdgeTypes = {
  processEdge: ProcessEdgeComponent,
};

const chrome = figmaTokens.colors.processBuilderChrome;
const canvasBg = figmaTokens.colors.canvasWorkspace;
const dotGrid = figmaTokens.canvasDotGrid;

const canvasToolButtonSx = (active: boolean, options?: { disabled?: boolean }) => ({
  width: 36,
  height: 36,
  padding: 0,
  borderRadius: "50%",
  color: options?.disabled ? figmaTokens.colors.textMuted : chrome.toolIcon,
  bgcolor: active ? chrome.toolActiveBg : "transparent",
  "&:hover": {
    bgcolor: options?.disabled ? "transparent" : active ? chrome.toolActiveBg : chrome.toolHover,
  },
});

function ProcessCanvasInner(props: ProcessCanvasProps) {
  const {
    mode,
    nodes,
    edges,
    invalidNodeIds,
    invalidEdgeIds,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onSelectionChange,
    onAddNode,
    onUndo,
    onRedo,
    onAutoLayout: _onAutoLayout,
    onDeleteSelection,
    selectedNodeId,
    liveFocusNodeId,
  } = props;
  const [quickAddAnchor, setQuickAddAnchor] = useState<HTMLElement | null>(null);
  const [quickAddPosition, setQuickAddPosition] = useState<{ left: number; top: number } | null>(null);
  const [handPan, setHandPan] = useState(false);
  const [showMiniMap, setShowMiniMap] = useState(false);
  const { screenToFlowPosition, setCenter } = useReactFlow();

  useEffect(() => {
    if (!liveFocusNodeId) return;
    const node = nodes.find((item) => item.id === liveFocusNodeId);
    if (!node) return;
    const cx = node.position.x + 125;
    const cy = node.position.y + 60;
    setCenter(cx, cy, { zoom: 0.78, duration: 700 });
  }, [liveFocusNodeId, nodes, setCenter]);

  useEffect(() => {
    if (nodes.length > 15 && !showMiniMap) {
      setShowMiniMap(true);
    }
  }, [nodes.length, showMiniMap]);

  const panOnDrag = useMemo(() => (handPan ? true : [1, 2]), [handPan]);

  const nodesWithFlags = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          _invalid: invalidNodeIds.has(node.id),
        },
      })) as ProcessNode[],
    [nodes, invalidNodeIds],
  );

  const preparedEdges = useMemo(
    () =>
      edges.map((edge) => ({
        ...edge,
        animated: edge.selected || invalidEdgeIds.has(edge.id),
        data: {
          ...(edge.data ?? {}),
          _invalid: invalidEdgeIds.has(edge.id),
        },
      })),
    [edges, invalidEdgeIds],
  );

  const onDragOver = useCallback(
    (event: React.DragEvent) => {
      if (mode !== "edit") return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    },
    [mode],
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      if (mode !== "edit") return;
      event.preventDefault();
      const raw = event.dataTransfer.getData(PALETTE_DRAG_MIME);
      if (!raw) return;
      const kind = raw as PaletteKind;
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      onAddNode({ kind, position, sourceNodeId: undefined });
    },
    [mode, onAddNode, screenToFlowPosition],
  );

  return (
    <Box
      sx={{ position: "relative", height: "100%", flex: 1, minWidth: 0, overflow: "hidden", bgcolor: "transparent" }}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodesWithFlags as never}
        edges={preparedEdges as never}
        nodeTypes={nodeTypes as never}
        edgeTypes={edgeTypes as never}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        fitViewOptions={{ padding: 0.06 }}
        deleteKeyCode={null}
        nodesDraggable={mode === "edit"}
        nodesConnectable={mode === "edit"}
        elementsSelectable
        zoomOnPinch
        panOnScroll
        panOnDrag={panOnDrag}
        selectionOnDrag={mode === "edit" && !handPan}
        onNodeClick={(_, node) => onSelectionChange(node.id, null)}
        onNodeContextMenu={(event, node) => {
          if (mode !== "edit") return;
          event.preventDefault();
          onSelectionChange(node.id, null);
          setQuickAddPosition({ left: event.clientX, top: event.clientY });
          setQuickAddAnchor(event.currentTarget as HTMLElement);
        }}
        onEdgeClick={(_, edge) => onSelectionChange(null, edge.id)}
        onPaneClick={() => onSelectionChange(null, null)}
        style={{ background: canvasBg }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          id="process-builder-dots"
          variant={BackgroundVariant.Dots}
          gap={dotGrid.stepPx}
          size={dotGrid.reactFlowPatternSize}
          color={dotGrid.dotColor}
        />
        {showMiniMap ? (
          <MiniMap
            position="bottom-right"
            pannable
            zoomable
            nodeColor={() => "#B8C3D2"}
            maskColor="rgba(250,249,253,0.5)"
            style={{ background: "rgba(250,249,253,0.55)", border: "none", boxShadow: "none" }}
          />
        ) : null}
      </ReactFlow>

      <Box
        role="toolbar"
        aria-label="Управление холстом"
        sx={{
          position: "absolute",
          left: "50%",
          bottom: 20,
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 0.25,
          px: 0.75,
          py: 0.5,
          bgcolor: chrome.toolbarBg,
          border: chrome.toolbarBorder,
          borderRadius: 9999,
          boxShadow: chrome.toolbarShadow,
          zIndex: 10,
        }}
      >
        <Tooltip title="Панорама">
          <IconButton
            size="small"
            onClick={() => setHandPan(true)}
            aria-pressed={handPan}
            sx={canvasToolButtonSx(handPan)}
          >
            <PanToolOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Курсор">
          <span>
            <IconButton
              size="small"
              onClick={() => setHandPan(false)}
              disabled={mode !== "edit"}
              aria-pressed={mode === "edit" && !handPan}
              sx={canvasToolButtonSx(mode === "edit" && !handPan, { disabled: mode !== "edit" })}
            >
              <NearMeOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Отменить">
          <span>
            <IconButton
              size="small"
              onClick={onUndo}
              disabled={mode !== "edit"}
              sx={canvasToolButtonSx(false, { disabled: mode !== "edit" })}
            >
              <UndoOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Повторить">
          <span>
            <IconButton
              size="small"
              onClick={onRedo}
              disabled={mode !== "edit"}
              sx={canvasToolButtonSx(false, { disabled: mode !== "edit" })}
            >
              <RedoOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <Menu
        anchorEl={quickAddPosition ? null : quickAddAnchor}
        anchorReference={quickAddPosition ? "anchorPosition" : "anchorEl"}
        anchorPosition={quickAddPosition ? { top: quickAddPosition.top, left: quickAddPosition.left } : undefined}
        open={Boolean(quickAddAnchor)}
        onClose={() => {
          setQuickAddAnchor(null);
          setQuickAddPosition(null);
        }}
      >
        <MenuItem
          onClick={() => {
            onAddNode({ kind: "action", sourceNodeId: selectedNodeId ?? undefined });
            setQuickAddAnchor(null);
          }}
        >
          Добавить действие
        </MenuItem>
        <MenuItem
          onClick={() => {
            onAddNode({ kind: "approval", sourceNodeId: selectedNodeId ?? undefined });
            setQuickAddAnchor(null);
          }}
        >
          Добавить согласование
        </MenuItem>
        <MenuItem
          onClick={() => {
            onAddNode({ kind: "condition", sourceNodeId: selectedNodeId ?? undefined });
            setQuickAddAnchor(null);
          }}
        >
          Добавить условие
        </MenuItem>
        <MenuItem
          onClick={() => {
            onAddNode({ kind: "end", sourceNodeId: selectedNodeId ?? undefined });
            setQuickAddAnchor(null);
          }}
        >
          Добавить завершение
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDeleteSelection();
            setQuickAddAnchor(null);
            setQuickAddPosition(null);
          }}
          sx={{ color: figmaTokens.colors.danger }}
        >
          Удалить выбранный элемент
        </MenuItem>
      </Menu>
    </Box>
  );
}

export function ProcessCanvas(props: ProcessCanvasProps) {
  return (
    <ReactFlowProvider>
      <Box sx={{ height: "100%", width: "100%", minHeight: 400 }}>
        <ProcessCanvasInner {...props} />
      </Box>
    </ReactFlowProvider>
  );
}
