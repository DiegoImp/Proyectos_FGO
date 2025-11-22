# PRUEBAS CON LIVE SERVER - PRE-DEPLOY

## Estado Actual

- ✅ HTMLs movidos a raíz del proyecto
- ✅ Carpeta templates/ eliminada
- ✅ Rutas actualizadas en todos los archivos
- ✅ Caracteres corruptos eliminados
- ✅ GitHub Actions configurado con secrets
- ✅ .gitignore actualizado

## Estructura del Proyecto

```
📦 Proyectos_FGO/
├── 📄 index.html              ← Página principal
├── 📄 mis-servants.html
├── 📄 calculadora.html
├── 📄 fgodle.html
├── 📄 tierlist.html
├── 📄 base.html
│
├── 📁 static/
│   ├── 📄 main.js             ← Controlador principal
│   ├── 📁 css/
│   ├── 📁 js/
│   │   ├── config.js          ← NECESITAS CREAR ESTE ARCHIVO
│   │   ├── config.example.js
│   │   └── modules/
│   ├── 📁 data/
│   ├── 📁 classes/
│   └── 📁 icons/
│
├── 📁 .github/
│   └── workflows/
│       └── deploy.yml         ← GitHub Actions configurado
│
└── 📄 .gitignore              ← config.js excluido
```

---

## PASO 1: Crear config.js (Temporal para pruebas)

**Crea el archivo:** `static/js/config.js`

**Contenido:**

```javascript
/**
 * Config temporal para pruebas locales
 * Este archivo NO se sube a GitHub (está en .gitignore)
 * En producción, GitHub Actions lo genera desde Secrets
 */
export const CONFIG = {
  SUPABASE_URL: "TU_SUPABASE_URL",
  SUPABASE_ANON_KEY: "TU_SUPABASE_ANON_KEY",
  API_BASE_URL: window.location.origin,
};
```

**Reemplaza con tus credenciales:**

1. Ve a tu proyecto en Supabase Dashboard
2. Settings → API
3. Copia `URL` y `anon/public key`

---

## PASO 2: Iniciar Live Server

### Opción A: Desde VS Code

1. Instalar extensión "Live Server" (Ritwick Dey)
2. Click derecho en `index.html`
3. Seleccionar "Open with Live Server"

### Opción B: Desde Terminal

```powershell
# Usando Python (puerto 8000)
python -m http.server 8000

# O usando Node.js (instalar primero)
npx live-server
```

**URL de prueba:** `http://localhost:8000/index.html`

---

## PASO 3: Checklist de Pruebas

### ✅ Navegación

- [ ] Página principal carga correctamente
- [ ] Sidebar se muestra con todos los enlaces
- [ ] Click en "Mis Servants" navega correctamente
- [ ] Click en "Calculadora" navega correctamente
- [ ] Click en "FGOdle" navega correctamente
- [ ] Click en "Tier List" navega correctamente
- [ ] El enlace activo se resalta correctamente

### ✅ Recursos Estáticos

- [ ] Los estilos CSS se cargan (sidebar visible)
- [ ] Los iconos se muestran correctamente
- [ ] Las imágenes de clases (Saber, Archer, etc.) cargan
- [ ] No hay errores 404 en la consola del navegador

### ✅ Funcionalidad JavaScript

- [ ] El buscador de servants funciona
- [ ] Los filtros (clase, rareza, NP) funcionan
- [ ] Las tarjetas de servants se renderizan
- [ ] No hay errores en la consola del navegador

### ✅ Autenticación Supabase

- [ ] Click en "Iniciar Sesión" abre el modal
- [ ] Registro de nuevo usuario funciona
- [ ] Login con credenciales funciona
- [ ] Logout funciona correctamente
- [ ] El botón cambia de "Iniciar Sesión" a nombre de usuario

### ✅ Servants (requiere login)

- [ ] En "Mis Servants" se muestran los servants guardados
- [ ] Botón "Agregar" funciona en página principal
- [ ] Los servants agregados aparecen en "Mis Servants"

---

