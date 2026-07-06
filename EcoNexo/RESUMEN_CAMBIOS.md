# 📝 Resumen de Cambios - Últimas Horas

## 🔐 Corrección Crítica de Google OAuth
Se corrigió el problema de `redirect_uri_mismatch` en Google OAuth forzando que el código siempre use `window.location.origin` directamente desde el navegador justo antes de crear la URL de autorización, eliminando cualquier dependencia de caché o configuración previa que pudiera causar que se usara el dominio incorrecto (`econexo.app` en lugar del dominio de Vercel).

## 🔗 Links Clicables en Ofertas de Trabajo
Se agregaron enlaces clicables a los nombres de las empresas en las ofertas de trabajo: el nombre de la empresa ahora es un link verde que lleva directamente a LinkedIn, y se agregó un ícono de búsqueda (🔍) que permite buscar la empresa en Ecosia como alternativa ecológica a Google.

## 🐛 Correcciones Técnicas
Se corrigió un error de TypeScript en la página de eventos disponibles donde `spotsAvailable` podía ser `null`, se actualizó el Service Worker para forzar una actualización del caché, y se agregó logging adicional para facilitar el debugging del flujo de OAuth.

