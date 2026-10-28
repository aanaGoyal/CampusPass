
import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add your PostgreSQL database URL here later.
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "PASTE_YOUR_POSTGRESQL_DATABASE_URL_HERE"
)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

