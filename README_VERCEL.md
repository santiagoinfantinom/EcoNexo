# 🚀 Configuración Automática de Vercel para EcoNexo

## Script Automático

He creado un script que facilita el proceso de conectar el repositorio correcto en Vercel.

### Uso Rápido

```bash
./setup-vercel.sh
```

El script:
- ✅ Verifica que todo esté configurado correctamente
- ✅ Verifica el repositorio y branch correctos
- ✅ Instala Vercel CLI si es necesario
- ✅ Te guía a través del proceso
- ✅ Opcionalmente conecta el proyecto usando Vercel CLI

### Qué Hace el Script

1. **Verificaciones Automáticas:**
   - Verifica que estés en el directorio correcto
   - Verifica que el repositorio Git esté configurado
   - Verifica que el repositorio remoto sea el correcto
   - Verifica que el branch `2025-11-03-ol3k-5a7de` exista
   - Verifica que los archivos de configuración estén presentes

2. **Instalación de Vercel CLI:**
   - Intenta instalar Vercel CLI localmente
   - O te indica cómo instalarlo globalmente

3. **Conexión del Proyecto:**
   - Opcionalmente usa Vercel CLI para conectar el proyecto
   - Te guía a través de la autenticación
   - Linkea el proyecto con Vercel

4. **Deploy:**
   - Opcionalmente inicia un deploy después de conectar

### Pasos Manuales (Si Prefieres)

Si prefieres hacerlo manualmente, el script también te muestra los pasos exactos:

1. Ve a: https://vercel.com/santiagoinfantinoms-projects/econexo
2. Settings → Git → Disconnect
3. Connect Git Repository → `santiagoinfantinom/EcoNexo`
4. Selecciona branch: `2025-11-03-ol3k-5a7de`
5. Configura variables de entorno
6. Deploy

### Variables de Entorno Necesarias

Cuando configures el proyecto en Vercel, asegúrate de agregar:

```
NEXT_PUBLIC_SITE_URL=https://econexo.io
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=econexo.io
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_de_supabase
```

### Troubleshooting

**Si el script falla:**
- Verifica que tengas acceso a Git
- Verifica que el repositorio remoto esté configurado
- Verifica que el branch exista

**Si Vercel CLI no funciona:**
- Puedes hacerlo manualmente siguiendo los pasos que muestra el script
- O usar la interfaz web de Vercel

### Documentación Adicional

- `VERCEL_PASO_A_PASO.md` - Guía detallada paso a paso
- `VERCEL_FIX.md` - Instrucciones de fix del problema
- `DEPLOYMENT_FIX.md` - Información general de deployment

---

**¡Listo!** Ejecuta `./setup-vercel.sh` para empezar. 🎉

