[English](README.md) | [Español](README.es.md) | [Deutsch](README.de.md)

# 🌿 EcoNexo - Community Sustainability Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000)](https://vercel.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-7.4.3-119EFF)](https://capacitorjs.com/)

🌍 **EcoNexo is now in production:** https://eco-nexo-j62lzrpdd-santiagoinfantinoms-projects.vercel.app

EcoNexo is a comprehensive platform that connects sustainable communities, facilitates participation in ecological events, and promotes green jobs. Our mission is to create a digital ecosystem that drives collective environmental action across Europe.

## 🚀 Current Status: READY FOR DEPLOYMENT ✅

### ✅ **Implemented Features**
- 🌐 **Complete Web App** with Next.js 15.5.4
- 📱 **Installable PWA** with Service Worker
- 📱 **Native mobile app** with Capacitor (Android/iOS)
- 🔌 **REST APIs** working with fallbacks
- 🌍 **Complete internationalization** (ES/EN/DE)
- 📱 **Mobile-first responsive design**
- 📍 **Native features** (GPS, Camera, Notifications)

### ✅ **Automatic Deploy Configured**
- 🚀 **Vercel** - Automatic deploy on each push
- 📱 **GitHub Actions** - Complete CI/CD
- 🔄 **Automatic build** - Web + Mobile
- 📦 **APK generation** - For Android

## 🛠️ Technologies Used

- **Frontend:** Next.js 15.5.4, React 19, TypeScript
- **Styling:** Tailwind CSS 4, CSS Modules
- **Mobile:** Capacitor 7.4.3 (Android/iOS)
- **PWA:** Service Worker, Manifest
- **State:** React Hooks, Context API
- **Internationalization:** Custom i18n system
- **Deployment:** Vercel, GitHub Actions
- **Version Control:** Git, GitHub

## 📦 Installation and Configuration

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- Android Studio (for mobile development)
- Xcode (for iOS, optional)

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/santiagoinfantinom/EcoNexo.git
cd EcoNexo
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp env.example .env.local
# Edit .env.local with your configurations
```

4. **Run in development mode**
```bash
npm run dev
```

5. **Open in browser**
```
http://localhost:3000
```

## 🚀 Deploy and Launch

### 🌐 **Web Deploy (Automatic)**
```bash
# Manual deploy
npm run deploy

# Or use the automatic script
./deploy.sh
```

**Production URL:** https://eco-nexo-j62lzrpdd-santiagoinfantinoms-projects.vercel.app

### 📱 **Mobile Deploy**
```bash
# Generate APK for Android
npm run mobile:build
npm run mobile:sync
cd android && ./gradlew assembleDebug

# Generate IPA for iOS (requires Xcode)
cd ios && pod install
# Open in Xcode and generate IPA
```

### 🔄 **Automatic Deploy**
- **Push to main** → Automatic deploy to Vercel
- **GitHub Actions** → Automatic build and test
- **APK generation** → Artifact available for download

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── eventos/           # Event pages
│   ├── trabajos/          # Jobs portal
│   ├── chat/              # Community chat
│   ├── proyectos/         # Project management
│   └── api/               # REST APIs
├── components/            # Reusable components
│   ├── MobileFeatures.tsx # Mobile features
│   ├── CalendarView.tsx   # Calendar view
│   └── EuropeMap.tsx     # Interactive map
├── lib/                  # Utilities and configurations
│   ├── i18n.ts          # Internationalization system
│   └── supabaseClient.ts # Database client
└── styles/              # Global styles

android/                 # Android project (Capacitor)
ios/                     # iOS project (Capacitor)
.github/workflows/       # GitHub Actions
```

## 🌐 Main Pages

### `/` - Home Page
- Interactive Europe map
- Category filters
- Geographic search
- Impact statistics

### `/eventos` - Event Management
- List of existing events
- Creation form
- Categorization system
- Volunteer registration

### `/trabajos` - Jobs Portal
- Advanced search with filters
- Complete application form
- Favorites system
- Document upload

### `/chat` - Community
- Thematic organized forums
- Real-time chat
- Personalized recommendations
- Automatic moderation

