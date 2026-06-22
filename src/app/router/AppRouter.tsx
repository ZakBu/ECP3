import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../../pages/HomePage";
import ProcessBuilderEditorPage from "../../pages/ProcessBuilderEditorPage/ProcessBuilderEditorPage";
import ProcessBuilderPage from "../../pages/ProcessBuilderPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/process-builder" element={<ProcessBuilderPage />} />
      <Route path="/process-builder/:processId" element={<ProcessBuilderEditorPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