## PASO 4: Verificar Consola del Navegador

Abre DevTools (F12) y verifica:

### ✅ Sin Errores Críticos

```
❌ BAD: Failed to load resource: net::ERR_FILE_NOT_FOUND
❌ BAD: Uncaught SyntaxError: Cannot use import statement outside a module
❌ BAD: CORS error

✅ GOOD: Supabase inicializado desde config.js
✅ GOOD: Renderizados 457 servants
✅ GOOD: Usuario autenticado
```

### ✅ Network Tab

- Todos los recursos deben cargar con status 200
- `static/css/variables.css` → 200 OK
- `static/main.js` → 200 OK
- `static/js/config.js` → 200 OK
- `static/data/main_page_servants.json` → 200 OK

---

## PASO 5: Pruebas de Rutas

### ✅ Verifica URLs en navegador

```
✅ http://localhost:8000/index.html
✅ http://localhost:8000/mis-servants.html
✅ http://localhost:8000/calculadora.html
✅ http://localhost:8000/fgodle.html
✅ http://localhost:8000/tierlist.html
```

### ✅ Verifica rutas de assets

```
✅ http://localhost:8000/static/css/reset.css
✅ http://localhost:8000/static/main.js
✅ http://localhost:8000/static/data/main_page_servants.json
```

---

## PROBLEMAS COMUNES

### 🔴 Problema: "Cannot use import statement outside a module"

**Solución:** Verifica que los scripts tengan `type="module"`

```html
<script type="module" src="static/main.js"></script>
```

### 🔴 Problema: "Failed to load resource: static/js/config.js"

**Solución:** Crear el archivo `static/js/config.js` (ver Paso 1)

### 🔴 Problema: CORS error al hacer fetch

**Solución:** Usar Live Server o Python HTTP Server, NO abrir HTML directamente (file://)

### 🔴 Problema: Supabase no inicializa

**Solución:** Verificar credenciales en `config.js` y que el script Supabase CDN carga

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

### 🔴 Problema: Imágenes de servants no cargan

**Solución:** Las URLs de servants vienen del JSON, verificar que sean válidas

---

## PASO 6: Si Todo Funciona Correctamente

**¡LISTO PARA GITHUB PAGES!**

Ejecuta estos comandos:

```powershell
# 1. Verificar estado
git status

# 2. Agregar cambios
git add .

# 3. Commit
git commit -m "chore: restructure for GitHub Pages deploy"

# 4. Push
git push origin main
```

**Próximos pasos después del push:**

1. Configurar Secrets en GitHub
2. Activar GitHub Pages
3. Esperar a que el Action se ejecute
4. Visitar tu sitio en GitHub Pages

---

## CONFIGURAR SECRETS EN GITHUB

**Después de que funcione localmente:**

1. Ve a tu repositorio en GitHub
2. `Settings` → `Secrets and variables` → `Actions`
3. Click `New repository secret`

**Agrega estos 2 secrets:**

**Secret 1:**

- Name: `SUPABASE_URL`
- Value: `https://tu-proyecto.supabase.co`

**Secret 2:**

- Name: `SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (tu anon key completa)

---

## ACTIVAR GITHUB PAGES

1. Ve a `Settings` → `Pages`
2. Source: **"GitHub Actions"** (NO "Deploy from a branch")
3. Save

**El workflow automáticamente:**

- Detectará el push a `main`
- Generará `config.js` desde los Secrets
- Desplegará el sitio

**URL final:** `https://tu-usuario.github.io/Proyectos_FGO/`

---

## RESUMEN

- ✅ Proyecto reestructurado para GitHub Pages
- ✅ Todas las rutas actualizadas
- ✅ GitHub Actions configurado con Secrets
- ⏳ **PENDIENTE:** Probar con Live Server (HAZLO TÚ)
- ⏳ **PENDIENTE:** Configurar Secrets en GitHub
- ⏳ **PENDIENTE:** Push y activar GitHub Pages

**Cuando todo funcione localmente, avísame para continuar con el deploy.** 🚀
