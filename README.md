# 🌿 EcoNexo - Plataforma de Sostenibilidad Comunitaria

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000)](https://vercel.com/)

EcoNexo es una plataforma integral que conecta comunidades sostenibles, facilita la participación en eventos ecológicos, y promueve empleos verdes. Nuestra misión es crear un ecosistema digital que impulse la acción ambiental colectiva.

## 🚀 Características Principales

### 📅 **Gestión de Eventos**
- Creación y participación en eventos sostenibles
- Calendario interactivo con vista mensual, semanal y lista
- Categorización por temas (Medio ambiente, Educación, Salud, Comunidad, Océanos, Alimentación)
- Sistema de registro con formularios detallados
- Geolocalización de eventos

### 💼 **Portal de Empleos Verdes**
- Búsqueda avanzada de trabajos sostenibles
- Filtros por ubicación, salario, experiencia y modalidad
- Formulario de aplicación completo con:
  - Motivaciones y áreas de expertise
  - Upload de carta de motivación en PDF
  - Enlaces a CV y portafolio
- Sistema de guardado de trabajos favoritos

### 💬 **Chat Comunitario**
- Foros temáticos organizados por categorías
- Chat en tiempo real con usuarios en línea
- Sistema de recomendaciones personalizadas
- Moderación automática y directrices de comunidad

### 🌍 **Internacionalización**
- Soporte completo para Español, Inglés y Alemán
- Traducción automática de contenido
- Adaptación cultural de interfaces

### 🎨 **Diseño Responsivo**
- Interfaz moderna con modo claro y oscuro
- Diseño mobile-first
- Accesibilidad mejorada
- Experiencia de usuario optimizada

## 🛠️ Tecnologías Utilizadas

- **Frontend:** Next.js 15.5.4, React 18, TypeScript
- **Styling:** Tailwind CSS, CSS Modules
- **Estado:** React Hooks, Context API
- **Internacionalización:** Sistema personalizado i18n
- **Deployment:** Vercel
- **Control de Versiones:** Git, GitHub

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/econexo.git
cd econexo
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
# Editar .env.local con tus configuraciones
```

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
# o
yarn dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── eventos/           # Páginas de eventos
│   ├── trabajos/          # Portal de empleos
│   ├── chat/              # Chat comunitario
│   └── proyectos/         # Gestión de proyectos
├── components/            # Componentes reutilizables
│   ├── CalendarView.tsx   # Vista de calendario
│   ├── EventDetailClient.tsx # Detalles de eventos
│   └── ChatComponent.tsx  # Chat comunitario
├── lib/                  # Utilidades y configuraciones
│   └── i18n.ts          # Sistema de internacionalización
└── styles/              # Estilos globales
```

## 🌐 Páginas Principales

### `/eventos` - Gestión de Eventos
- Formulario de creación de eventos
- Lista de eventos existentes
- Sistema de categorización

### `/trabajos` - Portal de Empleos
- Búsqueda y filtrado de trabajos
- Formulario de aplicación mejorado
- Sistema de guardado de favoritos

### `/chat` - Comunidad
- Foros temáticos organizados
- Chat en tiempo real
- Recomendaciones personalizadas

### `/proyectos` - Proyectos Sostenibles
- Gestión de proyectos comunitarios
- Seguimiento de progreso
- Colaboración en equipo

## 🎯 Funcionalidades Destacadas

### Sistema de Eventos Avanzado
- **Creación intuitiva:** Formulario completo con validación
- **Categorización inteligente:** 6 categorías principales + subcategorías
- **Geolocalización:** Integración con ubicaciones específicas
- **Gestión de capacidad:** Control de participantes

### Portal de Empleos Completo
- **Búsqueda avanzada:** Múltiples filtros combinables
- **Aplicación profesional:** Formulario con motivaciones, expertise y documentos
- **Guardado inteligente:** Sistema de favoritos persistente
- **Internacionalización:** Trabajos en múltiples idiomas

### Chat Comunitario Temático
- **Foros organizados:** 6 categorías temáticas principales
- **Chat en tiempo real:** Conexión instantánea
- **Recomendaciones:** Sistema de sugerencias personalizadas
- **Moderación:** Directrices claras de comunidad

## 🚀 Deployment

### Vercel (Recomendado)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático en cada push

### Otros Proveedores
- **Netlify:** Compatible con Next.js
- **Railway:** Deploy con base de datos incluida
- **DigitalOcean:** VPS personalizado

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

## 📝 Roadmap

### Próximas Funcionalidades
- [ ] Sistema de notificaciones push
- [ ] Integración con redes sociales
- [ ] Dashboard de analytics
- [ ] Sistema de badges y gamificación
- [ ] API pública para desarrolladores
- [ ] App móvil nativa

### Mejoras Planificadas
- [ ] Optimización de rendimiento
- [ ] Mejoras de accesibilidad
- [ ] Tests automatizados completos
- [ ] Documentación de API
- [ ] Sistema de backup automático

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

- **Desarrollo Frontend:** Santiago
- **Diseño UX/UI:** Equipo de diseño
- **Internacionalización:** Equipo de traducción

## 📞 Contacto

- **Email:** contacto@econexo.org
- **Website:** [econexo.org](https://econexo.org)
- **GitHub:** [github.com/econexo](https://github.com/econexo)

## 🙏 Agradecimientos

- Comunidad de Next.js por la excelente documentación
- Tailwind CSS por el sistema de diseño
- Vercel por la plataforma de deployment
- Todos los contribuidores y usuarios de EcoNexo

---

**¡Únete a la revolución sostenible! 🌱**

*EcoNexo - Conectando comunidades para un futuro más verde*