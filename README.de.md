# 🌿 EcoNexo - Community-Nachhaltigkeitsplattform

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000)](https://vercel.com/)

EcoNexo ist eine umfassende Plattform, die nachhaltige Gemeinschaften verbindet, die Teilnahme an ökologischen Veranstaltungen erleichtert und grüne Arbeitsplätze fördert. Unsere Mission ist es, ein digitales Ökosystem zu schaffen, das kollektives Umweltengagement vorantreibt.

## 🚀 Hauptfunktionen

### 📅 **Veranstaltungsmanagement**
- Erstellung und Teilnahme an nachhaltigen Veranstaltungen
- Interaktiver Kalender mit Monats-, Wochen- und Listenansicht
- Kategorisierung nach Themen (Umwelt, Bildung, Gesundheit, Gemeinschaft, Ozeane, Ernährung)
- Detailliertes Registrierungssystem mit umfassenden Formularen
- Veranstaltungs-Geolokalisierung

### 💼 **Grüne Jobs Portal**
- Erweiterte Suche nach nachhaltigen Arbeitsplätzen
- Filter nach Standort, Gehalt, Erfahrung und Modalität
- Vollständiges Bewerbungsformular mit:
  - Motivationen und Fachgebieten
  - PDF-Motivationsschreiben-Upload
  - CV- und Portfolio-Links
- System zum Speichern von Lieblingsjobs

### 💬 **Community-Chat**
- Thematische Foren nach Kategorien organisiert
- Echtzeit-Chat mit Online-Nutzern
- Personalisiertes Empfehlungssystem
- Automatische Moderation und Community-Richtlinien

### 🌍 **Internationalisierung**
- Vollständige Unterstützung für Spanisch, Englisch und Deutsch
- Automatische Inhaltsübersetzung
- Kulturelle Interface-Anpassung

### 🎨 **Responsives Design**
- Moderne Benutzeroberfläche mit hellen und dunklen Modi
- Mobile-First-Design
- Verbesserte Barrierefreiheit
- Optimierte Benutzererfahrung

## 🛠️ Verwendete Technologien

- **Frontend:** Next.js 15.5.4, React 18, TypeScript
- **Styling:** Tailwind CSS, CSS Modules
- **Zustand:** React Hooks, Context API
- **Internationalisierung:** Benutzerdefiniertes i18n-System
- **Deployment:** Vercel
- **Versionskontrolle:** Git, GitHub

## 📦 Installation und Einrichtung

### Voraussetzungen
- Node.js 18+ 
- npm oder yarn
- Git

### Installationsschritte

1. **Repository klonen**
```bash
git clone https://github.com/ihr-benutzername/econexo.git
cd econexo
```

2. **Abhängigkeiten installieren**
```bash
npm install
# oder
yarn install
```

3. **Umgebungsvariablen konfigurieren**
```bash
cp .env.example .env.local
# .env.local mit Ihren Konfigurationen bearbeiten
```

4. **Im Entwicklungsmodus ausführen**
```bash
npm run dev
# oder
yarn dev
```

5. **Im Browser öffnen**
```
http://localhost:3000
```

## 🏗️ Projektstruktur

```
src/
├── app/                    # Next.js App Router
│   ├── eventos/           # Veranstaltungsseiten
│   ├── trabajos/          # Jobs-Portal
│   ├── chat/              # Community-Chat
│   └── proyectos/         # Projektmanagement
├── components/            # Wiederverwendbare Komponenten
│   ├── CalendarView.tsx   # Kalenderansicht
│   ├── EventDetailClient.tsx # Veranstaltungsdetails
│   └── ChatComponent.tsx  # Community-Chat
├── lib/                  # Utilities und Konfigurationen
│   └── i18n.ts          # Internationalisierungssystem
└── styles/              # Globale Styles
```

## 🌐 Hauptseiten

### `/eventos` - Veranstaltungsmanagement
- Veranstaltungserstellungsformular
- Liste bestehender Veranstaltungen
- Kategorisierungssystem

### `/trabajos` - Jobs-Portal
- Jobsuche und -filterung
- Verbessertes Bewerbungsformular
- Favoriten-Speichersystem

### `/chat` - Community
- Organisierte thematische Foren
- Echtzeit-Chat
- Personalisierte Empfehlungen

### `/proyectos` - Nachhaltige Projekte
- Community-Projektmanagement
- Fortschrittsverfolgung
- Teamzusammenarbeit

## 🎯 Hervorgehobene Funktionen

### Erweitertes Veranstaltungssystem
- **Intuitive Erstellung:** Vollständiges Formular mit Validierung
- **Intelligente Kategorisierung:** 6 Hauptkategorien + Unterkategorien
- **Geolokalisierung:** Integration mit spezifischen Standorten
- **Kapazitätsmanagement:** Teilnehmerkontrolle

### Vollständiges Jobs-Portal
- **Erweiterte Suche:** Mehrere kombinierbare Filter
- **Professionelle Bewerbung:** Formular mit Motivationen, Expertise und Dokumenten
- **Intelligentes Speichern:** Persistentes Favoriten-System
- **Internationalisierung:** Jobs in mehreren Sprachen

### Thematischer Community-Chat
- **Organisierte Foren:** 6 Hauptthemenkategorien
- **Echtzeit-Chat:** Sofortige Verbindung
- **Empfehlungen:** Personalisiertes Vorschlagssystem
- **Moderation:** Klare Community-Richtlinien

## 🚀 Deployment

### Vercel (Empfohlen)
1. Repository mit Vercel verbinden
2. Umgebungsvariablen konfigurieren
3. Automatisches Deploy bei jedem Push

### Andere Anbieter
- **Netlify:** Kompatibel mit Next.js
- **Railway:** Deploy mit eingeschlossener Datenbank
- **DigitalOcean:** Benutzerdefinierter VPS

## 🤝 Beitragen

Beiträge sind willkommen! Bitte:

1. Projekt forken
2. Feature-Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Änderungen committen (`git commit -m 'Add some AmazingFeature'`)
4. Auf Branch pushen (`git push origin feature/AmazingFeature`)
5. Pull Request öffnen

### Beitragsrichtlinien
- Bestehende Code-Konventionen befolgen
- Tests für neue Funktionen hinzufügen
- Dokumentation nach Bedarf aktualisieren
- Barrierefreiheitsprinzipien respektieren

## 📝 Roadmap

### Kommende Funktionen
- [ ] Push-Benachrichtigungssystem
- [ ] Social Media Integration
- [ ] Analytics Dashboard
- [ ] Badges und Gamification-System
- [ ] Öffentliche API für Entwickler
- [ ] Native Mobile App

### Geplante Verbesserungen
- [ ] Leistungsoptimierung
- [ ] Barrierefreiheitsverbesserungen
- [ ] Vollständige automatisierte Tests
- [ ] API-Dokumentation
- [ ] Automatisches Backup-System

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe die `LICENSE`-Datei für weitere Details.

## 👥 Team

- **Frontend-Entwicklung:** Santiago
- **UX/UI-Design:** Design-Team
- **Internationalisierung:** Übersetzungsteam

## 📞 Kontakt

- **E-Mail:** kontakt@econexo.org
- **Website:** [econexo.org](https://econexo.org)
- **GitHub:** [github.com/econexo](https://github.com/econexo)

## 🙏 Danksagungen

- Next.js-Community für ausgezeichnete Dokumentation
- Tailwind CSS für das Design-System
- Vercel für die Deployment-Plattform
- Alle EcoNexo-Mitwirkenden und Nutzer

---

**Schließen Sie sich der Nachhaltigkeitsrevolution an! 🌱**

*EcoNexo - Gemeinschaften für eine grünere Zukunft verbinden*