"use client";
import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import Link from "next/link";

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  avatar?: string;
  topic?: string;
}

interface Topic {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  messageCount: number;
}

export default function ChatComponent() {
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>("general");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Topics configuration
  const topics: Topic[] = [
    {
      id: "general",
      name: t('generalTopic'),
      icon: "💬",
      color: "bg-blue-500",
      description: t('topicDescriptionGeneral'),
      messageCount: 4
    },
    {
      id: "environment",
      name: t('environmentTopic'),
      icon: "🌱",
      color: "bg-green-500",
      description: t('topicDescriptionEnvironment'),
      messageCount: 4
    },
    {
      id: "education",
      name: t('educationTopic'),
      icon: "📚",
      color: "bg-purple-500",
      description: t('topicDescriptionEducation'),
      messageCount: 3
    },
    {
      id: "health",
      name: t('healthTopic'),
      icon: "🏥",
      color: "bg-red-500",
      description: t('topicDescriptionHealth'),
      messageCount: 3
    },
    {
      id: "community",
      name: t('communityTopic'),
      icon: "🤝",
      color: "bg-orange-500",
      description: t('topicDescriptionCommunity'),
      messageCount: 4
    },
    {
      id: "oceans",
      name: t('oceansTopic'),
      icon: "🌊",
      color: "bg-cyan-500",
      description: t('topicDescriptionOceans'),
      messageCount: 3
    },
    {
      id: "food",
      name: t('foodTopic'),
      icon: "🍎",
      color: "bg-lime-500",
      description: t('topicDescriptionFood'),
      messageCount: 4
    }
  ];

  // Helper function to get translated messages
  const getTranslatedMessage = (messageKey: string) => {
    return t(messageKey as keyof typeof t) || messageKey;
  };

  // Mock messages for demonstration
  useEffect(() => {
    const mockMessages: Message[] = [
      // General messages
      {
        id: "1",
        text: getTranslatedMessage('chatMessage1'),
        sender: "Ana García",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        avatar: "🌱",
        topic: "general"
      },
      {
        id: "2", 
        text: getTranslatedMessage('chatMessage2'),
        sender: "Carlos M.",
        timestamp: new Date(Date.now() - 1000 * 60 * 25),
        avatar: "🌳",
        topic: "general"
      },
      {
        id: "3",
        text: getTranslatedMessage('chatMessage3'),
        sender: "Lisa K.",
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        avatar: "👋",
        topic: "general"
      },
      {
        id: "4",
        text: getTranslatedMessage('chatMessage4'),
        sender: "Tom R.",
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        avatar: "🏙️",
        topic: "general"
      },

      // Environment messages
      {
        id: "5",
        text: locale === 'de' ? "Ich habe letztes Jahr bei einer Baumpflanzaktion mitgemacht. Es war eine wundervolle Erfahrung!" :
              locale === 'en' ? "I participated in a tree planting event last year. It was a wonderful experience!" :
              "El año pasado participé en una plantación de árboles. ¡Fue una experiencia maravillosa!",
        sender: "Maria L.",
        timestamp: new Date(Date.now() - 1000 * 60 * 20),
        avatar: "🌿",
        topic: "environment"
      },
      {
        id: "6",
        text: locale === 'de' ? "Unser Stadtteil startet ein Recycling-Programm. Wer möchte mitmachen?" :
              locale === 'en' ? "Our neighborhood is starting a recycling program. Who wants to join?" :
              "Nuestro barrio está iniciando un programa de reciclaje. ¿Quién quiere participar?",
        sender: "Elena V.",
        timestamp: new Date(Date.now() - 1000 * 60 * 18),
        avatar: "♻️",
        topic: "environment"
      },
      {
        id: "7",
        text: locale === 'de' ? "Tipps für plastikfreies Leben? Ich versuche, meinen Verbrauch zu reduzieren." :
              locale === 'en' ? "Tips for plastic-free living? I'm trying to reduce my consumption." :
              "¿Consejos para vivir sin plástico? Estoy tratando de reducir mi consumo.",
        sender: "David S.",
        timestamp: new Date(Date.now() - 1000 * 60 * 12),
        avatar: "🚫",
        topic: "environment"
      },
      {
        id: "8",
        text: locale === 'de' ? "Solarpanels auf dem Dach installiert! 50% weniger Stromrechnung diesen Monat." :
              locale === 'en' ? "Solar panels installed on the roof! 50% less electricity bill this month." :
              "¡Paneles solares instalados en el techo! 50% menos en la factura de electricidad este mes.",
        sender: "Sophie M.",
        timestamp: new Date(Date.now() - 1000 * 60 * 8),
        avatar: "☀️",
        topic: "environment"
      },

      // Education messages
      {
        id: "9",
        text: locale === 'de' ? "Ich unterrichte Nachhaltigkeit an einer Grundschule. Materialien gesucht!" :
              locale === 'en' ? "I teach sustainability at an elementary school. Looking for materials!" :
              "Enseño sostenibilidad en una escuela primaria. ¡Busco materiales!",
        sender: "Prof. Müller",
        timestamp: new Date(Date.now() - 1000 * 60 * 35),
        avatar: "📚",
        topic: "education"
      },
      {
        id: "10",
        text: locale === 'de' ? "Online-Kurs über Klimawandel gestartet. Kostenlos für alle!" :
              locale === 'en' ? "Online course about climate change started. Free for everyone!" :
              "¡Curso en línea sobre cambio climático iniciado. ¡Gratis para todo el mundo!",
        sender: "Climate Edu",
        timestamp: new Date(Date.now() - 1000 * 60 * 28),
        avatar: "🌍",
        topic: "education"
      },
      {
        id: "11",
        text: locale === 'de' ? "Workshop für nachhaltige Landwirtschaft nächste Woche. Anmeldung offen!" :
              locale === 'en' ? "Workshop on sustainable agriculture next week. Registration open!" :
              "¡Taller de agricultura sostenible la próxima semana. ¡Inscripciones abiertas!",
        sender: "Green Academy",
        timestamp: new Date(Date.now() - 1000 * 60 * 22),
        avatar: "🌾",
        topic: "education"
      },

      // Health messages
      {
        id: "12",
        text: locale === 'de' ? "Meditation im Park jeden Sonntag. Kommt vorbei für mentale Gesundheit!" :
              locale === 'en' ? "Meditation in the park every Sunday. Come by for mental health!" :
              "¡Meditación en el parque todos los domingos. ¡Ven por salud mental!",
        sender: "Mindful Group",
        timestamp: new Date(Date.now() - 1000 * 60 * 40),
        avatar: "🧘",
        topic: "health"
      },
      {
        id: "13",
        text: locale === 'de' ? "Gemeinschaftsgarten sucht Freiwillige für Kräutergarten-Projekt." :
              locale === 'en' ? "Community garden looking for volunteers for herb garden project." :
              "Jardín comunitario busca voluntarixs para proyecto de jardín de hierbas.",
        sender: "Health Garden",
        timestamp: new Date(Date.now() - 1000 * 60 * 32),
        avatar: "🌿",
        topic: "health"
      },
      {
        id: "14",
        text: locale === 'de' ? "Yoga-Klasse im Freien startet nächsten Monat. Alle Levels willkommen!" :
              locale === 'en' ? "Outdoor yoga class starting next month. All levels welcome!" :
              "¡Clase de yoga al aire libre comienza el próximo mes. ¡Todos los niveles bienvenidos!",
        sender: "Yoga Nature",
        timestamp: new Date(Date.now() - 1000 * 60 * 16),
        avatar: "🧘‍♀️",
        topic: "health"
      },

      // Community messages
      {
        id: "15",
        text: locale === 'de' ? "Nachbarschafts-Treffen nächsten Samstag. Thema: Gemeinschaftsgärten" :
              locale === 'en' ? "Neighborhood meeting next Saturday. Topic: Community gardens" :
              "Reunión de vecinos el próximo sábado. Tema: Jardines comunitarios",
        sender: "Nachbarschaft",
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        avatar: "🏘️",
        topic: "community"
      },
      {
        id: "16",
        text: locale === 'de' ? "Wir organisieren einen Repair-Café. Wer hat Werkzeuge zu teilen?" :
              locale === 'en' ? "We're organizing a repair café. Who has tools to share?" :
              "Estamos organizando un café de reparación. ¿Quién tiene herramientas para compartir?",
        sender: "Repair Team",
        timestamp: new Date(Date.now() - 1000 * 60 * 38),
        avatar: "🔧",
        topic: "community"
      },
      {
        id: "17",
        text: locale === 'de' ? "Tauschbörse für Kleidung nächsten Sonntag. Bringt eure Sachen mit!" :
              locale === 'en' ? "Clothing swap next Sunday. Bring your stuff!" :
              "¡Intercambio de ropa el próximo domingo. ¡Trae tus cosas!",
        sender: "Swap Circle",
        timestamp: new Date(Date.now() - 1000 * 60 * 26),
        avatar: "👕",
        topic: "community"
      },
      {
        id: "18",
        text: locale === 'de' ? "Fahrrad-Werkstatt sucht Freiwillige. Mechanik-Kenntnisse erwünscht!" :
              locale === 'en' ? "Bike workshop looking for volunteers. Mechanical skills desired!" :
              "¡Taller de bicicletas busca voluntarixs. ¡Conocimientos de mecánica deseados!",
        sender: "Bike Collective",
        timestamp: new Date(Date.now() - 1000 * 60 * 14),
        avatar: "🚲",
        topic: "community"
      },

      // Oceans messages
      {
        id: "19",
        text: locale === 'de' ? "Strandreinigung nächsten Samstag. Treffpunkt: Hauptstrand 9 Uhr" :
              locale === 'en' ? "Beach cleanup next Saturday. Meeting point: Main beach 9 AM" :
              "Limpieza de playa el próximo sábado. Punto de encuentro: Playa principal 9 AM",
        sender: "Ocean Cleanup",
        timestamp: new Date(Date.now() - 1000 * 60 * 50),
        avatar: "🏖️",
        topic: "oceans"
      },
      {
        id: "20",
        text: locale === 'de' ? "Korallenriff-Schutzprojekt sucht Taucher. Erfahrung erforderlich!" :
              locale === 'en' ? "Coral reef protection project looking for divers. Experience required!" :
              "Proyecto de protección de arrecifes de coral busca buzos. ¡Experiencia requerida!",
        sender: "Reef Rescue",
        timestamp: new Date(Date.now() - 1000 * 60 * 42),
        avatar: "🐠",
        topic: "oceans"
      },
      {
        id: "21",
        text: locale === 'de' ? "Workshop über Meeresverschmutzung nächste Woche. Kostenlos!" :
              locale === 'en' ? "Workshop on ocean pollution next week. Free!" :
              "¡Taller sobre contaminación oceánica la próxima semana. ¡Gratis!",
        sender: "Ocean Edu",
        timestamp: new Date(Date.now() - 1000 * 60 * 24),
        avatar: "🌊",
        topic: "oceans"
      },

      // Food messages
      {
        id: "22",
        text: locale === 'de' ? "Gemeinschaftsgarten sucht Gärtner. Gemüse für alle!" :
              locale === 'en' ? "Community garden looking for gardeners. Vegetables for everyone!" :
              "Jardín comunitario busca jardinerxs. ¡Verduras para todo el mundo!",
        sender: "Garden Share",
        timestamp: new Date(Date.now() - 1000 * 60 * 48),
        avatar: "🥕",
        topic: "food"
      },
      {
        id: "23",
        text: locale === 'de' ? "Foodsharing-Gruppe startet in unserem Stadtteil. Mitmachen!" :
              locale === 'en' ? "Foodsharing group starting in our neighborhood. Join in!" :
              "¡Grupo de compartir comida iniciando en nuestro barrio. ¡Únete!",
        sender: "Food Share",
        timestamp: new Date(Date.now() - 1000 * 60 * 36),
        avatar: "🍎",
        topic: "food"
      },
      {
        id: "24",
        text: locale === 'de' ? "Kochkurs für nachhaltige Ernährung nächsten Freitag." :
              locale === 'en' ? "Cooking class for sustainable nutrition next Friday." :
              "Clase de cocina para nutrición sostenible el próximo viernes.",
        sender: "Green Kitchen",
        timestamp: new Date(Date.now() - 1000 * 60 * 20),
        avatar: "👨‍🍳",
        topic: "food"
      },
      {
        id: "25",
        text: locale === 'de' ? "Lokale Bauernmärkte Liste aktualisiert. Frische Produkte!" :
              locale === 'en' ? "Local farmers markets list updated. Fresh produce!" :
              "¡Lista de mercados de agricultores locales actualizada. ¡Productos frescos!",
        sender: "Farm Fresh",
        timestamp: new Date(Date.now() - 1000 * 60 * 6),
        avatar: "🌽",
        topic: "food"
      }
    ];
    setMessages(mockMessages);
    setIsConnected(true);
    
    // Set online users count after component mounts to avoid hydration mismatch
    setOnlineUsersCount(Math.floor(Math.random() * 20) + 5);
  }, [locale]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!user) {
      // Show alert to sign in
      const key = locale === 'es' ? 'pleaseSignInFirstEs' : locale === 'de' ? 'pleaseSignInFirstDe' : 'pleaseSignInFirstEn';
      alert(t(key));
      return;
    }
    
    if (newMessage.trim()) {
      const message: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text: newMessage,
        sender: user.email?.split("@")[0] || "Tú",
        timestamp: new Date(),
        avatar: "👤",
        topic: selectedTopic
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

  const filteredMessages = messages.filter(msg => msg.topic === selectedTopic);
  const currentTopic = topics.find(topic => topic.id === selectedTopic);

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
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
          <div className="flex gap-2">
          <button
            onClick={() => setShowRules(!showRules)}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            {t("chatRules")}
          </button>
            <button
              onClick={() => setShowRecommendations(!showRecommendations)}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              {t("recommendations")}
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[700px]">
        {/* Topics Sidebar */}
        <div className="w-80 bg-slate-50 dark:bg-slate-700 p-4 border-r border-slate-200 dark:border-slate-600 overflow-y-auto">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            {t("topicForums")}
            </h2>
          
          <div className="space-y-2">
            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                  selectedTopic === topic.id
                    ? `${topic.color} text-white shadow-lg`
                    : "bg-white dark:bg-slate-600 hover:bg-slate-100 dark:hover:bg-slate-500 text-slate-900 dark:text-slate-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{topic.icon}</span>
                    <div>
                      <div className="font-medium">{topic.name}</div>
                      <div className={`text-xs ${
                        selectedTopic === topic.id ? "text-white/80" : "text-slate-500 dark:text-slate-400"
                      }`}>
                        {topic.description}
              </div>
              </div>
              </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    selectedTopic === topic.id 
                      ? "bg-white/20 text-white" 
                      : "bg-slate-200 dark:bg-slate-500 text-slate-600 dark:text-slate-300"
                  }`}>
                    {topic.messageCount}
              </div>
              </div>
              </button>
            ))}
              </div>
            </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Current Topic Header */}
          <div className="bg-slate-100 dark:bg-slate-600 px-6 py-3 border-b border-slate-200 dark:border-slate-500">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{currentTopic?.icon}</span>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  {currentTopic?.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {currentTopic?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto bg-white dark:bg-slate-800">
            {filteredMessages.length === 0 ? (
              <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                <div className="text-4xl mb-4">{currentTopic?.icon}</div>
                <p className="text-lg font-medium">
                  {locale === 'de' ? `Willkommen im ${currentTopic?.name} Forum!` : 
                   locale === 'en' ? `Welcome to the ${currentTopic?.name} forum!` :
                   `¡Bienvenido al foro de ${currentTopic?.name}!`}
                </p>
                <p className="text-sm mt-2">
                  {locale === 'de' ? "Starte eine Diskussion oder beantworte Fragen." :
                   locale === 'en' ? "Start a discussion or answer questions." :
                   "Inicia una discusión o responde preguntas."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMessages.map((message) => (
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
            {!user ? (
              <div className="text-center py-4">
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  {locale === 'es' 
                    ? 'Debes iniciar sesión para participar en el chat'
                    : locale === 'de'
                    ? 'Sie müssen sich anmelden, um am Chat teilzunehmen'
                    : 'You must sign in to participate in the chat'}
                </p>
                <Link
                  href="/perfil"
                  className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  {t("signIn")}
                </Link>
              </div>
            ) : (
              <>
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
                  {t("onlineUsers")}: {onlineUsersCount} • {t("currentTopic")}: {currentTopic?.name}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Chat Rules Sidebar */}
        {showRules && (
          <div className="w-80 bg-slate-50 dark:bg-slate-700 p-6 border-l border-slate-200 dark:border-slate-600 overflow-y-auto">
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

        {/* Recommendations Sidebar */}
        {showRecommendations && (
          <div className="w-80 bg-slate-50 dark:bg-slate-700 p-6 border-l border-slate-200 dark:border-slate-600 overflow-y-auto">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              {t("recommendations")}
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  {t("popularDiscussions")}
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  {t("joinActiveConversations")}
                </p>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">
                  {t("newProjects")}
                </h3>
                <p className="text-sm text-green-700 dark:text-green-200">
                  {t("discoverLatestInitiatives")}
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                  {t("eventsNearYou")}
                </h3>
                <p className="text-sm text-purple-700 dark:text-purple-200">
                  {t("findLocalEvents")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
