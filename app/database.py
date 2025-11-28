# import psycopg2
# import time
# from psycopg2.extras import RealDictCursor
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

# Database URL for PostgreSQL
# postgresql://<username>:<password>@<host>/<database_name>
SQLALCHEMY_DATABASE_URL = f"postgresql://{settings.database_username}:{settings.database_password}@{settings.database_hostname}/{settings.database_name}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Database connection
# For raw SQL connection using psycopg2

# while True:

#     try:
#         conn = psycopg2.connect(
#             host=f"{settings.database_hostname}",
#             database=f"{settings.database_name}",
#             user=f"{settings.database_username}",
#             password=f"settings.database_password",
#             cursor_factory=RealDictCursor,
#         )
#         cursor = conn.cursor()
#         print("Database connection was successful!")
#         break
#     except Exception as error:
#         print("Error connecting to database:", error)
#         time.sleep(2)
