# smart-categorizer

Skill para analizar automáticamente descripciones de proyectos y eventos de EcoNexo y sugerir las categorías y etiquetas (tags) más adecuadas.

## Uso

Este skill optimiza la visibilidad de los proyectos al asegurar que estén correctamente clasificados para el Agente de Matching.

### Disparadores
- "¿En qué categorías debería estar el proyecto '[Nombre]'?"
- "Sugiere etiquetas para esta descripción: [Texto]"
- "Categoriza este nuevo evento automáticamente"

## Flujo de Trabajo

1.  **Extracción de Texto**: Analiza el título y la descripción del proyecto.
2.  **Mapeo de Palabras Clave**: Busca términos relacionados con las categorías oficiales de EcoNexo.
3.  **Sugerencia de Tags**: Genera etiquetas adicionales basadas en habilidades o impacto (ej. "Niños", "Reforestación", "Social").
4.  **Validación**: Compara con las categorías existentes para evitar duplicados.

## Herramientas

- `scripts/categorize_project.py`: Herramienta de análisis y categorización.

## Categorías Oficiales
- Medio ambiente
- Educación
- Salud
- Comunidad
- Océanos
- Alimentación
- Tecnología
