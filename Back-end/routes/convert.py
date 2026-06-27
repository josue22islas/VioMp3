from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from pydantic import BaseModel
import yt_dlp, uuid, os, re, glob

router = APIRouter()

TMP_DIR = "/tmp/viomp3"
os.makedirs(TMP_DIR, exist_ok=True)

# ─── Modelos ────────────────────────────────────────────────────────────────

class ConvertRequest(BaseModel):
    url: str
    format: str   # "mp3" | "mp4"
    quality: str = "best"  # mp4: "best" | "720" | "480" | "360"

# ─── Helpers ────────────────────────────────────────────────────────────────

def is_valid_youtube_url(url: str) -> bool:
    pattern = r"^(https?://)?(www\.)?(youtube\.com/watch\?v=|youtu\.be/)[\w\-]{11}"
    return bool(re.match(pattern, url.strip()))

def delete_file(path: str):
    """Elimina el archivo tras servirse (llamado en background)."""
    try:
        # yt-dlp a veces agrega extensión extra; eliminamos cualquier variante
        for f in glob.glob(f"{path}*"):
            os.remove(f)
    except Exception:
        pass

# ─── Endpoints ──────────────────────────────────────────────────────────────

@router.get("/info")
async def get_video_info(url: str):
    """
    Devuelve metadata del video antes de convertir.
    Usado para mostrar título, thumbnail y duración en el frontend.
    """
    if not is_valid_youtube_url(url):
        raise HTTPException(status_code=400, detail="URL de YouTube inválida")

    ydl_opts = {
        "quiet": True,
        "no_warnings": True,
        "skip_download": True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            return {
                "title":     info.get("title", "Sin título"),
                "duration":  info.get("duration", 0),      # segundos
                "thumbnail": info.get("thumbnail", ""),
                "channel":   info.get("uploader", ""),
            }
    except yt_dlp.utils.DownloadError as e:
        raise HTTPException(status_code=422, detail=f"No se pudo obtener info: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado: {str(e)}")


@router.post("/convert")
async def convert_video(req: ConvertRequest, background_tasks: BackgroundTasks):
    """
    Convierte el video y responde con el archivo para descarga.
    El archivo se elimina del servidor tras servirse.
    """
    if not is_valid_youtube_url(req.url):
        raise HTTPException(status_code=400, detail="URL de YouTube inválida")

    if req.format not in ("mp3", "mp4"):
        raise HTTPException(status_code=400, detail="Formato debe ser 'mp3' o 'mp4'")

    file_id   = str(uuid.uuid4())
    base_path = f"{TMP_DIR}/{file_id}"

    # ── Opciones por formato ────────────────────────────────────────────────

    if req.format == "mp3":
        ydl_opts = {
            "format": "bestaudio/best",
            "outtmpl": f"{base_path}.%(ext)s",
            "postprocessors": [{
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "192",
            }],
            "quiet": True,
            "no_warnings": True,
        }
        final_path  = f"{base_path}.mp3"
        filename    = "audio.mp3"
        media_type  = "audio/mpeg"

    else:  # mp4
        quality_map = {
            "best": "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
            "720":  "bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720]",
            "480":  "bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/best[height<=480]",
            "360":  "bestvideo[height<=360][ext=mp4]+bestaudio[ext=m4a]/best[height<=360]",
        }
        ydl_opts = {
            "format": quality_map.get(req.quality, quality_map["best"]),
            "outtmpl": f"{base_path}.%(ext)s",
            "merge_output_format": "mp4",
            "quiet": True,
            "no_warnings": True,
        }
        final_path  = f"{base_path}.mp4"
        filename    = "video.mp4"
        media_type  = "video/mp4"

    # ── Descarga + conversión ───────────────────────────────────────────────

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([req.url])
    except yt_dlp.utils.DownloadError as e:
        raise HTTPException(status_code=422, detail=f"Error al descargar: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado: {str(e)}")

    if not os.path.exists(final_path):
        raise HTTPException(status_code=500, detail="El archivo no se generó correctamente")

    # Eliminar el archivo del servidor tras enviarse
    background_tasks.add_task(delete_file, base_path)

    return FileResponse(
        path=final_path,
        filename=filename,
        media_type=media_type,
    )
