# Estructura del repositorio

Este archivo ofrece un árbol organizado del workspace (resumen por carpetas y archivos representativos). Incluye las carpetas principales y ejemplos de archivos dentro de cada una.

Nota: el repo contiene muchos artefactos generados (p.ej. `.netlify/`, `public/` con muchas imágenes). Aquí se prioriza claridad estructural sobre listar todos los archivos generados uno a uno.

-- raíz
- AGENTS.md
- README.md
- README.es.md
- README.en.md
- LICENSE
- package.json
- package-lock.json
- env.example
- vercel.json
- Makefile
- .gitignore

- .agent/
  - skills/                      # carpetas de skills internas (varias, p.ej. prompt-engineering, remotion, etc.)

- .netlify/
  - functions-internal/          # build y funciones generadas por Netlify
  - edge-functions/
  - static/                      # assets estáticos generados
  - deploy/

- public/
  - logo-econexo.png
  - logo-icon-v3.png
  - icon-512.png
  - manifest.json
  - projects/                     # muchas imágenes de proyectos
  - events/                       # imágenes de eventos
  - assets/

- android/
  - app/                          # código y recursos Android (ic_launcher, splash, etc.)
  - gradle/
  - gradlew

- ios/
  - App/                          # Xcode project, assets, Info.plist

- mcp-server/
  - src/
    - agent/
    - tools/                       # classification_tools.py, user_tools.py, etc.
  - server.log
  - requirements.txt
  - SETUP.md

- supabase/
  - migrations/
  - seed_capitals.sql
  - COMPLETE_SETUP.sql

- src/                            # aplicación Next.js / frontend
  - app/
    - api/                        # rutas API (events, profiles, projects, push, auth, etc.)
    - pages/                      # app routes (calendario, eventos, proyectos...)
  - components/                    # React/TSX components
  - lib/                           # utilitarios (supabaseClient, i18n, analytics, auth)
  - context/
  - data/                          # data fixtures (projects, events, languages)

- scripts/
  - fill_project_kpis.js
  - automate_kpis_update.js
  - seed-2026-events.ts
  - generate_project_index.js
  - tmp_projects.js
  - .kpi_update_state.json

- execution/                       # scripts Python determinísticos (Layer 3 en arquitectura)
  - generate_all_europe_capitals.py
  - fix_project_urls.py
  - check_project_images.py
  - prepare_kb.py
  - README.md

- docs/                            # documentación adicional
  - frontend.md
  - infrastructura-ia.md
  - SOCIAL_FEATURES.md
  - knowledge/

- scripts y utilidades sueltas
  - check_urls.py
  - check_images.js
  - check_fetch.js
  - fix_images.js
  - fix_image_paths.js
  - audit_images.js
  - report_duplicates.js

- imágenes y procesamiento (scripts Python)
  - extract_logo.py
  - extract_logo_3.py
  - crop_logo.py
  - process_logo.py
  - refine_logo.py
  - rotate_logo.py

- OAuth / autenticación (guías y utilidades)
  - OAUTH_SETUP.md
  - GOOGLE_OAUTH_SETUP.md
  - CONFIGURAR_GOOGLE_OAUTH.md
  - SUPABASE_OAUTH_SETUP.md
  - SOLUCION_RAPIDA_OAUTH.md

- despliegue & configuración
  - deploy.sh
  - deploy-production.sh
  - setup-vercel.sh
  - setup.sh
  - README_VERCEL.md
  - DEPLOYMENT.md
  - DEPLOYMENT_CHECKLIST.md

- integraciones y guías específicas
  - AZURE_SETUP_GUIDE.md
  - OUTLOOK_OAUTH_SETUP_GUIDE.md
  - SETUP_SMTP.md
  - GITHUB_PAGES_SETUP.md

- internacionalización / traducciones
  - fr_progress.json
  - smart-fix-translations.sh
  - smart-fix-translations-v2.sh

- otros recursos importantes
  - DIRECTIVES/                       # `directives/` contiene SOPs (ver `directives/README.md`)
  - STRUCTURE.md                      # (este archivo)

--- Notas finales
- El repo incluye carpetas con archivos generados por builds y despliegues (`.netlify/`, `public/`, `.netlify/functions-internal/`) que contienen muchos ficheros; no los desplacé ni eliminé.
- Si deseas, puedo:
  - Crear un árbol completo y literal (`tree -a`) dentro de `STRUCTURE_FULL.md` (archivo muy grande). 
  - Generar `README-STRUCTURE.md` con la misma organización pero más detalle por subcarpeta.
  - Exportar la lista completa de archivos a `STRUCTURE.csv`.

Si quieres que agregue el árbol completo literal (todo el listado de archivos), dime y lo genero en `STRUCTURE_FULL.md`.
