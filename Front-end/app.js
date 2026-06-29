/**
 * VioMp3 — Conexión Frontend → Backend
 */

const API_BASE_URL = "https://viomp3-production.up.railway.app/api";

// ─── Estado ───────────────────────────────────────────────────────────────────

let selectedFormat = "mp3";

// ─── Referencias al DOM ───────────────────────────────────────────────────────

const urlInput   = document.getElementById("_input_type_text_");
const btnMP3     = document.getElementById("MP3");
const btnMP4     = document.getElementById("MP4");
const btnConvert = document.getElementById("Button-Convert");
const btnLabel   = document.querySelector("#I5_122_5_107 span");

// ─── Selección de formato ─────────────────────────────────────────────────────

btnMP3.addEventListener("click", () => { selectedFormat = "mp3"; });
btnMP4.addEventListener("click", () => { selectedFormat = "mp4"; });

// ─── Conversión ───────────────────────────────────────────────────────────────

btnConvert.addEventListener("click", async () => {
  const url = urlInput.value.trim();

  if (!url) {
    showMessage("⚠️ Pega un enlace de YouTube primero.", "warn");
    setTimeout(() => location.reload(), 2000);
    return;
  }

  setLoading(true);
  showLoader("Obteniendo información del video...");

  try {
    // 1. Info del video
    const infoRes = await fetch(`${API_BASE_URL}/info?url=${encodeURIComponent(url)}`);
    if (!infoRes.ok) throw new Error("No se pudo obtener info del video");
    const info = await infoRes.json();

    const cleanTitle = info.title
      .replace(/[\\/:*?"<>|]/g, "")
      .trim();

    // 2. Convertir
    updateLoader(`Convirtiendo "${cleanTitle}" a ${selectedFormat.toUpperCase()}...`);
    startFakeProgress();

    const response = await fetch(`${API_BASE_URL}/convert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, format: selectedFormat, quality: "best" }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || "Error en el servidor");
    }

    // 3. Descargar
    finishProgress();
    const blob     = await response.blob();
    const filename = `${cleanTitle}.${selectedFormat}`;
    triggerDownload(blob, filename);

    hideLoader();
    showMessage(`✅ ¡${cleanTitle} descargado!`, "success");
    setTimeout(() => location.reload(), 3000);

  } catch (error) {
    hideLoader();
    showMessage(`❌ ${error.message}`, "error");
    console.error("Error:", error);
  } finally {
    setLoading(false);
  }
});

// ─── Loading circular ─────────────────────────────────────────────────────────

let progressInterval = null;
let currentProgress  = 0;

function showLoader(text) {
  let overlay = document.getElementById("viomp3-loader-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "viomp3-loader-overlay";
    overlay.innerHTML = `
      <div id="viomp3-loader-box">
        <div id="viomp3-circle-wrap">
          <svg viewBox="0 0 120 120" id="viomp3-svg">
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="8"/>
            <circle cx="60" cy="60" r="50" fill="none" stroke="url(#viomp3-gradient)" stroke-width="8"
              stroke-linecap="round" stroke-dasharray="314" stroke-dashoffset="314"
              id="viomp3-progress-circle" transform="rotate(-90 60 60)"/>
            <defs>
              <linearGradient id="viomp3-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#4ade80"/>
                <stop offset="100%" style="stop-color:#22c55e"/>
              </linearGradient>
            </defs>
          </svg>
          <div id="viomp3-percent">0%</div>
        </div>
        <div id="viomp3-loader-icon">🎵</div>
        <div id="viomp3-loader-text">${text}</div>
        <div id="viomp3-loader-sub">Esto puede tardar unos segundos...</div>
      </div>
    `;

    Object.assign(overlay.style, {
      position:        "fixed",
      inset:           "0",
      backgroundColor: "rgba(0,0,0,0.75)",
      backdropFilter:  "blur(6px)",
      display:         "flex",
      alignItems:      "center",
      justifyContent:  "center",
      zIndex:          "99999",
      opacity:         "0",
      transition:      "opacity 0.3s ease",
    });

    document.body.appendChild(overlay);

    if (!document.getElementById("viomp3-styles")) {
      const style = document.createElement("style");
      style.id = "viomp3-styles";
      style.textContent = `
        #viomp3-loader-box {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          padding: 40px 48px;
          text-align: center;
          box-shadow: 0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(34,197,94,0.15);
          min-width: 280px;
          animation: viomp3-pop 0.3s ease;
        }
        @keyframes viomp3-pop {
          from { transform: scale(0.8); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        #viomp3-circle-wrap {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto 16px;
        }
        #viomp3-svg { width: 120px; height: 120px; }
        #viomp3-percent {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          font-size: 22px;
          font-weight: 800;
          color: #4ade80;
          font-family: system-ui, sans-serif;
          letter-spacing: -1px;
        }
        #viomp3-loader-icon {
          font-size: 28px;
          margin-bottom: 12px;
          animation: viomp3-pulse 1.5s ease-in-out infinite;
        }
        @keyframes viomp3-pulse {
          0%, 100% { transform: scale(1);   opacity: 1;   }
          50%       { transform: scale(1.2); opacity: 0.7; }
        }
        #viomp3-loader-text {
          color: #ffffff;
          font-size: 15px;
          font-weight: 600;
          font-family: system-ui, sans-serif;
          margin-bottom: 8px;
          max-width: 260px;
          line-height: 1.4;
        }
        #viomp3-loader-sub {
          color: rgba(255,255,255,0.45);
          font-size: 12px;
          font-family: system-ui, sans-serif;
        }
      `;
      document.head.appendChild(style);
    }
  }

  requestAnimationFrame(() => { overlay.style.opacity = "1"; });
  currentProgress = 0;
  updateCircle(0);
}

function updateLoader(text) {
  const el = document.getElementById("viomp3-loader-text");
  if (el) el.textContent = text;
}

function hideLoader() {
  stopFakeProgress();
  const overlay = document.getElementById("viomp3-loader-overlay");
  if (overlay) {
    overlay.style.opacity = "0";
    setTimeout(() => overlay.remove(), 300);
  }
}

function updateCircle(percent) {
  const circle = document.getElementById("viomp3-progress-circle");
  const label  = document.getElementById("viomp3-percent");
  if (!circle || !label) return;
  const offset = 314 - (percent / 100) * 314;
  circle.style.strokeDashoffset = offset;
  label.textContent = `${Math.round(percent)}%`;
}

function startFakeProgress() {
  stopFakeProgress();
  currentProgress = 5;
  progressInterval = setInterval(() => {
    if      (currentProgress < 30) currentProgress += 2.5;
    else if (currentProgress < 60) currentProgress += 1.2;
    else if (currentProgress < 80) currentProgress += 0.6;
    else if (currentProgress < 90) currentProgress += 0.2;
    updateCircle(Math.min(currentProgress, 90));
  }, 300);
}

function finishProgress() {
  stopFakeProgress();
  let p = currentProgress;
  const finish = setInterval(() => {
    p += 3;
    updateCircle(Math.min(p, 100));
    if (p >= 100) clearInterval(finish);
  }, 30);
}

function stopFakeProgress() {
  if (progressInterval) { clearInterval(progressInterval); progressInterval = null; }
}

// ─── Toast centrado ───────────────────────────────────────────────────────────

function showMessage(text, type = "info") {
  let toast = document.getElementById("viomp3-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "viomp3-toast";
    Object.assign(toast.style, {
      position:     "fixed",
      top:          "50%",
      left:         "50%",
      transform:    "translate(-50%, -50%) scale(0.8)",
      padding:      "20px 36px",
      borderRadius: "16px",
      fontFamily:   "system-ui, sans-serif",
      fontSize:     "16px",
      fontWeight:   "700",
      zIndex:       "999999",
      boxShadow:    "0 20px 60px rgba(0,0,0,0.4)",
      transition:   "opacity 0.3s ease, transform 0.3s ease",
      opacity:      "0",
      textAlign:    "center",
      maxWidth:     "360px",
      lineHeight:   "1.5",
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
  toast.textContent            = text;

  requestAnimationFrame(() => {
    toast.style.opacity   = "1";
    toast.style.transform = "translate(-50%, -50%) scale(1)";
  });

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity   = "0";
    toast.style.transform = "translate(-50%, -50%) scale(0.8)";
  }, 3500);
}

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
  if (btnLabel) btnLabel.textContent = isLoading ? "Convirtiendo..." : "Convertir";
}
