from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.convert import router
import os

app = FastAPI(title="VioMp3 API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://josue22islas.github.io",  # ← tu usuario de GitHub
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
