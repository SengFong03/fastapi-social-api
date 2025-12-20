import pytest
from fastapi.testclient import TestClient
from app import models
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
@pytest.fixture
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
@pytest.fixture           
def client(session):       
    def override_get_db():
        try:
            yield session
        finally:
            session.close() 
    app.dependency_overrides[get_db] = override_get_db        
    yield TestClient(app)                  # what is yield here?, it is like return but allows code after it to run


@pytest.fixture
def test_user(client):
    user_data = {"email": "sengfong@gmail.com", "password": "password123"}
    res = client.post("/users/", json=user_data)
    assert res.status_code == 201
    new_user = res.json()
    new_user['password'] = user_data['password']
    return new_user

@pytest.fixture
def test_user2(client):
    user_data = {"email": "sengfong123@gmail.com", "password": "password123"}
    res = client.post("/users/", json=user_data)
    assert res.status_code == 201
    new_user = res.json()
    new_user['password'] = user_data['password']
    return new_user


@pytest.fixture
def token(test_user):
    from app.oauth2 import create_access_token
    access_token = create_access_token(data={"user_id": test_user['id']})
    return access_token

@pytest.fixture
def authorized_client(client, token):
    client.headers = {
        **client.headers,
        "Authorization": f"Bearer {token}"
    }
    return client

@pytest.fixture
def test_posts(test_user, session, test_user2):
    posts_data = [
        {
            "title": "First Post",
            "content": "Content of first post",
            "owner_id": test_user['id']
        },
        {
            "title": "Second Post",
            "content": "Content of second post",
            "owner_id": test_user['id']
        },
        {
            "title": "Third Post",
            "content": "Content of third post",
            "owner_id": test_user['id']
        },
        {
            "title": "Fourth Post",
            "content": "Content of fourth post",
            "owner_id": test_user2['id']
        }
    ]
    
    def create_post_model(post):
        return models.Post(**post)
    
    post_map = map(create_post_model, posts_data)
    posts = list(post_map)

    session.add_all(posts)
    # Hard Code Version
    # session.add_all([
    #     models.Post(title="First Post", content="Content of first post", owner_id=test_user['id']),
    #     models.Post(title="Second Post", content="Content of second post", owner_id=test_user['id']),
    #     models.Post(title="Third Post", content="Content of third post", owner_id=test_user['id'])
    # ])
    session.commit()
    posts = session.query(models.Post).all()
    return posts