# 🔍 Cómo Encontrar "Test Users" en Google Cloud Console

## ✅ Solución: Usar "Audience" en Google Auth Platform

Google ha reorganizado la interfaz. "Test users" ahora está en **"Audience"** dentro de **"Google Auth Platform"**.

### Pasos:

1. **Ve a Google Cloud Console:**
   - https://console.cloud.google.com/
   - Asegúrate de que el proyecto seleccionado sea **"EcoNexo"**

2. **En el sidebar izquierdo, busca "Google Auth Platform":**
   - Si no lo ves directamente, haz clic en el menú hamburguesa (☰)
   - Busca "Google Auth Platform" o "Auth"

3. **Haz clic en "Audience":**
   - En el sidebar izquierdo, dentro de "Google Auth Platform", verás:
     - Overview
     - Branding
     - **Audience** ← Haz clic aquí
     - Clients
     - Data access
     - Verification centre
     - Settings

4. **En la página "Audience", busca "Test users":**
   - Deberías ver una sección llamada **"Test users"** o **"Usuarios de prueba"**
   - Haz clic en **"+ ADD USERS"** o **"AGREGAR USUARIOS"**

5. **Agrega tu email:**
   - Ingresa: `santiago.infantino.moreno@gmail.com`
   - Haz clic en **"ADD"** o **"AGREGAR"**
   - Guarda los cambios

## 🔄 Alternativa: Desde "Settings"

Si no encuentras "Test users" en "Audience", también puede estar en:

1. **Google Auth Platform** → **"Settings"**
2. Busca la sección **"Test users"** o **"Testing"**

## 📍 Ubicación Visual Esperada

```
Google Cloud Console
├── Google Auth Platform
    ├── Overview
    ├── Branding
    ├── Audience  ← AQUÍ está "Test users"
    │   └── Test users
    │       └── + ADD USERS
    ├── Clients
    ├── Data access
    ├── Verification centre
    └── Settings
```

## ⚠️ Si No Ves "Audience"

Si no ves la opción "Audience" en el sidebar:

1. **Verifica que estés en el proyecto correcto:**
   - Arriba a la izquierda debe decir "EcoNexo"

2. **Intenta buscar directamente:**
   - En la barra de búsqueda superior, escribe: `test users`
   - O escribe: `audience`

3. **Usa el menú hamburguesa:**
   - Haz clic en ☰ (menú hamburguesa)
   - Busca "Google Auth Platform" o "Auth"
   - Expande el menú y busca "Audience"

## ✅ Una Vez que Encuentres "Test Users"

1. Haz clic en **"+ ADD USERS"**
2. Agrega: `santiago.infantino.moreno@gmail.com`
3. Haz clic en **"ADD"**
4. Guarda los cambios
5. Espera 1-2 minutos para que Google aplique los cambios

## 🎯 Resumen

**Ubicación actual:** `Google Auth Platform` → `Audience` → `Test users`

**No está en:** `APIs & Services` → `OAuth consent screen` (interfaz antigua)

