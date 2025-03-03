from sqlmodel import Field, Session, SQLModel, create_engine, select
from sqlalchemy.engine.url import URL
from sqlalchemy.exc import ProgrammingError, NoSuchModuleError

from typing import Optional, Dict, Any
from datetime import datetime
from dotenv import load_dotenv
from utils import get_utc_now, get_schemas_from_metadata, create_schema
import os

load_dotenv(dotenv_path='../../.env')


engine = None#create_engine(DATABASE_URL)


class SchemaDoesNotExistsError(Exception):
    """ Base class for schema not existsing. """
    pass

# Modèles SQLModel
class TaskLog(SQLModel, table=True):
    __table_args__ = {"schema": os.getenv('DB_SCHEMA_LOGS')}

    id        : Optional[int] = Field(default=None, primary_key=True)
    task_id   : str = Field(index=True)
    timestamp : datetime = Field(default_factory=get_utc_now)
    level     : str # INFO, WARNING, ERROR
    step      : str # stt, nlu, weather_api, etc.
    message   : str
    data      : Optional[str] = None  # JSON serialized data

class Task(SQLModel, table=True):
    __table_args__ = {"schema": os.getenv('DB_SCHEMA_LOGS')}

    task_id    : str      = Field(primary_key=True, max_length=12)
    created_at : datetime = Field(default_factory=get_utc_now)
    updated_at : datetime = Field(default_factory=get_utc_now)
    status     : str      = Field(max_length=10)# pending, processing, completed, failed
    result     : Optional[str] = None  # JSON serialized result

# Créer les tables
#SQLModel.metadata.create_all(engine)

# Pydantic models pour l'API
class TaskCreate(SQLModel):
    task_id : str
    status  : str = "pending"

class TaskResponse(SQLModel):
    task_id    : str
    status     : str
    created_at : datetime
    updated_at : datetime
    result     : Optional[Dict[str, Any]] = None

class TaskLogResponse(SQLModel):
    timestamp : datetime
    level     : str
    step      : str
    message   : str
    data      : Optional[Dict[str, Any]] = None

if __name__ == '__main__':
    DB_URL = URL.create(
        drivername = 'postgresql',
        username   = os.getenv('DB_USER'),
        password   = os.getenv('DB_PASS'),
        host       = os.getenv('DB_HOST'),
        port       = os.getenv('DB_PORT', 5432),
        database   = os.getenv('DB_NAME') 
    )

    
    try :
        engine = create_engine(url=DB_URL)
        SQLModel.metadata.create_all(engine, checkfirst=True)
    except NoSuchModuleError as e:
        print(f"Unknown database driver : {e}")
        print(f"-> Critical Error : terminating now.")
        os._exit(0)        
    except ProgrammingError as e:
        for schema in get_schemas_from_metadata() :
            create_schema(engine=engine, schema=schema)
    finally:
        SQLModel.metadata.create_all(engine, checkfirst=True)
        print("Done.")
    
    