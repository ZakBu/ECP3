import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useProcessBuilderStore } from "../process-builder/store/processBuilder.store";
import "./FloatingAiAssistant.css";

type Message = {
  role: "bot" | "user" | "system";
  text: string;
};

const quickQuestions = [
  "Как согласовать ГПЗУ?",
  "Статус моих задач",
  "Новые регламенты",
];

const botResponses: Record<string, string> = {
  гпзу:
    "Для согласования ГПЗУ подайте заявление через ИАС ОГД. Срок рассмотрения - 20 рабочих дней согласно регламенту ДГА.",
  задач:
    "У вас сейчас: 4 новые, 12 в работе, 3 просроченные. Хотите открыть полный список?",
  регламент:
    "Обновлен регламент согласования ГПЗУ - сроки сокращены до 15 дней. Документ доступен в нормативной базе.",
  сотрудник:
    "Введите имя или отдел в справочнике сотрудников - там 128 специалистов по 5 отделам.",
};

function getBotReply(question: string): string {
  const normalized = question.toLowerCase();
  const key = Object.keys(botResponses).find((token) =>
    normalized.includes(token),
  );

  return key
    ? botResponses[key]
    : "Обрабатываю запрос... Рекомендую обратиться к разделу Нормативная база или найти нужный отдел в справочнике.";
}

function BotIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="7" width="16" height="12" rx="3" />
      <circle cx="9" cy="13" r="1.2" />
      <circle cx="15" cy="13" r="1.2" />
      <path d="M12 4v3" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 11.5L21 3l-8.5 18-1.8-7.7L3 11.5z" />
    </svg>
  );
}

export default function FloatingAiAssistant() {
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const generateDemoFlowFromAttachmentLive = useProcessBuilderStore((state) => state.generateDemoFlowFromAttachmentLive);
  const [opened, setOpened] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Привет! Я ИИ-ассистент ЕЦП ГД. Задайте вопрос о задачах, документах или регламентах.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [busyBuilding, setBusyBuilding] = useState(false);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, typing, opened]);

  const hasUserMessages = useMemo(
    () => messages.some((message) => message.role === "user"),
    [messages],
  );
  const inProcessEditor = /^\/process-builder\/[^/]+/.test(location.pathname);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);

    window.setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: getBotReply(trimmed) }]);
      setTyping(false);
    }, 400);
  };

  const handleAttachFile = async (file?: File | null) => {
    if (!file) return;
    setBusyBuilding(true);

    setMessages((prev) => [
      ...prev,
      { role: "user", text: `Прикрепил файл: ${file.name}` },
      { role: "system", text: "Анализирую содержимое вложения..." },
    ]);
    setOpened(true);

    await new Promise((resolve) => window.setTimeout(resolve, 2200));
    setMessages((prev) => [...prev, { role: "system", text: "Выделяю ключевые этапы, роли и точки контроля..." }]);

    await new Promise((resolve) => window.setTimeout(resolve, 2100));
    setMessages((prev) => [
      ...prev,
      {
        role: "system",
        text: "Формирую граф зависимостей и запускаю поэтапное построение на холсте...",
      },
    ]);

    await generateDemoFlowFromAttachmentLive(file.name);
    setBusyBuilding(false);
    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        text:
          "Готово. Сформировал усложненный процесс из 12 блоков: регистрация и валидация входа, развилка по приоритету, ускоренный контур с согласованием руководителя, стандартный контур с оценкой рисков и проверкой безопасности, затем объединение потоков в юридическом согласовании, уведомление и завершение.",
      },
    ]);
  };

  return (
    <div className="floating-ai-assistant">
      {opened ? (
        <section className="floating-ai-panel" aria-label="ИИ-ассистент">
          <header className="floating-ai-header">
            <div className="floating-ai-header-icon">
              <BotIcon />
            </div>
            <div>
              <p className="floating-ai-title">AI-ассистент</p>
              <p className="floating-ai-subtitle">Задайте вопрос ИИ</p>
            </div>
            <button
              type="button"
              className="floating-ai-close"
              onClick={() => setOpened(false)}
              aria-label="Закрыть чат"
            >
              ×
            </button>
          </header>

          {!hasUserMessages ? (
            <div className="floating-ai-quick-list">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  className="floating-ai-quick-item"
                  onClick={() => sendMessage(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          ) : null}

          <div className="floating-ai-messages" ref={messagesRef}>
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`floating-ai-message ${
                  message.role === "user" ? "is-user" : message.role === "system" ? "is-system" : "is-bot"
                }`}
              >
                {message.text}
              </div>
            ))}
            {typing ? <div className="floating-ai-message is-bot">Печатаю...</div> : null}
          </div>

          <footer className="floating-ai-input-row">
            {inProcessEditor ? (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="floating-ai-file-native"
                  onChange={(event) => {
                    void handleAttachFile(event.target.files?.[0]);
                    event.currentTarget.value = "";
                  }}
                />
                <button
                  type="button"
                  className="floating-ai-attach"
                  disabled={busyBuilding}
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Прикрепить файл для генерации схемы"
                >
                  📎
                </button>
              </>
            ) : null}
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  sendMessage(input);
                }
              }}
              placeholder="Задать вопрос..."
              aria-label="Поле ввода сообщения"
            />
            <button
              type="button"
              className="floating-ai-send"
              onClick={() => sendMessage(input)}
              aria-label="Отправить сообщение"
            >
              <SendIcon />
            </button>
          </footer>
        </section>
      ) : null}

      <button
        type="button"
        className="floating-ai-trigger"
        aria-label="Открыть ИИ-ассистента"
        onClick={() => setOpened((prev) => !prev)}
      >
        <BotIcon />
      </button>
    </div>
  );
}
