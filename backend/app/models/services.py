from pydantic import BaseModel
from ..services.speech_service import STTService
from ..services.ner import NERService
from ..services.geocoding import GEOCodingService
from ..services.weather import OpenMeteoService
from ..services.dparser import DATEParserService
from typing import Optional, Dict, Any


class ServiceStack(BaseModel) :
    stt   : Optional[STTService] = None
    ner   : Optional[NERService] = None
    geo   : Optional[GEOCodingService] = None
    date  : Optional[DATEParserService] = None
    meteo : Optional[OpenMeteoService] = None

    def add_service(self, service_name: str, **kwargs):
        match service_name:
            case "stt":
                self.stt = STTService(**kwargs)
            case "ner":
                self.ner = NERService(**kwargs)
            case "geo":
                self.geo = GEOCodingService(**kwargs)
            case "date":
                self.date = DATEParserService(**kwargs)
            case "meteo":
                self.meteo = OpenMeteoService(**kwargs)
            case _:
                raise ValueError(f"Unknown service `{service_name}.`")
    class Config:
        arbitrary_types_allowed = True