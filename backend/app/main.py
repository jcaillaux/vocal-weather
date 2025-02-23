from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import shutil
import os

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Créer le dossier audio s'il n'existe pas
AUDIO_DIR = Path("audio")
AUDIO_DIR.mkdir(exist_ok=True)

@app.post("/api/weather")
async def upload_audio(
    audio: UploadFile = File(...),
    text: str = Form(None)
):
    try:
        # Créer un nom de fichier unique
        file_path = AUDIO_DIR / f"{audio.filename}"
        
        # Sauvegarder le fichier
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(audio.file, buffer)
        
        return {
            "message": "Audio received successfully",
            "filename": audio.filename,
            "text": text,
            "file_path": str(file_path)
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/")
async def read_root():
    return {"message": "FastAPI Audio Server is running"}