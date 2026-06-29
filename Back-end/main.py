from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.convert import router
import subprocess
import sys

app = FastAPI(title="VioMp3 API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://josue22islas.github.io",
        "http://localhost",
        "http://127.0.0.1",
    ],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    allow_credentials=False,
)

app.include_router(router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    """Actualiza yt-dlp al iniciar sin bloquear el servidor."""
    try:
        print("🔄 Actualizando yt-dlp...")
        result = subprocess.run(
            [sys.executable, "-m", "pip", "install", "-U", "yt-dlp"],
            capture_output=True,
            text=True,
            timeout=60  # máximo 60 segundos, no bloquea indefinidamente
        )
        if result.returncode == 0:
            print("✅ yt-dlp actualizado correctamente")
        else:
            print(f"⚠️ No se pudo actualizar: {result.stderr}")
    except Exception as e:
        print(f"⚠️ Error al actualizar yt-dlp: {e}")

@app.get("/")
def root():
    return {"status": "VioMp3 API corriendo"}
