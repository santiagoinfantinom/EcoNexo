# EcoNexo - Plataforma Avanzada de Sostenibilidad

[![English](https://img.shields.io/badge/README-English-blue)](./README.en.md) [![Deutsch](https://img.shields.io/badge/README-Deutsch-red)](./README.de.md)

Mapa interactivo de proyectos y eventos sostenibles en Europa con funcionalidades avanzadas de IA, análisis de impacto y monetización sostenible.

## 🚀 **Nuevas Funcionalidades Avanzadas**

### **🛤️ Rutas Sostenibles**
- Cálculo automático de rutas ecológicas (caminar, bicicleta, transporte público)
- Análisis de emisiones CO₂ por tipo de transporte
- Estimación de costos y tiempo de viaje
- Instrucciones detalladas paso a paso

### **🔍 Filtros Avanzados**
- Filtros por fecha, distancia, tipo de impacto
- Filtros por dificultad, accesibilidad y costo
- Filtros por organizador e idioma
- Interfaz colapsible con contador de filtros activos

### **🗺️ Clustering Inteligente**
- Algoritmo DBSCAN para agrupar eventos cercanos
- Ajuste automático según nivel de zoom
- Visualización de clusters con círculos y marcadores
- Popups informativos con detalles de eventos agrupados

### **🎯 Recomendaciones Personalizadas**
- Sistema de scoring basado en preferencias del usuario
- Análisis de ubicación, intereses y historial
- Explicación detallada de por qué se recomienda cada evento
- Aprendizaje continuo de preferencias

### **📊 Análisis de Impacto**
- Cálculo automático de métricas ambientales (CO₂, residuos, energía, agua)
- Análisis de impacto social y biodiversidad
- Visualización con gráficos y barras de progreso
- Comparación de impacto entre diferentes eventos

### **💰 Monetización Sostenible**
- **Donaciones**: Campañas verificadas con tracking de impacto
- **Patrocinios**: Descuentos de empresas sostenibles con scoring de sostenibilidad
- **Premium**: Suscripciones con funciones avanzadas
- **Transparencia**: Reportes detallados de impacto por donación

### **📱 Detección Automática de Proyectos**
- Monitoreo de redes sociales (Twitter, Instagram, Facebook, LinkedIn)
- Análisis de sostenibilidad con IA
- Sistema de verificación y aprobación manual
- Configuración de filtros de detección

## 🛠️ **Tecnologías Implementadas**

### **Frontend**
- **Next.js 14** con App Router
- **React 18** con hooks avanzados
- **TypeScript** para type safety
- **Tailwind CSS** para estilos
- **React Leaflet** para mapas interactivos

### **Algoritmos**
- **DBSCAN** para clustering geoespacial
- **Sistema de scoring** para recomendaciones
- **Cálculos de impacto** con factores ambientales
- **Análisis de sostenibilidad** con IA

### **APIs Integradas**
- **Nominatim** para geocodificación
- **OpenStreetMap** para tiles de mapas
- **APIs gubernamentales** para datos ambientales
- **APIs de redes sociales** para detección automática

## 📁 **Estructura de Componentes**

```
src/components/
├── SustainableRoutes.tsx          # Rutas ecológicas
├── AdvancedFilters.tsx            # Filtros avanzados
├── IntelligentClustering.tsx      # Clustering de eventos
├── PersonalizedRecommendations.tsx # Sistema de recomendaciones
├── ImpactAnalysis.tsx            # Análisis de impacto
├── SustainableMonetization.tsx   # Monetización sostenible
├── SocialMediaDetection.tsx      # Detección automática
├── EcoNexoAdvanced.tsx           # Componente principal
└── ... (componentes existentes)
```

## 🚀 **Desarrollo**

### **Requisitos**
- Node.js 18+
- npm o yarn

### **Instalación**
```bash
npm install
npm run dev
# Abre http://localhost:3000/advanced-demo
```

### **Variables de Entorno**
```env
# APIs Gubernamentales (opcional)
EEA_API_KEY=your_eea_api_key
COPERNICUS_API_KEY=your_copernicus_api_key

# Redes Sociales (opcional)
TWITTER_API_KEY=your_twitter_api_key
INSTAGRAM_API_KEY=your_instagram_api_key
```

## 📊 **Métricas y Análisis**

### **Impacto Ambiental**
- Reducción de CO₂ (kg)
- Residuos reducidos (kg)
- Energía ahorrada (kWh)
- Agua conservada (litros)
- Árboles plantados
- Puntuación de biodiversidad

### **Impacto Social**
- Personas ayudadas
- Comunidades fortalecidas
- Educación ambiental
- Conciencia social

### **Impacto Económico**
- Valor económico generado (€)
- Ahorros en servicios públicos
- Empleo verde creado
- Inversión en sostenibilidad

## 🌍 **Integración con APIs Gubernamentales**

Ver [GOVERNMENT_APIS.md](./GOVERNMENT_APIS.md) para documentación completa de:
- Copernicus Climate Change Service
- European Environment Agency
- EU Open Data Portal
- APIs nacionales por país

## 🎯 **Casos de Uso**

### **Para Usuarios**
1. **Descubrir eventos** con recomendaciones personalizadas
2. **Planificar rutas** sostenibles hacia eventos
3. **Filtrar eventos** por criterios específicos
4. **Analizar impacto** de participación
5. **Apoyar proyectos** con donaciones

### **Para Organizadores**
1. **Crear eventos** con análisis de impacto automático
2. **Gestionar voluntarios** con herramientas avanzadas
3. **Recibir donaciones** transparentes y verificadas
4. **Generar reportes** con datos oficiales
5. **Detectar proyectos** desde redes sociales

### **Para Empresas**
1. **Patrocinar eventos** sostenibles verificados
2. **Ofrecer descuentos** a usuarios comprometidos
3. **Medir impacto** de patrocinios
4. **Acceder a analytics** detallados

## 🔮 **Roadmap Futuro**

### **Corto Plazo**
- [ ] Integración completa con APIs gubernamentales
- [ ] App móvil con React Native
- [ ] Notificaciones push
- [ ] Modo offline

### **Medio Plazo**
- [ ] Blockchain para certificados NFT
- [ ] IoT integration con sensores ambientales
- [ ] Real-time collaboration
- [ ] Gamificación avanzada

### **Largo Plazo**
- [ ] Expansión global
- [ ] IA predictiva para eventos
- [ ] Metaverso sostenible
- [ ] Integración con gobiernos

## 🤝 **Contribuir**

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 🙏 **Agradecimientos**

- **OpenStreetMap** por los datos de mapas
- **European Environment Agency** por datos ambientales
- **Copernicus** por datos climáticos
- **Comunidad open source** por las librerías utilizadas

---

**EcoNexo** - Conectando personas con proyectos sostenibles para un futuro mejor 🌱
