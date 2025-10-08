# 🌿 EcoNexo - Plataforma de Comunidad Ecológica

EcoNexo es una plataforma web moderna que conecta a personas apasionadas por la sostenibilidad y el medio ambiente. Nuestra misión es crear una comunidad global donde los usuarios puedan descubrir proyectos ecológicos, participar en eventos sostenibles, encontrar trabajos verdes y conectarse con otros activistas ambientales.

## ✨ Características Principales

### 🗺️ **Mapa Interactivo**
- Visualización de proyectos ecológicos en Europa
- Filtros por categorías (Medio ambiente, Educación, Salud, etc.)
- Información detallada de cada proyecto
- Sistema de donaciones integrado

### 📅 **Calendario de Eventos**
- Vista mensual y de lista de eventos
- Filtros por categorías y ubicación
- Registro para eventos de voluntariado
- Seguimiento de eventos participados

### 💼 **Trabajos Verdes**
- Ofertas de empleo en sostenibilidad
- Filtros por ubicación y tipo de trabajo
- Información detallada de empresas
- Sistema de aplicación integrado

### 💬 **Chat de Comunidad**
- Chat en tiempo real para la comunidad
- Reglas de conducta basadas en valores positivos
- Moderación automática
- Conexión entre miembros

### 👤 **Perfil de Usuario**
- Información personal completa
- Pasiones y áreas de experiencia
- Hobbies e intereses
- Redes sociales y contacto

## 🚀 Tecnologías Utilizadas

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS
- **Mapas:** Leaflet, React-Leaflet
- **Internacionalización:** Sistema personalizado i18n
- **Deployment:** Vercel
- **Base de datos:** Supabase (configuración incluida)

## 🌍 Idiomas Soportados

- 🇪🇸 **Español** (predeterminado)
- 🇬🇧 **Inglés**
- 🇩🇪 **Alemán**

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase (opcional)

### Instalación Local

1. **Clona el repositorio**
```bash
git clone https://github.com/tu-usuario/econexo.git
cd econexo
```

2. **Instala las dependencias**
```bash
npm install
# o
yarn install
```

3. **Configura las variables de entorno**
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus configuraciones:
```env
# Supabase (opcional)
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key

# PayPal (opcional)
NEXT_PUBLIC_PAYPAL_LINK=https://www.paypal.com/donate/?hosted_button_id=TU_BOTON_ID

# Stripe (opcional)
NEXT_PUBLIC_STRIPE_LINK=https://stripe.com/payments/checkout
```

4. **Ejecuta el servidor de desarrollo**
```bash
npm run dev
# o
yarn dev
```

5. **Abre tu navegador**
Visita [http://localhost:3000](http://localhost:3000)

## 🎯 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo con Turbopack
npm run build        # Construcción para producción
npm run start        # Servidor de producción
npm run lint         # Verificación de código

# Base de datos (Supabase)
npm run db:reset     # Resetear base de datos
npm run db:seed      # Poblar con datos de ejemplo
```

## 🗂️ Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── page.tsx           # Página principal (Mapa)
│   ├── calendario/        # Página de calendario
│   ├── eventos/           # Página de eventos
│   ├── trabajos/          # Página de trabajos verdes
│   ├── chat/              # Página de chat
│   ├── perfil/            # Página de perfil
│   └── projects/[id]/     # Páginas dinámicas de proyectos
├── components/            # Componentes reutilizables
│   ├── HeaderNav.tsx      # Navegación principal
│   ├── EuropeMap.tsx      # Mapa de Europa
│   ├── CalendarView.tsx   # Vista de calendario
│   ├── ChatComponent.tsx  # Componente de chat
│   ├── ProfileComponent.tsx # Componente de perfil
│   └── ...
├── lib/                   # Utilidades y configuración
│   ├── i18n.ts           # Sistema de internacionalización
│   └── theme.ts           # Gestión de temas
└── supabase/              # Configuración de Supabase
    ├── schema.sql         # Esquema de base de datos
    └── migrations/        # Migraciones
```

## 🌱 Características Ecológicas

### Proyectos Sostenibles
- **Reforestación urbana** en Berlín
- **Talleres de robótica educativa** en Madrid
- **Clínicas móviles comunitarias** en Milán
- **Recuperación de playas** en Marsella
- **Huertos urbanos** en Londres
- **Centros vecinales inclusivos** en Estocolmo

### Categorías de Impacto
- 🌳 **Medio Ambiente:** Reforestación, calidad del aire
- 🧪 **Educación:** STEM, inclusión
- 🩺 **Salud:** Prevención, acceso
- 🤗 **Comunidad:** Integración, cultura
- 🏖️ **Océanos:** Playas limpias, biodiversidad
- 🌱 **Alimentación:** Huertos urbanos, comunidad

## 💡 Funcionalidades Avanzadas

### Sistema de Chat
- **Reglas de conducta** basadas en valores positivos
- **Moderación automática** de contenido
- **Conexión en tiempo real** entre usuarios
- **Historial de mensajes** persistente

### Perfil de Usuario
- **Información personal** completa
- **Pasiones y experiencia** detalladas
- **Redes sociales** integradas
- **Foto de perfil** personalizable

### Internacionalización
- **3 idiomas** completamente soportados
- **Traducción automática** de contenido
- **Persistencia** de preferencias de idioma
- **Localización** de fechas y números

## 🚀 Deployment

### Vercel (Recomendado)

1. **Conecta tu repositorio a Vercel**
2. **Configura las variables de entorno** en el dashboard de Vercel
3. **Deploy automático** en cada push a main

### Variables de Entorno para Producción
```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url_produccion
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key_produccion
NEXT_PUBLIC_PAYPAL_LINK=tu_paypal_donate_link
NEXT_PUBLIC_STRIPE_LINK=tu_stripe_checkout_link
```

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor:

1. **Fork** el proyecto
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

### Guías de Contribución
- Sigue las convenciones de código existentes
- Añade tests para nuevas funcionalidades
- Actualiza la documentación según sea necesario
- Respeta los valores ecológicos del proyecto

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🌟 Valores del Proyecto

### Misión
Conectar a personas apasionadas por la sostenibilidad para crear un impacto positivo en el medio ambiente.

### Valores
- 🌱 **Sostenibilidad:** Promovemos prácticas ecológicas
- 🤝 **Comunidad:** Construimos conexiones significativas
- 💚 **Amor:** Tratamos a todos con respeto y comprensión
- 🌍 **Impacto:** Buscamos generar cambios positivos
- ✨ **Inspiración:** Motivamos a otros en su camino verde

## 📞 Contacto

- **Proyecto:** [EcoNexo](https://github.com/tu-usuario/econexo)
- **Issues:** [GitHub Issues](https://github.com/tu-usuario/econexo/issues)
- **Discusiones:** [GitHub Discussions](https://github.com/tu-usuario/econexo/discussions)

## 🙏 Agradecimientos

- **Next.js** por el framework increíble
- **Tailwind CSS** por el sistema de diseño
- **Supabase** por la infraestructura de base de datos
- **Vercel** por el hosting y deployment
- **Comunidad open source** por las librerías utilizadas

---

**Hecho con 💚 para un futuro más sostenible**

*Únete a la revolución verde con EcoNexo* 🌿