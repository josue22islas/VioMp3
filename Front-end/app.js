/**
 * VioMp3 — Conexión Frontend → Backend
 * Pega este <script> al final de tu index.html, justo antes de </body>
 *
 * Cambia API_BASE_URL por la URL de tu servidor cuando hagas deploy.
 */

const API_BASE_URL = "https://viomp3-production.up.railway.app/api"; // ← cambia esto en producción

// ─── Estado ──────────────────────────────────────────────────────────────────

let selectedFormat = "mp3"; // valor por defecto (el botón MP3 ya está activo en el diseño)

// ─── Referencias al DOM (IDs exactos del HTML exportado de Figma) ─────────────

const urlInput     = document.getElementById("_input_type_text_");
const btnMP3       = document.getElementById("MP3");
const btnMP4       = document.getElementById("MP4");
const btnConvert   = document.getElementById("Button-Convert");
const btnLabel     = document.querySelector("#I5_122_5_107 span"); // texto del botón

// ─── Selección de formato ─────────────────────────────────────────────────────

btnMP3.addEventListener("click", () => { selectedFormat = "mp3"; });
btnMP4.addEventListener("click", () => { selectedFormat = "mp4"; });

// ─── Conversión ───────────────────────────────────────────────────────────────

btnConvert.addEventListener("click", async () => {
  const url = urlInput.value.trim();

  if (!url) {
    showMessage("⚠️ Pega un enlace de YouTube primero.", "warn");
    // Recargar la página después de 2 segundos
setTimeout(() => {
  location.reload();
}, 2000);
    return;
  }

  // Deshabilitar botón mientras procesa
  setLoading(true);

 try {
    // 1. Obtener el título del video
    const infoRes = await fetch(`${API_BASE_URL}/info?url=${encodeURIComponent(url)}`);
    if (!infoRes.ok) throw new Error("No se pudo obtener info del video");
    const info = await infoRes.json();

    // Limpiar caracteres inválidos para nombre de archivo
    const cleanTitle = info.title
      .replace(/[\\/:*?"<>|]/g, "")  // caracteres prohibidos en Windows
      .trim();

    // 2. Convertir
    const response = await fetch(`${API_BASE_URL}/convert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        format: selectedFormat,
        quality: "best",
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || "Error en el servidor");
    }

    // 3. Descargar con el título como nombre
    const blob     = await response.blob();
    const filename = `${cleanTitle}.${selectedFormat}`;
    triggerDownload(blob, filename);

    showMessage(`✅ ¡${cleanTitle} descargado!`, "success");

    setTimeout(() => location.reload(), 2000);

  } catch (error) {
    showMessage(`❌ ${error.message}`, "error");
    console.error("Error:", error);
  } finally {
    setLoading(false);
  }
});
// ─── Helpers ──────────────────────────────────────────────────────────────────

function triggerDownload(blob, filename) {
  const objectUrl = URL.createObjectURL(blob);
  const a         = document.createElement("a");
  a.href          = objectUrl;
  a.download      = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl);
}

function setLoading(isLoading) {
  btnConvert.disabled = isLoading;

  if (btnLabel) {
    btnLabel.textContent = isLoading ? "Convirtiendo..." : "Convertir";
  }
}

function showMessage(text, type = "info") {
  // Reutiliza el toast si ya existe, si no lo crea
  let toast = document.getElementById("viomp3-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "viomp3-toast";
    Object.assign(toast.style, {
      position:     "fixed",
      bottom:       "24px",
      left:         "50%",
      transform:    "translateX(-50%)",
      padding:      "12px 24px",
      borderRadius: "8px",
      fontFamily:   "system-ui, sans-serif",
      fontSize:     "14px",
      fontWeight:   "600",
      zIndex:       "9999",
      boxShadow:    "0 4px 12px rgba(0,0,0,0.15)",
      transition:   "opacity 0.3s ease",
    });
    document.body.appendChild(toast);
  }

  const colors = {
    success: { bg: "#146f23", color: "#fff" },
    error:   { bg: "#630519", color: "#fff" },
    warn:    { bg: "#f0a500", color: "#fff" },
    info:    { bg: "#0275d8", color: "#fff" },
  };

  const { bg, color } = colors[type] || colors.info;
  toast.style.backgroundColor = bg;
  toast.style.color            = color;
  toast.style.opacity          = "1";
  toast.textContent            = text;

  // Auto-ocultar a los 4 segundos
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = "0";
  }, 4000);
}
