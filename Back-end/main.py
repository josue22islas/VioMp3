from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.convert import router
import subprocess
import sys

def update_yt_dlp():
    """Actualiza yt-dlp al iniciar el servidor para evitar bloqueos de YouTube."""
    try:
        print("🔄 Actualizando yt-dlp...")
        result = subprocess.run(
            [sys.executable, "-m", "pip", "install", "-U", "yt-dlp"],
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            print("✅ yt-dlp actualizado correctamente")
        else:
            print(f"⚠️ No se pudo actualizar yt-dlp: {result.stderr}")
    except Exception as e:
        print(f"⚠️ Error al actualizar yt-dlp: {e}")

# Actualizar yt-dlp antes de iniciar
update_yt_dlp()

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

@app.get("/")
def root():
    return {"status": "VioMp3 API corriendo"}
