📄 DOCUMENTO 2: PLAN DE TRABAJO Y AJUSTES DEL FRONTEND

Este documento recopila las tareas de integración en la aplicación web para conectar la IA y reparar la visualización de las causas mediante CSS.
Tarea 1: Conexión de la pantalla de Matching con Hugging Face

    Localizar el archivo en la ruta: src/app/matching/page.tsx.

    Sustituir la lógica local de puntajes estáticos por el consumo de la API mediante la función fetch() apuntando al endpoint de Hugging Face. (Nota: El código completo para este archivo es el que te proporcioné en el mensaje anterior, el cual incluye los hooks useState y useEffect sincronizados con el contexto del usuario).

Tarea 2: Corrección del Scroll en la Página Inicial (Home)

Cuando el contenedor raíz tiene restricciones de viewport estrictas, bloquea el scroll del mouse impidiendo ver las causas del fondo.

Procedimiento de reparación:

    Abre tu VS Code y busca el archivo: src/app/page.tsx (Página principal del Home).

    Inspecciona la etiqueta constructora superior que envuelve el layout (el primer div dentro del return).

    Cambio Crítico: Identifica si tiene la clase h-screen o max-h-screen y reemplázala por min-h-screen.

    Elimina la clase overflow-hidden si existiese. En su defecto, añade overflow-y-auto para asegurar que el navegador habilite la barra vertical de desplazamiento.

Ejemplo de estructura corregida con Tailwind:
TypeScript

export default function HomePage() {
  return (
    // Corrección aplicada en la clase contenedora principal
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-y-auto">
      
      {/* Tu Navbar Component */}
      {/* Tu Hero Banner Section */}
      
      {/* Sección de Causas: Ahora visible mediante scroll */}
      <section className="py-12 max-w-7xl mx-auto px-4">
        {/* Componentes o iteración de causas */}
      </section>

    </div>
  );
}