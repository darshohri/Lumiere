"""
Database session factory for the FastAPI backend.
Uses the same SQLAlchemy models as the rest of the project.
Includes automatic fallback to local SQLite when PostgreSQL is unavailable.
"""

import os
import sys
import uuid
import datetime
from dotenv import load_dotenv
from sqlalchemy import create_engine, text, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.dialects.postgresql import JSONB, INET, UUID as PG_UUID, TIMESTAMP
from pgvector.sqlalchemy import Vector

# SQLite compiler compatibility adapters for PostgreSQL-specific types
@compiles(JSONB, 'sqlite')
def compile_jsonb(type_, compiler, **kw):
    return "TEXT"

@compiles(INET, 'sqlite')
def compile_inet(type_, compiler, **kw):
    return "VARCHAR(45)"

@compiles(Vector, 'sqlite')
def compile_vector(type_, compiler, **kw):
    return "TEXT"

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

DEFAULT_PG_URL = "postgresql://postgres:hackathon123@localhost:5432/clinical_db"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_PG_URL)

_is_sqlite = False
engine = None

if "postgres" in DATABASE_URL:
    try:
        # Test connection with a short timeout
        _test_engine = create_engine(
            DATABASE_URL,
            pool_pre_ping=True,
            connect_args={"connect_timeout": 2}
        )
        with _test_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        engine = _test_engine
        print("[Database] Connected to PostgreSQL successfully.")
    except Exception as e:
        print("[Database] PostgreSQL not active. Initializing resilient local SQLite database.")
        _is_sqlite = True
else:
    _is_sqlite = True

if _is_sqlite:
    import sqlite3
    sqlite3.register_adapter(datetime.time, lambda t: t.isoformat())
    db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "clinical_local.db")
    DATABASE_URL = f"sqlite:///{db_path}"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

    @event.listens_for(engine, "connect")
    def set_sqlite_functions(dbapi_connection, connection_record):
        # Register PostgreSQL function mocks for SQLite compatibility
        dbapi_connection.create_function(
            "NOW", 0,
            lambda: datetime.datetime.now(datetime.timezone.utc).isoformat()
        )
        dbapi_connection.create_function(
            "gen_random_uuid", 0,
            lambda: str(uuid.uuid4())
        )
    
    # Ensure models are created on SQLite
    from models import Base
    Base.metadata.create_all(bind=engine)
    print(f"[Database] SQLite schema initialized at {db_path}.")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Auto-seed initial data if on SQLite
if _is_sqlite:
    try:
        from api.seeder import seed_database
        _db = SessionLocal()
        seed_database(_db)
        _db.close()
    except Exception as se:
        print(f"[Database] Seeding error: {se}")


def get_db():
    """FastAPI dependency — yields a DB session and closes it after the request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
