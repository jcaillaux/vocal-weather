from sqlmodel import SQLModel
from sqlalchemy.engine.base import Engine
from sqlalchemy.sql.schema import MetaData
from sqlalchemy import text
from datetime import datetime, timezone




def get_utc_now() -> datetime:
    """ Returns a datetime aware UTC stamp. """
    return datetime.now(timezone.utc)

def create_schema(engine:Engine, schema: str):
    """ Creates shema """

    sql_query = text(f"""
        CREATE SCHEMA IF NOT EXISTS "{schema}";
    """)

    with engine.connect() as conn:
        conn.execute(sql_query)
        conn.commit()

def get_schemas_from_metadata(metadata:MetaData = None):
    """ Get all the schema avalailable within SQLModel.metadat object. """
    
    if metadata is None:
        metadata = SQLModel.metadata
    
    schemas = set()
    
    for table in metadata.tables.values():
        if table.schema:  # Vérifier si la table a un schéma défini
            schemas.add(table.schema)
    
    return list(schemas)
