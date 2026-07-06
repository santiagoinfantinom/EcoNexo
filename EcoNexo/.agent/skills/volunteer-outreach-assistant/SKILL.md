# volunteer-outreach-assistant

Asistente para redactar mensajes de invitación personalizados para voluntarios, analizando la afinidad entre su perfil y las necesidades de los proyectos.

## Uso

Este skill se usa para generar borradores de mensajes (email/chat) que los gestores de proyectos pueden usar para invitar a voluntarios específicos.

### Disparadores
- "Redacta un mensaje para invitar a [Usuario] al proyecto [Proyecto]"
- "Genera una invitación personalizada para voluntarios"
- "Necesito reclutar voluntarios para [Proyecto]"

## Flujo de Trabajo

1.  **Recolección de Datos**: Obtiene el perfil del voluntario y los detalles del proyecto.
2.  **Análisis de Afinidad**: Identifica puntos en común (habilidades, intereses, ubicación).
3.  **Generación de Mensaje**: Crea un borrador persuasivo y personalizado en el idioma del usuario.

## Herramientas

- `scripts/generate_outreach.py`: Script principal para generar el mensaje.

## Ejemplo de Salida

```markdown
Asunto: ¡Oportunidad de impacto en EcoNexo para ti, [Nombre]!

Hola [Nombre],

He visto tu perfil y me ha impresionado tu experiencia en [Habilidad]. Actualmente estamos buscando colaboradores para [Proyecto] en [Ubicación], y creo que encajarías perfectamente porque [Motivo de afinidad].

¿Te interesaría charlar brevemente sobre cómo podrías ayudarnos?

Saludos,
El equipo de EcoNexo
```
