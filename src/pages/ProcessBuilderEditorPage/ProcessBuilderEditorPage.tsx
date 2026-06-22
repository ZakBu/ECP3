import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProcessBuilderScreen } from "../../features/process-builder/components/ProcessBuilderScreen/ProcessBuilderScreen";
import { useProcessBuilderStore } from "../../features/process-builder/store/processBuilder.store";
import { figmaTokens } from "../../theme/figmaTokens";

export default function ProcessBuilderEditorPage() {
  const { processId } = useParams<{ processId: string }>();
  const navigate = useNavigate();
  const handledNewRef = useRef(false);

  const processes = useProcessBuilderStore((state) => state.processes);
  const activeProcessId = useProcessBuilderStore((state) => state.activeProcessId);
  const selectProcess = useProcessBuilderStore((state) => state.selectProcess);
  const createProcess = useProcessBuilderStore((state) => state.createProcess);

  useEffect(() => {
    if (!processId) return;

    if (processId === "new") {
      if (handledNewRef.current) return;
      handledNewRef.current = true;
      createProcess();
      const createdId = useProcessBuilderStore.getState().activeProcessId;
      if (createdId) navigate(`/process-builder/${createdId}`, { replace: true });
      return;
    }

    const exists = processes.some((process) => process.id === processId);
    if (!exists) {
      navigate("/process-builder", { replace: true });
      return;
    }

    if (activeProcessId !== processId) {
      selectProcess(processId);
    }
  }, [activeProcessId, createProcess, navigate, processId, processes, selectProcess]);

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1300,
        bgcolor: figmaTokens.colors.canvasWorkspace,
      }}
    >
      <ProcessBuilderScreen />
    </Box>
  );
}
