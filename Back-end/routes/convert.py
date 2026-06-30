from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from pydantic import BaseModel
import yt_dlp, uuid, os, re, glob, requests
from mutagen.mp3 import MP3
from mutagen.id3 import ID3, APIC, TIT2, TPE1, error as ID3Error

router = APIRouter()

TMP_DIR      = "/tmp/viomp3"
DEFAULT_COVER = "/app/default_cover.png"
os.makedirs(TMP_DIR, exist_ok=True)

# ─── Modelos ──────────────────────────────────────────────────────────────────

class ConvertRequest(BaseModel):
    url: str
    format: str
    quality: str = "best"

# ─── Helpers ──────────────────────────────────────────────────────────────────

def is_valid_youtube_url(url: str) -> bool:
    pattern = r"(youtube\.com/watch\?v=|youtu\.be/)[\w\-]{11}"
    return bool(re.search(pattern, url.strip()))

def delete_file(path: str):
    try:
        for f in glob.glob(f"{path}*"):
            os.remove(f)
    except Exception:
        pass

def embed_cover_mp3(mp3_path: str, thumbnail_url: str, title: str, artist: str):
    """Incrusta la carátula y metadata en el MP3."""
    try:
        # Descargar thumbnail del video
        cover_data = None
        if thumbnail_url:
            try:
                res = requests.get(thumbnail_url, timeout=10)
                if res.status_code == 200:
                    cover_data = res.content
            except Exception:
                pass

        # Si no hay thumbnail, usar logo por default
        if not cover_data and os.path.exists(DEFAULT_COVER):
            with open(DEFAULT_COVER, "rb") as f:
                cover_data = f.read()

        # Incrustar en el MP3
        audio = MP3(mp3_path, ID3=ID3)

        try:
            audio.add_tags()
        except ID3Error:
            pass  # ya tiene tags

        # Título y artista
        audio.tags["TIT2"] = TIT2(encoding=3, text=title)
        audio.tags["TPE1"] = TPE1(encoding=3, text=artist)

        # Carátula
        if cover_data:
            audio.tags["APIC"] = APIC(
                encoding=3,
                mime="image/jpeg",
                type=3,       # 3 = Cover (front)
                desc="Cover",
                data=cover_data,
            )

        audio.save()
        print(f"✅ Carátula incrustada en {mp3_path}")

    except Exception as e:
        print(f"⚠️ No se pudo incrustar carátula: {e}")

# ─── Endpoints ────────────────────────────────────────────────────────────────

@router.get("/info")
async def get_video_info(url: str):
    if not is_valid_youtube_url(url):
        raise HTTPException(status_code=400, detail="URL de YouTube inválida")

    ydl_opts = {"quiet": True, "no_warnings": True, "skip_download": True}

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            return {
                "title":     info.get("title", "Sin título"),
                "duration":  info.get("duration", 0),
                "thumbnail": info.get("thumbnail", ""),
                "channel":   info.get("uploader", ""),
            }
    except yt_dlp.utils.DownloadError as e:
        raise HTTPException(status_code=422, detail=f"No se pudo obtener info: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado: {str(e)}")


@router.post("/convert")
async def convert_video(req: ConvertRequest, background_tasks: BackgroundTasks):
    if not is_valid_youtube_url(req.url):
        raise HTTPException(status_code=400, detail="URL de YouTube inválida")

    if req.format not in ("mp3", "mp4"):
        raise HTTPException(status_code=400, detail="Formato debe ser 'mp3' o 'mp4'")

    file_id   = str(uuid.uuid4())
    base_path = f"{TMP_DIR}/{file_id}"

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
        final_path = f"{base_path}.mp3"
        media_type = "audio/mpeg"

    else:
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
        final_path = f"{base_path}.mp4"
        media_type = "video/mp4"

    # Obtener info del video (para thumbnail y metadata)
    video_info = {}
    try:
        ydl_info_opts = {"quiet": True, "no_warnings": True, "skip_download": True}
        with yt_dlp.YoutubeDL(ydl_info_opts) as ydl:
            video_info = ydl.extract_info(req.url, download=False)
    except Exception:
        pass

    # Descargar y convertir
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([req.url])
    except yt_dlp.utils.DownloadError as e:
        raise HTTPException(status_code=422, detail=f"Error al descargar: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado: {str(e)}")

    if not os.path.exists(final_path):
        raise HTTPException(status_code=500, detail="El archivo no se generó correctamente")

    # Incrustar carátula solo en MP3
    if req.format == "mp3":
        embed_cover_mp3(
            mp3_path      = final_path,
            thumbnail_url = video_info.get("thumbnail", ""),
            title         = video_info.get("title", ""),
            artist        = video_info.get("uploader", ""),
        )

    filename = f"{video_info.get('title', 'audio')}.mp3" if req.format == "mp3" else f"{video_info.get('title', 'video')}.mp4"
    filename = re.sub(r'[\\/:*?"<>|]', "", filename)

    background_tasks.add_task(delete_file, base_path)

    return FileResponse(
        path=final_path,
        filename=filename,
        media_type=media_type,
    )
