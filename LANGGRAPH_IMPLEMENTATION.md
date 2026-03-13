# Implementación del Agente de Matching Inteligente con LangGraph + MCP

## Resumen

Se ha implementado exitosamente un Agente de Matching Inteligente usando LangGraph y MCP (Model Context Protocol) con Google Gemini como proveedor de LLM. El sistema permite a los usuarios encontrar proyectos que se ajusten perfectamente a sus intereses y preferencias mediante conversación natural.

## Arquitectura Implementada

```
Frontend (Next.js) → API Route → MCP Server (Python) → LangGraph Agent → MCP Tools → EcoNexo API
```

## Componentes Implementados

### 1. Servidor MCP (Python)

**Ubicación:** `mcp-server/`

**Estructura:**
- `src/agent/`: Agente LangGraph con nodos de procesamiento
- `src/tools/`: Herramientas MCP para acceso a datos
- `src/server.py`: Servidor FastAPI con endpoints HTTP

**Endpoints:**
- `POST /match`: Matching principal
- `POST /explain`: Explicación de matches
- `POST /refine`: Refinamiento basado en feedback
- `GET /health`: Health check

### 2. Herramientas MCP

**user_tools.py:**
- `get_user_profile()`: Obtener perfil de usuario
- `get_user_history()`: Historial de participación
- `get_user_preferences()`: Preferencias del usuario
- `update_user_preferences()`: Actualizar preferencias

**project_tools.py:**
- `search_projects()`: Búsqueda avanzada
- `get_project_details()`: Detalles de proyecto
- `get_projects_nearby()`: Proyectos cercanos
- `get_available_spots()`: Plazas disponibles

**matching_tools.py:**
- `calculate_match_score()`: Cálculo de score (0-100)
- `get_similar_users()`: Usuarios similares
- `get_common_projects()`: Proyectos en común
- `explain_match()`: Explicación detallada

**partner_tools.py:**
- Placeholder para futuras integraciones con empresas sostenibles

### 3. Agente LangGraph

**Flujo de trabajo:**
1. `analyze_profile`: Carga perfil y historial
2. `understand_intent`: Extrae criterios de búsqueda usando Gemini
3. `search_projects`: Busca proyectos candidatos
4. `calculate_matches`: Calcula scores de match
5. `rank_matches`: Re-ranking inteligente con Gemini
6. `generate_explanation`: Genera explicación natural
7. `handle_feedback`: Procesa feedback y refina

### 4. Integración Next.js

**API Route:** `src/app/api/agents/matching/route.ts`
- Proxy entre frontend y servidor MCP
- Manejo de autenticación
- Formateo de respuestas

**Componente Chat:** `src/components/MatchingAgentChat.tsx`
- Interfaz de chat conversacional
- Visualización de matches con explicaciones
- Sistema de feedback

**Página:** `src/app/matching/page.tsx`
- Página dedicada para el agente
- Instrucciones y tips
- Integración completa

## Configuración Requerida

### Variables de Entorno

**MCP Server (`mcp-server/.env`):**
```
GOOGLE_API_KEY=your_gemini_api_key
ECONEXO_API_URL=http://localhost:3000/api
MCP_SERVER_PORT=8001
```

**Next.js (`.env.local`):**
```
MCP_SERVER_URL=http://localhost:8001
```

## Instrucciones de Uso

### 1. Configurar Servidor MCP

```bash
cd mcp-server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp env.example .env
# Editar .env y agregar GOOGLE_API_KEY
```

### 2. Iniciar Servidor MCP

```bash
# Opción 1: Script de inicio
./start.sh

# Opción 2: Python directo
python -m src.server

# Opción 3: Uvicorn
uvicorn src.server:app --host 0.0.0.0 --port 8001
```

### 3. Iniciar Next.js

```bash
npm run dev
```

### 4. Acceder a la Aplicación

- Navegar a `http://localhost:3000/matching`
- O hacer clic en "Matching" en el header

## Características Implementadas

✅ Agente LangGraph con flujo completo
✅ Integración con Google Gemini
✅ Herramientas MCP para acceso a datos
✅ Cálculo de match scores inteligente
✅ Explicaciones detalladas de matches
✅ Sistema de refinamiento iterativo
✅ Interfaz de chat conversacional
✅ Visualización de matches con imágenes
✅ Sistema de feedback
✅ Integración completa con Next.js
✅ Preparación para integraciones futuras con partners

## Próximos Pasos

1. **Obtener API Key de Google Gemini:**
   - Visitar [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Crear nueva API key
   - Agregar a `mcp-server/.env`

2. **Probar el Sistema:**
   - Iniciar servidor MCP
   - Iniciar Next.js
   - Probar matching en `/matching`

3. **Integraciones Futuras:**
   - Implementar herramientas de partners en `partner_tools.py`
   - Agregar más fuentes de datos
   - Mejorar algoritmos de matching

## Empresas Sostenibles para Integración Futura

El sistema está preparado para integrar con:
- Ecosia (info@ecosia.org)
- GLS Bank (info@gls.de)
- Shopify (support@shopify.com)
- Good On You (contact@goodonyou.eco)
- EcoCart (hello@ecocart.io)
- Wren (hello@wren.co)
- CleanChoice Energy (support@cleanchoiceenergy.com)
- EarthHero (hello@earthhero.com)
- Fairphone (info@fairphone.com)
- Zero Waste Home

## Notas Técnicas

- El servidor MCP usa FastAPI para endpoints HTTP
- LangGraph maneja el flujo de trabajo del agente
- Google Gemini procesa lenguaje natural y re-ranking
- Las herramientas MCP hacen llamadas HTTP a APIs de EcoNexo
- El frontend usa React con TypeScript
- Todo está completamente tipado y documentado

## Troubleshooting

Ver `mcp-server/SETUP.md` y `mcp-server/README.md` para guías detalladas de troubleshooting.

