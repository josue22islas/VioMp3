# VioMp3 — Guía de instalación y deploy

## Estructura final del proyecto

```
viomp3/
├── backend/
│   ├── main.py
│   ├── routes/
│   │   └── convert.py
│   ├── requirements.txt
│   └── Procfile          ← para Railway/Render
│
└── frontend/
    ├── index.html
    ├── style.css
    ├── reactions.js
    ├── user_strict.js
    └── app.js            ← archivo que te entrego
```

---

## 1. Instalación local

### Requisitos del sistema
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install -y ffmpeg python3-pip

# macOS
brew install ffmpeg
```

### Instalar dependencias Python
```bash
cd backend/
pip install -r requirements.txt
```

### Correr el servidor
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

El API estará disponible en: http://localhost:8000

---

## 2. Integrar app.js en tu frontend

Agrega esta línea al final de tu `index.html`, justo antes de `</body>`:

```html
<script src="app.js"></script>
```

Asegúrate de que `API_BASE_URL` en `app.js` apunte a tu servidor:
```javascript
// Desarrollo local
const API_BASE_URL = "http://localhost:8000/api";

// Producción (ejemplo Railway)
const API_BASE_URL = "https://tu-app.up.railway.app/api";
```

---

## 3. Deploy en Railway

1. Crea un proyecto nuevo en https://railway.app
2. Sube el repositorio (solo la carpeta `backend/`)
3. Agrega un `Procfile` en la raíz:
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
4. En Variables de entorno de Railway NO necesitas nada extra
5. Railway detecta Python automáticamente con `requirements.txt`

> ⚠️ ffmpeg: Railway NO tiene ffmpeg por defecto.
> Agrega un `nixpacks.toml` en la raíz del backend:
> ```toml
> [phases.setup]
> nixPkgs = ["ffmpeg"]
> ```

---

## 4. Deploy en Render

1. Nuevo Web Service → conecta tu repo
2. Build Command: `pip install -r requirements.txt`
3. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. En "Environment" agrega:
   - `PYTHON_VERSION` = `3.11`
5. Para ffmpeg, agrega en Build Command:
   ```
   apt-get install -y ffmpeg && pip install -r requirements.txt
   ```

---

## 5. Endpoints disponibles

| Método | Ruta              | Descripción                        |
|--------|-------------------|------------------------------------|
| GET    | `/`               | Health check                       |
| GET    | `/api/info?url=…` | Título, duración, thumbnail        |
| POST   | `/api/convert`    | Convierte y devuelve el archivo    |

### Ejemplo POST /api/convert
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "format": "mp3",
  "quality": "best"
}
```

---

## 6. Mantenimiento importante

yt-dlp necesita actualizarse regularmente para evitar que YouTube lo bloquee:

```bash
# Manualmente
yt-dlp -U

# En Railway/Render: fija siempre la versión más reciente en requirements.txt
# y haz redeploy cuando salgan bloqueos
```

---

## 7. Prueba rápida con curl

```bash
# Info del video
curl "http://localhost:8000/api/info?url=https://youtu.be/dQw4w9WgXcQ"

# Convertir a MP3
curl -X POST http://localhost:8000/api/convert \
  -H "Content-Type: application/json" \
  -d '{"url":"https://youtu.be/dQw4w9WgXcQ","format":"mp3"}' \
  --output audio.mp3
```