### `/proyectos` - Sustainable Projects
- Community project management
- Progress tracking
- Volunteer system
- Team collaboration

## 📱 Mobile App

### ✅ **Native Features**
- 📍 **GPS** - Precise location for maps
- 📷 **Camera** - Photo capture for events
- 🔔 **Notifications** - Push notifications
- 📱 **PWA** - Installable from browser

### 📱 **Mobile Commands**
```bash
# Mobile build
npm run mobile:build

# Sync with platforms
npm run mobile:sync

# Open Android project
npm run mobile:android

# Run on Android
npm run mobile:run:android
```

## 🌍 Internationalization

### ✅ **Supported Languages**
- 🇪🇸 **Spanish** (es) - Primary language
- 🇬🇧 **English** (en) - International
- 🇩🇪 **German** (de) - European market

### 🔄 **Language Switching**
- Dynamic switcher in interface
- Persistence in localStorage
- Automatic content translation
- Cultural interface adaptation

## 🧪 Testing

### ✅ **Implemented Testing**
- **Automated scripts** for testing
- **API testing** with fallbacks
- **PWA testing** and mobile features
- **Internationalization testing**
- **Performance and accessibility testing**

### 🧪 **Run Tests**
```bash
# Complete testing
./test-deployment.sh

# API testing
./test-apis.sh

# Linting testing
npm run lint
```

## 🚀 Deployment

### ✅ **Ready Configuration**
- **Vercel** configured with automatic deploy
- **GitHub Actions** for CI/CD
- **Environment variables** defined
- **Static build** optimized
- **PWA** fully functional

### 🌐 **Production URLs**
- **Web:** https://eco-nexo-j62lzrpdd-santiagoinfantinoms-projects.vercel.app
- **GitHub:** https://github.com/santiagoinfantinom/EcoNexo
- **Vercel Dashboard:** https://vercel.com/santiagoinfantinoms-projects/eco-nexo

## 📊 Quality Metrics

### ⚡ **Performance**
- **Load time:** <3 seconds
- **Bundle size:** 3.1MB optimized
- **First Contentful Paint:** <1.5s
- **Largest Contentful Paint:** <2.5s

### 🔒 **Security**
- **Input validation**
- **Data sanitization**
- **CORS configured**
- **Secure environment variables**

### ♿ **Accessibility**
- **Keyboard navigation**
- **Adequate contrast**
- **Alt text** on images
- **ARIA labels** implemented

## 🎯 Roadmap

### ✅ **Completed**
- [x] Complete web app
- [x] Installable PWA
- [x] Native mobile app
- [x] Working APIs
- [x] Internationalization
- [x] Complete testing
- [x] Automatic deploy

### 🚀 **Upcoming Features**
- [ ] Advanced push notification system
- [ ] Social media integration
- [ ] Analytics dashboard
- [ ] Badge and gamification system
- [ ] Public API for developers
- [ ] Optimized native mobile app

### 📈 **Planned Improvements**
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Complete automated tests
- [ ] API documentation
- [ ] Automatic backup system

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow existing code conventions
- Add tests for new features
- Update documentation as needed
- Respect accessibility principles

## 📄 License

This project is under the MIT License. See the `LICENSE` file for more details.

## 👥 Team

- **Frontend Development:** Santiago
- **UX/UI Design:** Design team
- **Internationalization:** Translation team

## 📞 Contact

- **Email:** contacto@econexo.org
- **Website:** [EcoNexo](https://eco-nexo-68vbhh7ev-santiagoinfantinoms-projects.vercel.app)
- **GitHub:** [github.com/santiagoinfantinom/EcoNexo](https://github.com/santiagoinfantinom/EcoNexo)

## 🙏 Acknowledgments

- Next.js community for excellent documentation
- Tailwind CSS for the design system
- Vercel for the deployment platform
- Capacitor for native mobile features
- All EcoNexo contributors and users

---

## 🎉 **EcoNexo is ready to conquer Europe!**

**Status:** ✅ **READY FOR DEPLOYMENT**  
**Next step:** 🚀 **LAUNCH IN APP STORES**

*EcoNexo - Connecting communities for a greener future* 🌱🌍