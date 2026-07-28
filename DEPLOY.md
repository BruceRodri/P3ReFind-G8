# Guía de Despliegue ReFind

## Arquitectura
- **Frontend**: Vercel (React/Vite) - Gratis
- **Backend**: Vercel (Node.js/Express) - Gratis
- **Base de datos**: Azure PostgreSQL Flexible Server (West US 3) - ~$12/mes

---

## Estado actual

### Base de datos Azure PostgreSQL (Creada)
- **Server**: refind-db.postgres.database.azure.com
- **Database**: refind
- **User**: postgres
- **Password**: admin
- **Region**: West US 3
- **SKU**: Standard_B1ms (Burstable)
- **Storage**: 32 GB

### Connection String
```
postgresql://postgres:admin@refind-db.postgres.database.azure.com:5432/refind?sslmode=require
```

### Datos de prueba insertados
| Usuario | Email | Password | Rol |
|---------|-------|----------|-----|
| Admin | admin@refind.com | 123456 | ADMIN |
| Juan Perez | juan@refind.com | 123456 | USUARIO |
| Maria Garcia | maria@refind.com | 123456 | USUARIO |
| Carlos Lopez | carlos@refind.com | 123456 | USUARIO |

- 8 objetos de prueba
- 5 comentarios
- 4 mensajes
- 3 notificaciones

---

## Pasos para desplegar

### 1. Subir código a GitHub
```cmd
cd C:\Users\WinterOS\Desktop\ReFind
git init
git add .
git commit -m "deploy: ReFind - Vercel + Azure PostgreSQL"
git remote add origin https://github.com/TU_USUARIO/refind.git
git push -u origin main
```

### 2. Desplegar Backend en Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Importa tu repo de GitHub
3. Configura:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Output Directory**: `.`
5. Agrega variables de entorno:
   ```
   DATABASE_URL=postgresql://postgres:admin@refind-db.postgres.database.azure.com:5432/refind?sslmode=require
   JWT_SECRET=refind_secret_key_2026
   ```
6. Click **Deploy**

### 3. Desplegar Frontend en Vercel
1. En Vercel, crea un nuevo proyecto
2. Importa el mismo repo de GitHub
3. Configura:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Agrega variables de entorno:
   ```
   VITE_API_URL=https://tu-backend.vercel.app
   ```
5. Click **Deploy`

### 4. Verificar
1. Abre la URL del frontend
2. Inicia sesión con admin@refind.com / 123456
3. Navega por la aplicación

---

## Costos

| Servicio | Costo |
|----------|-------|
| Vercel (Frontend) | Gratis |
| Vercel (Backend) | Gratis |
| Azure PostgreSQL B1MS | ~$12/mes |
| **Total** | **~$12/mes** |
