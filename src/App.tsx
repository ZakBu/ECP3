import { AppRouter } from "./app/router/AppRouter";
import FloatingAiAssistant from "./features/ai-assistant/FloatingAiAssistant";

function App() {
  return (
    <>
      <AppRouter />
      <FloatingAiAssistant />
    </>
  );
}

export default App;
