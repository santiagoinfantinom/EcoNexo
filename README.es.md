[English](README.md) | [Español](README.es.md) | [Deutsch](README.de.md)

# 🌿 EcoNexo - Plataforma de Sostenibilidad Comunitaria

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000)](https://vercel.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-7.4.3-119EFF)](https://capacitorjs.com/)

🌍 **EcoNexo está ahora en producción:** https://econexo.io

EcoNexo es una plataforma integral que conecta comunidades sostenibles, facilita la participación en eventos ecológicos, y promueve empleos verdes. Nuestra misión es crear un ecosistema digital que impulse la acción ambiental colectiva en Europa.

## 🚀 Estado Actual: LISTO PARA DEPLOYMENT ✅

### ✅ **Funcionalidades Implementadas**
- 🌐 **Web App completa** con Next.js 15.5.4
- 📱 **PWA instalable** con Service Worker
- 📱 **App móvil nativa** con Capacitor (Android/iOS)
- 🔌 **APIs REST** funcionando con fallbacks
- 🌍 **Internacionalización** completa (ES/EN/DE)
- 📱 **Responsive design** mobile-first
- 📍 **Funcionalidades nativas** (GPS, Cámara, Notificaciones)

### ✅ **Deploy Automático Configurado**
- 🚀 **Vercel** - Deploy automático en cada push
- 📱 **GitHub Actions** - CI/CD completo
- 🔄 **Build automático** - Web + Móvil
- 📦 **APK generation** - Para Android

## 🛠️ Tecnologías Utilizadas

- **Frontend:** Next.js 15.5.4, React 19, TypeScript
- **Styling:** Tailwind CSS 4, CSS Modules
- **Mobile:** Capacitor 7.4.3 (Android/iOS)
- **PWA:** Service Worker, Manifest
- **Estado:** React Hooks, Context API
- **Internacionalización:** Sistema personalizado i18n
- **Deployment:** Vercel, GitHub Actions
- **Control de Versiones:** Git, GitHub

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Git
- Android Studio (para desarrollo móvil)
- Xcode (para iOS, opcional)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/santiagoinfantinom/EcoNexo.git
cd EcoNexo
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp env.example .env.local
# Editar .env.local con tus configuraciones
```

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

## 🚀 Deploy y Lanzamiento

### 🌐 **Deploy Web (Automático)**
```bash
# Deploy manual
npm run deploy

# O usar el script automático
./deploy.sh
```

**URL de Producción:** https://econexo.io

### 📱 **Deploy Móvil**
```bash
# Generar APK para Android
npm run mobile:build
npm run mobile:sync
cd android && ./gradlew assembleDebug

# Generar IPA para iOS (requiere Xcode)
cd ios && pod install
# Abrir en Xcode y generar IPA
```

### 🔄 **Deploy Automático**
- **Push a main** → Deploy automático a Vercel
- **GitHub Actions** → Build y test automático
- **APK generation** → Artifact disponible para descarga

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── eventos/           # Páginas de eventos
│   ├── trabajos/          # Portal de empleos
│   ├── chat/              # Chat comunitario
│   ├── proyectos/         # Gestión de proyectos
│   └── api/               # APIs REST
├── components/            # Componentes reutilizables
│   ├── MobileFeatures.tsx # Funcionalidades móviles
│   ├── CalendarView.tsx   # Vista de calendario
│   └── EuropeMap.tsx     # Mapa interactivo
├── lib/                  # Utilidades y configuraciones
│   ├── i18n.ts          # Sistema de internacionalización
│   └── supabaseClient.ts # Cliente de base de datos
└── styles/              # Estilos globales

android/                 # Proyecto Android (Capacitor)
ios/                     # Proyecto iOS (Capacitor)
.github/workflows/       # GitHub Actions
```

## 🌐 Páginas Principales

### `/` - Página Principal
- Mapa interactivo de Europa
- Filtros por categoría
- Búsqueda geográfica
- Estadísticas de impacto

### `/eventos` - Gestión de Eventos
- Lista de eventos existentes
- Formulario de creación
- Sistema de categorización
- Registro de voluntarios

### `/trabajos` - Portal de Empleos
- Búsqueda avanzada con filtros
- Formulario de aplicación completo
- Sistema de favoritos
- Upload de documentos

### `/chat` - Comunidad
- Foros temáticos organizados
- Chat en tiempo real
- Recomendaciones personalizadas
- Moderación automática

### `/proyectos` - Proyectos Sostenibles
- Gestión de proyectos comunitarios
- Seguimiento de progreso
- Sistema de voluntariado
- Colaboración en equipo

## 📱 App Móvil

### ✅ **Funcionalidades Nativas**
- 📍 **GPS** - Ubicación precisa para mapas
- 📷 **Cámara** - Captura de fotos para eventos
- 🔔 **Notificaciones** - Push notifications
- 📱 **PWA** - Instalable desde navegador

### 📱 **Comandos Móviles**
```bash
# Build móvil
npm run mobile:build

# Sincronizar con plataformas
npm run mobile:sync

# Abrir proyecto Android
npm run mobile:android

# Ejecutar en Android
npm run mobile:run:android
```

## 🌍 Internacionalización

### ✅ **Idiomas Soportados**
- 🇪🇸 **Español** (es) - Idioma principal
- 🇬🇧 **Inglés** (en) - Internacional
- 🇩🇪 **Alemán** (de) - Mercado europeo

### 🔄 **Cambio de Idioma**
- Switcher dinámico en la interfaz
- Persistencia en localStorage
- Traducción automática de contenido
- Adaptación cultural de interfaces

## 🧪 Testing

### ✅ **Testing Implementado**
- **Scripts automatizados** de testing
- **Testing de APIs** con fallbacks
- **Testing de PWA** y funcionalidades móviles
- **Testing de internacionalización**
- **Testing de rendimiento** y accesibilidad

### 🧪 **Ejecutar Tests**
```bash
# Testing completo
./test-deployment.sh

# Testing de APIs
./test-apis.sh

# Testing de linting
npm run lint
```

## 🚀 Deployment

### ✅ **Configuración Lista**
- **Vercel** configurado con deploy automático
- **GitHub Actions** para CI/CD
- **Variables de entorno** definidas
- **Build estático** optimizado
- **PWA** completamente funcional

### 🌐 **URLs de Producción**
- **Web:** https://econexo.io (Principal) o https://econexo-web.vercel.app (Vercel)
- **GitHub:** https://github.com/santiagoinfantinom/EcoNexo

## 📊 Métricas de Calidad

### ⚡ **Rendimiento**
- **Tiempo de carga:** <3 segundos
- **Bundle size:** 3.1MB optimizado
- **First Contentful Paint:** <1.5s
- **Largest Contentful Paint:** <2.5s

### 🔒 **Seguridad**
- **Validación** de inputs
- **Sanitización** de datos
- **CORS** configurado
- **Variables de entorno** seguras

### ♿ **Accesibilidad**
- **Navegación por teclado**
- **Contraste** adecuado
- **Alt text** en imágenes
- **ARIA labels** implementados

## 🎯 Roadmap

### ✅ **Completado**
- [x] Web app completa
- [x] PWA instalable
- [x] App móvil nativa
- [x] APIs funcionando
- [x] Internacionalización
- [x] Testing completo
- [x] Deploy automático

### 🚀 **Próximas Funcionalidades**
- [ ] Sistema de notificaciones push avanzado
- [ ] Integración con redes sociales
- [ ] Dashboard de analytics
- [ ] Sistema de badges y gamificación
- [ ] API pública para desarrolladores
- [ ] App móvil nativa optimizada

### 📈 **Mejoras Planificadas**
- [ ] Optimización de rendimiento
- [ ] Mejoras de accesibilidad
- [ ] Tests automatizados completos
- [ ] Documentación de API
- [ ] Sistema de backup automático

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución
- Sigue las convenciones de código existentes
- Añade tests para nuevas funcionalidades
- Actualiza la documentación según sea necesario
- Respeta los principios de accesibilidad

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

- **Desarrollo Frontend:** Santiago
- **Diseño UX/UI:** Equipo de diseño
- **Internacionalización:** Equipo de traducción

## 📞 Contacto

- **Email:** contacto@econexo.app
- **Website:** [EcoNexo](https://econexo.io)
- **GitHub:** [github.com/santiagoinfantinom/EcoNexo](https://github.com/santiagoinfantinom/EcoNexo)

## 🙏 Agradecimientos

- Comunidad de Next.js por la excelente documentación
- Tailwind CSS por el sistema de diseño
- Vercel por la plataforma de deployment
- Capacitor por las funcionalidades móviles nativas
- Todos los contribuidores y usuarios de EcoNexo

---

## 🎉 **¡EcoNexo está listo para conquistar Europa!**

**Estado:** ✅ **LISTO PARA DEPLOYMENT**  
**Próximo paso:** 🚀 **LANZAMIENTO EN TIENDAS DE APPS**

*EcoNexo - Conectando comunidades para un futuro más verde* 🌱🌍
