[English](README.md) | [Español](README.es.md) | [Deutsch](README.de.md)

# 🌿 EcoNexo - Plattform für nachhaltige Gemeinschaften

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000)](https://vercel.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-7.4.3-119EFF)](https://capacitorjs.com/)

🌍 **EcoNexo ist jetzt in Produktion:** https://econexo.app

EcoNexo ist eine umfassende Plattform, die nachhaltige Gemeinschaften verbindet, die Teilnahme an ökologischen Veranstaltungen erleichtert und grüne Jobs fördert. Unsere Mission ist es, ein digitales Ökosystem zu schaffen, das kollektives Umweltengagement in ganz Europa vorantreibt.

## 🚀 Aktueller Status: BEREIT FÜR DEPLOYMENT ✅

### ✅ **Implementierte Funktionen**
- 🌐 **Vollständige Web-App** mit Next.js 15.5.4
- 📱 **Installierbare PWA** mit Service Worker
- 📱 **Native mobile App** mit Capacitor (Android/iOS)
- 🔌 **REST-APIs** funktionieren mit Fallbacks
- 🌍 **Vollständige Internationalisierung** (ES/EN/DE)
- 📱 **Mobile-first responsives Design**
- 📍 **Native Funktionen** (GPS, Kamera, Benachrichtigungen)

### ✅ **Automatisches Deploy konfiguriert**
- 🚀 **Vercel** - Automatisches Deploy bei jedem Push
- 📱 **GitHub Actions** - Vollständiges CI/CD
- 🔄 **Automatischer Build** - Web + Mobile
- 📦 **APK-Generierung** - Für Android

## 🛠️ Verwendete Technologien

- **Frontend:** Next.js 15.5.4, React 19, TypeScript
- **Styling:** Tailwind CSS 4, CSS Modules
- **Mobile:** Capacitor 7.4.3 (Android/iOS)
- **PWA:** Service Worker, Manifest
- **State:** React Hooks, Context API
- **Internationalisierung:** Benutzerdefiniertes i18n-System
- **Deployment:** Vercel, GitHub Actions
- **Versionskontrolle:** Git, GitHub

## 📦 Installation und Konfiguration

### Voraussetzungen
- Node.js 18+ 
- npm oder yarn
- Git
- Android Studio (für mobile Entwicklung)
- Xcode (für iOS, optional)

### Installationsschritte

1. **Repository klonen**
```bash
git clone https://github.com/santiagoinfantinom/EcoNexo.git
cd EcoNexo
```

2. **Abhängigkeiten installieren**
```bash
npm install
```

3. **Umgebungsvariablen konfigurieren**
```bash
cp env.example .env.local
# .env.local mit deinen Konfigurationen bearbeiten
```

4. **Im Entwicklungsmodus ausführen**
```bash
npm run dev
```

5. **Im Browser öffnen**
```
http://localhost:3000
```

## 🚀 Deploy und Launch

### 🌐 **Web-Deploy (Automatisch)**
```bash
# Manuelles Deploy
npm run deploy

# Oder das automatische Skript verwenden
./deploy.sh
```

**Produktions-URL:** https://econexo.app

### 📱 **Mobile Deploy**
```bash
# APK für Android generieren
npm run mobile:build
npm run mobile:sync
cd android && ./gradlew assembleDebug

# IPA für iOS generieren (erfordert Xcode)
cd ios && pod install
# In Xcode öffnen und IPA generieren
```

### 🔄 **Automatisches Deploy**
- **Push zu main** → Automatisches Deploy zu Vercel
- **GitHub Actions** → Automatischer Build und Test
- **APK-Generierung** → Artefakt zum Download verfügbar

## 🏗️ Projektstruktur

```
src/
├── app/                    # Next.js App Router
│   ├── eventos/           # Event-Seiten
│   ├── trabajos/          # Jobs-Portal
│   ├── chat/              # Community-Chat
│   ├── proyectos/         # Projektmanagement
│   └── api/               # REST-APIs
├── components/            # Wiederverwendbare Komponenten
│   ├── MobileFeatures.tsx # Mobile-Funktionen
│   ├── CalendarView.tsx   # Kalender-Ansicht
│   └── EuropeMap.tsx     # Interaktive Karte
├── lib/                  # Utilities und Konfigurationen
│   ├── i18n.ts          # Internationalisierungssystem
│   └── supabaseClient.ts # Datenbank-Client
└── styles/              # Globale Styles

android/                 # Android-Projekt (Capacitor)
ios/                     # iOS-Projekt (Capacitor)
.github/workflows/       # GitHub Actions
```

## 🌐 Hauptseiten

### `/` - Startseite
- Interaktive Europa-Karte
- Kategorie-Filter
- Geografische Suche
- Impact-Statistiken

### `/eventos` - Event-Management
- Liste bestehender Events
- Erstellungsformular
- Kategorisierungssystem
- Freiwilligen-Registrierung

### `/trabajos` - Jobs-Portal
- Erweiterte Suche mit Filtern
- Vollständiges Bewerbungsformular
- Favoriten-System
- Dokument-Upload

### `/chat` - Community
- Thematisch organisierte Foren
- Echtzeit-Chat
- Personalisierte Empfehlungen
- Automatische Moderation

### `/proyectos` - Nachhaltige Projekte
- Community-Projektmanagement
- Fortschrittsverfolgung
- Freiwilligen-System
- Team-Kollaboration

## 📱 Mobile App

### ✅ **Native Funktionen**
- 📍 **GPS** - Präzise Standortbestimmung für Karten
- 📷 **Kamera** - Foto-Aufnahme für Events
- 🔔 **Benachrichtigungen** - Push-Benachrichtigungen
- 📱 **PWA** - Vom Browser installierbar

### 📱 **Mobile-Befehle**
```bash
# Mobile Build
npm run mobile:build

# Mit Plattformen synchronisieren
npm run mobile:sync

# Android-Projekt öffnen
npm run mobile:android

# Auf Android ausführen
npm run mobile:run:android
```

## 🌍 Internationalisierung

### ✅ **Unterstützte Sprachen**
- 🇪🇸 **Spanisch** (es) - Hauptsprache
- 🇬🇧 **Englisch** (en) - International
- 🇩🇪 **Deutsch** (de) - Europäischer Markt

### 🔄 **Sprachwechsel**
- Dynamischer Switcher in der Benutzeroberfläche
- Persistenz in localStorage
- Automatische Inhaltsübersetzung
- Kulturelle Interface-Anpassung

## 🧪 Testing

### ✅ **Implementiertes Testing**
- **Automatisierte Skripte** für Tests
- **API-Testing** mit Fallbacks
- **PWA-Testing** und mobile Funktionen
- **Internationalisierungs-Testing**
- **Performance- und Accessibility-Testing**

### 🧪 **Tests ausführen**
```bash
# Vollständiges Testing
./test-deployment.sh

# API-Testing
./test-apis.sh

# Linting-Testing
npm run lint
```

## 🚀 Deployment

### ✅ **Bereite Konfiguration**
- **Vercel** mit automatischem Deploy konfiguriert
- **GitHub Actions** für CI/CD
- **Umgebungsvariablen** definiert
- **Statischer Build** optimiert
- **PWA** vollständig funktional

### 🌐 **Produktions-URLs**
- **Web:** https://econexo.app
- **GitHub:** https://github.com/santiagoinfantinom/EcoNexo
- **Vercel Dashboard:** https://vercel.com/santiagoinfantinoms-projects/eco-nexo

## 📊 Qualitätsmetriken

### ⚡ **Performance**
- **Ladezeit:** <3 Sekunden
- **Bundle-Größe:** 3.1MB optimiert
- **First Contentful Paint:** <1.5s
- **Largest Contentful Paint:** <2.5s

### 🔒 **Sicherheit**
- **Input-Validierung**
- **Daten-Sanitization**
- **CORS konfiguriert**
- **Sichere Umgebungsvariablen**

### ♿ **Accessibility**
- **Tastatur-Navigation**
- **Adequater Kontrast**
- **Alt-Text** bei Bildern
- **ARIA-Labels** implementiert

## 🎯 Roadmap

### ✅ **Abgeschlossen**
- [x] Vollständige Web-App
- [x] Installierbare PWA
- [x] Native mobile App
- [x] Funktionsfähige APIs
- [x] Internationalisierung
- [x] Vollständiges Testing
- [x] Automatisches Deploy

### 🚀 **Kommende Funktionen**
- [ ] Erweitertes Push-Benachrichtigungssystem
- [ ] Social Media Integration
- [ ] Analytics Dashboard
- [ ] Badge- und Gamification-System
- [ ] Öffentliche API für Entwickler
- [ ] Optimierte native mobile App

### 📈 **Geplante Verbesserungen**
- [ ] Performance-Optimierung
- [ ] Accessibility-Verbesserungen
- [ ] Vollständige automatisierte Tests
- [ ] API-Dokumentation
- [ ] Automatisches Backup-System

## 🤝 Beitragen

Beiträge sind willkommen! Bitte:

1. Fork das Projekt
2. Erstelle einen Branch für dein Feature (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Pushe zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

### Beitragsrichtlinien
- Folge bestehenden Code-Konventionen
- Füge Tests für neue Funktionen hinzu
- Aktualisiere Dokumentation nach Bedarf
- Respektiere Accessibility-Prinzipien

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe die `LICENSE`-Datei für weitere Details.

## 👥 Team

- **Frontend-Entwicklung:** Santiago
- **UX/UI-Design:** Design-Team
- **Internationalisierung:** Übersetzungs-Team

## 📞 Kontakt

- **Email:** contacto@econexo.app
- **Website:** [EcoNexo](https://econexo.app)
- **GitHub:** [github.com/santiagoinfantinom/EcoNexo](https://github.com/santiagoinfantinom/EcoNexo)

## 🙏 Danksagungen

- Next.js-Community für exzellente Dokumentation
- Tailwind CSS für das Design-System
- Vercel für die Deployment-Plattform
- Capacitor für native mobile Funktionen
- Alle EcoNexo-Mitwirkenden und Nutzer

---

## 🎉 **EcoNexo ist bereit, Europa zu erobern!**

**Status:** ✅ **BEREIT FÜR DEPLOYMENT**  
**Nächster Schritt:** 🚀 **LAUNCH IN APP STORES**

*EcoNexo - Gemeinschaften für eine grünere Zukunft verbinden* 🌱🌍