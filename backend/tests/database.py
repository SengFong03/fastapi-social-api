import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.config import settings
from app.database import get_db, Base
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLALCHEMY_DATABASE_URL = f"postgresql://{settings.database_username}:{settings.database_password}@{settings.database_hostname}/{settings.database_name}"
SQLALCHEMY_DATABASE_URL = f"postgresql://{settings.database_username}:{settings.database_password}@{settings.database_hostname}/fastapi_test"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base.metadata.create_all(bind=engine)


# def override_get_db():
#     db = TestingSessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()


# app.dependency_overrides[get_db] = override_get_db



# why use fixture here instead of override_get_db directly?
# because we want to create and drop tables for each test session
@pytest.fixture(scope="module")
def session():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


# client = TestClient(app)


# why use fixture here instead of client = TestClient(app) directly?
# because we want to create and drop tables for each test session
# so that tests do not interfere with each other
@pytest.fixture(scope="module")                         
def client(session):       
    def override_get_db():
        try:
            yield session
        finally:
            session.close() 
    app.dependency_overrides[get_db] = override_get_db        
    yield TestClient(app)                  # what is yield here?, it is like return but allows code after it to run