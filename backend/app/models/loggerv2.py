from sqlmodel import Field, Session, SQLModel, create_engine, select, Relationship
from sqlalchemy.engine.url import URL
from sqlalchemy.exc import ProgrammingError, NoSuchModuleError

from typing import Optional, Dict, Any
from datetime import datetime
from dotenv import load_dotenv
from .utils import get_utc_now, get_schemas_from_metadata, create_schema
import os

load_dotenv(dotenv_path='../.env')

DB_URL = URL.create(
        drivername = 'postgresql',
        username   = os.getenv('DB_USER'),
        password   = os.getenv('DB_PASS'),
        host       = os.getenv('DB_HOST'),
        port       = os.getenv('DB_PORT', 5432),
        database   = os.getenv('DB_NAME') 
    )

engine = create_engine(DB_URL)
print(DB_URL)
SQLModel.metadata.create_all(engine, checkfirst=True)

class SchemaDoesNotExistsError(Exception):
    """ Base class for schema not existsing. """
    pass

class QueryLog(SQLModel, table=True):
    __table_args__ = {"schema": os.getenv('DB_SCHEMA_LOGS')}
    
    task_id   : str = Field(index=True, primary_key=True)
    addr_ip   : str
    t_start : datetime = Field(default_factory=get_utc_now)
    t_end : Optional[datetime] = None
    hfl  : Optional[bool] = None
    status        : Optional[str] = None

class AzureLog(SQLModel, table=True):
    __table_args__ = {"schema": os.getenv('DB_SCHEMA_LOGS')}
    id        : Optional[int] = Field(default=None, primary_key=True)
    task_id   : str = Field(index=True)
    t_start : datetime = Field(default_factory=get_utc_now)
    t_end  : Optional[datetime] = None
    result        : Optional[str] = None
    status        : Optional[str] = None

    

class NERLog(SQLModel, table=True):
    __table_args__ = {"schema": os.getenv('DB_SCHEMA_LOGS')}
    id        : Optional[int] = Field(default=None, primary_key=True)
    task_id   : str = Field(index=True)
    t_start : datetime = Field(default_factory=get_utc_now)
    t_end : Optional[datetime] = None
    loc : Optional[str] = None
    d_start : Optional[str] = None
    d_end : Optional[str] = None
    status : Optional[str] = None

    

class GEOLog(SQLModel, table=True):
    __table_args__ = {"schema": os.getenv('DB_SCHEMA_LOGS')}
    id        : Optional[int] = Field(default=None, primary_key=True)
    task_id   : str = Field(index=True)
    t_start : datetime = Field(default_factory=get_utc_now)
    t_end : Optional[datetime] = None
    
    lat : Optional[str] = None
    lon : Optional[str] = None
    status : Optional[str] = None

    

class METEOLog(SQLModel, table=True):
    __table_args__ = {"schema": os.getenv('DB_SCHEMA_LOGS')}
    id        : Optional[int] = Field(default=None, primary_key=True)
    task_id   : str = Field(index=True)
    t_start : datetime = Field(default_factory=get_utc_now)
    t_end : Optional[datetime] = None

    status : Optional[str] = None
    

def insert_new_query(task_id, ip='1.1.1.1'):
    with Session(engine) as sess:
        query_log = QueryLog(
            task_id=task_id,
            addr_ip=ip,
            t_end= get_utc_now(),
            status='STTPending'
        )
        sess.add(query_log)
        sess.commit()

def update_query(task_id, status):
    with Session(engine) as sess:
        statement = select(QueryLog).where(QueryLog.task_id == task_id)
        query_log = sess.exec(statement).first()
        if query_log:
            # Update the status
            query_log.status = status
            query_log.t_end = get_utc_now()
            
            # Commit the changes
            sess.add(query_log)
            sess.commit()
            sess.refresh(query_log)
        
        return query_log

def insert_new_azure(task_id):
    with Session(engine) as sess:
        azure_log = AzureLog(
            task_id=task_id,
            status='Pending'
        )
        sess.add(azure_log)
        sess.commit()

def update_azure(task_id, status, result=None):
    with Session(engine) as sess:
        statement = select(AzureLog).where(AzureLog.task_id == task_id)
        azure_log = sess.exec(statement).first()
        if azure_log:
            # Update the status
            azure_log.status = status
            azure_log.t_end = get_utc_now()
            azure_log.result = result
            # Commit the changes
            sess.add(azure_log)
            sess.commit()
            sess.refresh(azure_log)
        
        return azure_log

def insert_new_ner(task_id):
    with Session(engine) as sess:
        ner_log = NERLog(
            task_id=task_id,
            status='Pending'
        )
        sess.add(ner_log)
        sess.commit()

def update_ner(task_id, status, result=None):
    with Session(engine) as sess:
        statement = select(NERLog).where(NERLog.task_id == task_id)
        ner_log = sess.exec(statement).first()
        if ner_log:
            # Update the status
            ner_log.status = status
            ner_log.t_end = get_utc_now()
            if result is not None :
                ner_log.loc = result.get('location')
                ner_log.d_start = result.get('start_date')
                ner_log.d_end  = result.get('end_date')
            # Commit the changes
            sess.add(ner_log)
            sess.commit()
            sess.refresh(ner_log)
        return ner_log

def insert_new_geo(task_id):
    with Session(engine) as sess:
        geo_log = GEOLog(
            task_id=task_id,
            status='Pending'
        )
        sess.add(geo_log)
        sess.commit()

def update_geo(task_id, status, result=None):
    with Session(engine) as sess:
        statement = select(GEOLog).where(GEOLog.task_id == task_id)
        geo_log = sess.exec(statement).first()
        if geo_log:
            # Update the status
            geo_log.status = status
            geo_log.t_end = get_utc_now()
            if result is not None :
                geo_log.lat = result.get('latitude')
                geo_log.lon = result.get('longitude')
            # Commit the changes
            sess.add(geo_log)
            sess.commit()
            sess.refresh(geo_log)
        return geo_log

def insert_new_meteo(task_id):
    with Session(engine) as sess:
        meteo_log = METEOLog(
            task_id=task_id,
            status='Pending'
        )
        sess.add(meteo_log)
        sess.commit()

def update_meteo(task_id, status):
    with Session(engine) as sess:
        statement = select(METEOLog).where(METEOLog.task_id == task_id)
        meteo_log = sess.exec(statement).first()
        if meteo_log:
            # Update the status
            meteo_log.status = status
            meteo_log.t_end = get_utc_now()
            
            sess.add(meteo_log)
            sess.commit()
            sess.refresh(meteo_log)
        return meteo_log

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
    
    