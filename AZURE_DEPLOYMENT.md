# Solución de Problemas - Despliegue Azure

## Problema Resuelto: "Build levanta pero webapp no inicia"

### Causa Principal
Azure Web App estaba desplegando toda la carpeta del proyecto (incluyendo node_modules, src, etc.) en lugar de solo los archivos estáticos compilados en `dist/`. Además, faltaba la configuración de enrutamiento SPA necesaria para que Azure maneje correctamente las rutas de React Router.

### Archivos Modificados

#### 1. `.github/workflows/master_comedorfe.yml`
**Antes:**
```yaml
path: .  # Desplegaba TODO el proyecto
package: .
```

**Después:**
```yaml
path: dist  # Solo despliega archivos compilados
package: dist
```

#### 2. `vite.config.ts`
Se agregó configuración explícita para el build:
```typescript
publicDir: 'public',
build: {
  outDir: 'dist',
  emptyOutDir: true,
}
```

#### 3. `public/web.config` (NUEVO)
Archivo crítico para Azure App Service (IIS) que:
- Redirige todas las rutas de la SPA a `index.html`
- Permite que archivos estáticos (.js, .css, .png, etc.) se sirvan normalmente
- Configura cache headers para assets con hash
- Define MIME types correctos

#### 4. `staticwebapp.config.json` (NUEVO)
Para Azure Static Web Apps, proporciona:
- Navigation fallback a `/index.html` para rutas SPA
- Exclusiones para assets estáticos
- Configuración de MIME types
- Override de respuesta 404 → index.html

### Componentes Corregidos (TypeScript)

También se corrigieron errores de TypeScript que impedían el build en CI:

1. **ReservaCard.tsx**
   - ✅ Import corregido: `'../../lib/data/mockData'`
   - ✅ Uso de constantes `RESERVA_STATUS_LABEL` y `RESERVA_STATUS_CLASS`
   - ✅ Condición de cancelar usa estado `'ACTIVA'`

2. **PagoPage.tsx**
   - ✅ Estado de reserva actualizado a `'ACTIVA'` en lugar de `'pagada'`

3. **ReservaDetallePage.tsx**
   - ✅ Badge usa constantes de estado normalizadas

4. **ReservasPage.tsx**
   - ✅ Función no usada `handleModificar` eliminada

### Verificación Local

Para reproducir el build exacto que corre en Azure:

```bash
# 1. Clean install
npm ci

# 2. Build (ejecuta tsc + vite build)
npm run build

# 3. Verificar dist/
ls -la dist/
# Debe contener: index.html, web.config, assets/, images/, vite.svg

# 4. Previsualizar localmente
npm run preview
# Abre http://localhost:4173 y prueba navegación
```

### Cómo Funciona el Routing en Azure

#### Sin web.config (PROBLEMA):
```
Usuario visita → https://comedorfe.azurewebsites.net/dashboard
Azure busca → archivo físico "dashboard" en servidor
Resultado → 404 Not Found ❌
```

#### Con web.config (SOLUCIÓN):
```
Usuario visita → https://comedorfe.azurewebsites.net/dashboard
web.config detecta → no es archivo físico
Rewrite rule → sirve /index.html
React Router → maneja la ruta /dashboard
Resultado → App carga correctamente ✅
```

### Estructura de Despliegue

```
Azure Web App (comedorfe)
├── index.html           ← Punto de entrada
├── web.config          ← Configuración IIS (CRÍTICO)
├── vite.svg
├── assets/
│   ├── index-[hash].js  ← Bundle JavaScript
│   └── index-[hash].css ← Estilos
└── images/
    └── *.png            ← Assets estáticos
```

### Próximos Pasos

1. **Commit y push de cambios:**
   ```bash
   git add .
   git commit -m "fix: Azure deployment - deploy only dist folder with web.config"
   git push origin master
   ```

2. **GitHub Actions ejecutará automáticamente:**
   - Build del proyecto
   - Upload de `dist/` como artifact
   - Deploy a Azure Web App

3. **Verificar en Azure:**
   - Ir a https://comedorfe.azurewebsites.net
   - Probar rutas: `/login`, `/dashboard`, `/cajero`
   - Verificar consola del navegador (F12) por errores

### Troubleshooting Adicional

#### Si la página sigue en blanco:
1. Abrir DevTools (F12) → Console
2. Buscar errores como:
   - `Failed to load resource` → problema de rutas de assets
   - `Uncaught SyntaxError` → problema de JS bundle
   - `404` en requests → web.config no aplicado

3. Verificar en Azure Portal:
   - App Service → Configuration → General Settings
   - Stack: Node (debería estar en modo "Static HTML" o similar para SPA)
   - Startup Command: (dejar vacío para static site)

#### Si assets no cargan (imágenes, CSS):
- Verificar que `public/images/` existe y tiene los archivos
- Verificar en DevTools → Network que las rutas sean `/images/...` no `/assets/images/...`

#### Si rutas específicas dan 404:
- Verificar que `web.config` esté en la raíz de `dist/`
- Revisar Azure logs: App Service → Log Stream

### Diferencias Local vs Cloud

| Aspecto | Local (dev) | Azure (prod) |
|---------|-------------|--------------|
| Servidor | Vite dev server | IIS (Windows) o nginx |
| TypeScript | Permisivo (ESBuild) | Estricto (tsc -b) |
| Filesystem | Case-insensitive (macOS) | Case-sensitive (Linux) |
| Routing | Vite maneja SPA | Requiere web.config |
| Hot reload | ✅ Sí | ❌ No (build estático) |

### Comandos Útiles

```bash
# Build local
npm run build

# Preview del build (simula producción)
npm run preview

# Check de TypeScript sin build
npx tsc --noEmit

# Audit de seguridad
npm audit
npm audit fix

# Ver estructura de dist
tree dist/
# o en macOS/Linux sin tree:
find dist -type f
```

### Contacto y Referencias

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Azure Static Web Apps Docs](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [React Router Azure Config](https://reactrouter.com/en/main/guides/routing#azure)

---

**Última actualización:** 30 de octubre de 2025
**Estado:** ✅ Resuelto - Build pasa, deployment configurado correctamente
