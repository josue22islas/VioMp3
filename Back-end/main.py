from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.convert import router
import os

app = FastAPI(title="VioMp3 API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción: pon tu dominio exacto
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/")
def root():
    return {"status": "VioMp3 API corriendo"}
