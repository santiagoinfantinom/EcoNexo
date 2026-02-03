# eco-badge-designer

Skill para diseñar y asignar insignias (badges) digitales a los voluntarios de EcoNexo en función de sus logros y contribuciones.

## Uso

Este skill permite automatizar el reconocimiento de los voluntarios mediante la asignación de insignias temáticas basadas en datos de participación.

### Disparadores
- "¿Qué insignias le corresponden a [Usuario]?"
- "Diseña una nueva insignia para el hito [Hito]"
- "Asigna la insignia de 'Protector del Océano' a los participantes de la limpieza de playa"

## Flujo de Trabajo

1.  **Evaluación de Hitos**: Analiza el historial del usuario (horas, tipo de proyectos).
2.  **Selección de Insignia**: Determina qué insignia corresponde (ej. Bronce, Plata, Oro por categoría).
3.  **Generación de Assets**: (Simulado) Provee el link o metadatos de la imagen de la insignia.
4.  **Registro**: Actualiza el perfil del usuario con la nueva insignia.

## Herramientas

- `scripts/manage_badges.py`: Gestión y asignación de insignias.

## Catálogo de Insignias (Ejemplos)

| ID | Nombre | Criterio |
|---|---|---|
| `ocean-guardian` | Protector del Océano | 3+ proyectos de Océanos |
| `forest-hero` | Héroe del Bosque | 3+ proyectos de Reforestación |
| `pioneer` | Eco-Pionero | Primer proyecto completado |
| `impact-master` | Maestro del Impacto | Impact Score > 90 |
