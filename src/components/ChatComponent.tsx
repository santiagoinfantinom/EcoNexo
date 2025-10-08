"use client";
import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  avatar?: string;
}

export default function ChatComponent() {
  const { t, locale } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [showRules, setShowRules] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock messages for demonstration
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: "1",
        text: locale === 'de' ? "Hallo! Ich bin neu hier und möchte mehr über nachhaltige Projekte erfahren." : 
              locale === 'en' ? "Hello! I'm new here and would like to learn more about sustainable projects." :
              "¡Hola! Soy nuevo aquí y me gustaría aprender más sobre proyectos sostenibles.",
        sender: "Ana García",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        avatar: "🌱"
      },
      {
        id: "2", 
        text: locale === 'de' ? "Willkommen! Wir haben hier viele tolle Projekte. Hast du schon mal bei einem Umweltprojekt mitgemacht?" :
              locale === 'en' ? "Welcome! We have many great projects here. Have you ever participated in an environmental project?" :
              "¡Bienvenida! Tenemos muchos proyectos geniales aquí. ¿Has participado alguna vez en un proyecto ambiental?",
        sender: "Carlos M.",
        timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
        avatar: "🌳"
      },
      {
        id: "3",
        text: locale === 'de' ? "Ich habe letztes Jahr bei einer Baumpflanzaktion mitgemacht. Es war eine wundervolle Erfahrung!" :
              locale === 'en' ? "I participated in a tree planting event last year. It was a wonderful experience!" :
              "El año pasado participé en una plantación de árboles. ¡Fue una experiencia maravillosa!",
        sender: "Maria L.",
        timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
        avatar: "🌿"
      }
    ];
    setMessages(mockMessages);
    setIsConnected(true);
  }, [locale]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: "Tú", // This would be the actual user name
        timestamp: new Date(),
        avatar: "👤"
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(locale === 'de' ? 'de-DE' : locale === 'en' ? 'en-US' : 'es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t("communityChat")}</h1>
            <p className="text-green-100 text-sm">
              {isConnected ? 
                (locale === 'de' ? "Verbunden" : locale === 'en' ? "Connected" : "Conectado") : 
                (locale === 'de' ? "Verbindung..." : locale === 'en' ? "Connecting..." : "Conectando...")
              }
            </p>
          </div>
          <button
            onClick={() => setShowRules(!showRules)}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            {t("chatRules")}
          </button>
        </div>
      </div>

      <div className="flex h-[600px]">
        {/* Chat Rules Sidebar */}
        {showRules && (
          <div className="w-80 bg-slate-50 dark:bg-slate-700 p-6 border-r border-slate-200 dark:border-slate-600 overflow-y-auto">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              {t("chatRulesTitle")}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              {t("chatRulesIntro")}
            </p>
            
            <div className="space-y-4">
              <div className="text-sm text-slate-700 dark:text-slate-200">
                {t("chatRule1")}
              </div>
              <div className="text-sm text-slate-700 dark:text-slate-200">
                {t("chatRule2")}
              </div>
              <div className="text-sm text-slate-700 dark:text-slate-200">
                {t("chatRule3")}
              </div>
              <div className="text-sm text-slate-700 dark:text-slate-200">
                {t("chatRule4")}
              </div>
              <div className="text-sm text-slate-700 dark:text-slate-200">
                {t("chatRule5")}
              </div>
              <div className="text-sm text-slate-700 dark:text-slate-200">
                {t("chatRule6")}
              </div>
              <div className="text-sm text-slate-700 dark:text-slate-200">
                {t("chatRule7")}
              </div>
              <div className="text-sm text-slate-700 dark:text-slate-200">
                {t("chatRule8")}
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                {t("chatRulesFooter")}
              </p>
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto bg-white dark:bg-slate-800">
            {messages.length === 0 ? (
              <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                <div className="text-4xl mb-4">🌿</div>
                <p className="text-lg font-medium">{t("welcomeMessage")}</p>
                <p className="text-sm mt-2">{t("joinConversation")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "Tú" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex max-w-[80%] ${message.sender === "Tú" ? "flex-row-reverse" : "flex-row"}`}>
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                        message.sender === "Tú" 
                          ? "bg-green-500 text-white ml-3" 
                          : "bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 mr-3"
                      }`}>
                        {message.avatar}
                      </div>
                      <div className={`flex flex-col ${message.sender === "Tú" ? "items-end" : "items-start"}`}>
                        <div className={`px-4 py-2 rounded-lg ${
                          message.sender === "Tú"
                            ? "bg-green-500 text-white"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        }`}>
                          <p className="text-sm">{message.text}</p>
                        </div>
                        <div className="flex items-center mt-1 space-x-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-medium">{message.sender}</span>
                          <span>•</span>
                          <span>{formatTime(message.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="border-t border-slate-200 dark:border-slate-600 p-4 bg-slate-50 dark:bg-slate-700">
            <div className="flex space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t("typeMessage")}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-600 dark:text-slate-100"
                disabled={!isConnected}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !isConnected}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {t("sendMessage")}
              </button>
            </div>
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 text-center">
              {t("onlineUsers")}: {Math.floor(Math.random() * 20) + 5}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
