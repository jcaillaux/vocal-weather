from fastapi import FastAPI, HTTPException, Request, UploadFile, File, Form, Depends, Body
from typing import Annotated, Optional
from pydantic import BaseModel, ValidationError, Field
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import shutil
import os
from dotenv import load_dotenv
import uuid
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from .models.requests import UserLogin, TextQuery
from .core.utils import get_client_ip

from .services.speech_service import STTService, NoSpeechDetectedError, TranscriptionCanceledError, SpeechTranscriptionError

from .models.services import ServiceStack

from .models.loggerv2 import *


services_ = ServiceStack()

AUDIO_DIR = Path("audio")

@asynccontextmanager
async def lifespan(app: FastAPI):
    print('>>> Setting temp directories...')
    AUDIO_DIR.mkdir(exist_ok=True)
    print('>>> Temp. directories set up')

    print('>>> Loading .env file...')
    load_dotenv()
    print('>>> .env loaded.')

    print('>>> Loading STT Service...')
    services_.add_service('stt')
    print('>>> STT service loaded.')

    print('>>> Loading NER Service...')
    services_.add_service('ner')
    print('>>> NER service loaded.')

    print('>>> Loading GEOCoding Service...')
    services_.add_service('geo')
    print(">>> GEOCoding Service loaded. ")

    print('>>> Loading DATEParser Service')
    services_.add_service('date')
    print('>>> DATEParser Service loaded.')

    print('>>> Loading Meteo Service...')
    services_.add_service('meteo')
    print('>>> Meteo Service loaded.')

    yield


app = FastAPI(lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    """ Root """
    return JSONResponse(content={"message": "Dev. mode webapp @localhost:3000"})

@app.post("/api/sign-up")
async def sign_up(username:str, password : str):
    """ Resgistering new user """
    print(username, password)
    return JSONResponse(content={'message' : 'User created'})

@app.post("/api/sign-in")
async def sign_in(user: Annotated[UserLogin, Form(...)]):
    """ Sign-in registered user
    
    - **username**: chosen username
    - **password**: chosen password
    """
    print(user.model_dump_json())
    return JSONResponse(content={'message' : 'User logged-in'})

@app.post("/api/weather-audio")
async def upload_audio(audio : Annotated[UploadFile, File(media_type='audio/wav', description='An audio/wav encoded audio query')], client_ip: Annotated[str, Depends(get_client_ip)]):
    """ Fetch weather prediction.

    Parameters
    
    - **audio**: audio querry

    Response :

    - **Weather Forecast Data**
    """
    task_id = str(uuid.uuid4())

    insert_new_query(task_id=task_id, ip=client_ip)

    # Save temporarily the audio
    file_path = AUDIO_DIR / f"{task_id}_recording.wav"

    with file_path.open("wb") as buffer:
            shutil.copyfileobj(audio.file, buffer)
    
    try :
        insert_new_azure(task_id=task_id)
        text = services_.stt.transcribe(filename=str(file_path))
        update_azure(task_id=task_id, status='Success', result=text)
        
        print(text)
    except (RuntimeError, 
            NoSpeechDetectedError, 
            SpeechTranscriptionError,
            TranscriptionCanceledError
        )  as e:
        update_azure(task_id=task_id, status=type(e).__name__)
        update_query(task_id=task_id, status='STTError')
        return JSONResponse(content={
            'error'   : type(e).__name__,
            'message' : str(e) 
        })
    try :
        update_query(task_id=task_id, status='NERPending')
        insert_new_ner(task_id=task_id)
        entities = services_.ner.extract(text)
        update_ner(task_id=task_id, status='Success', result=entities)
        print(entities)
    except Exception as e:
        update_ner(task_id=task_id, status=type(e).__name__)
        update_query(task_id=task_id, status='NERError')
        return JSONResponse(content={
            'error'   : type(e).__name__,
            'message' : str(e) 
        })
    try :
        update_query(task_id=task_id, status='GEOPending')
        insert_new_geo(task_id=task_id)
        coord = services_.geo.localize(entities['location'])
        print(coord)
        update_geo(task_id=task_id, status='Success', result=coord)
    except Exception as e :
        update_geo(task_id=task_id, status=type(e).__name__)
        update_query(task_id=task_id, status='GEOError')
        return JSONResponse(content={
            'error'   : type(e).__name__,
            'message' : str(e) 
        })
    #try :
    #    horizon = services_.date.extract_date(entities['Date'] if len(entities['Date']) > 0 else entities['Time'])
    #    print(horizon)
    #except Exception as e :
    #    return JSONResponse(content={
    #        'error'   : type(e).__name__,
    #        'message' : str(e) 
    #   })
    try :
        update_query(task_id=task_id, status='METEOPending')
        insert_new_meteo(task_id=task_id)
        data = services_.meteo.get_forecast(lat=coord['latitude'], lon=coord['longitude'], start_date=entities['start_date'], end_date=entities['end_date'])
        update_meteo(task_id=task_id, status='Success')
    except Exception as e:
        update_meteo(task_id=task_id, status=type(e).__name__)
        update_query(task_id=task_id, status='METEOError')
        return JSONResponse(content={
            'error'   : type(e).__name__,
            'message' : str(e) 
        })
    update_query(task_id=task_id, status='Success')
    return JSONResponse(content={
        'task_id' : task_id, 
        'text' : text,
        'coordinates' : coord,
        'data' : data,
        'city' : entities['location'].title()
    })

