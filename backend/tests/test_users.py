import pytest
from app import schemas
from jose import jwt
from app.config import settings

# def test_root(client):
#     response = client.get("/")
#     print(response.json())
#     assert response.json().get("message") == "Welcome to my API!"
#     assert response.status_code == 200

def test_create_user(client):
    response = client.post(
        "/users/", json={"email": "hello123@gmail.com", "password": "password123"}
    )
    new_user = schemas.UserResponse(
        **response.json()
    )  # Unpack response into Pydantic model
    assert new_user.email == "hello123@gmail.com"
    assert response.status_code == 201

def test_login_user(client, test_user):
    response = client.post(
        "/login", data={"username": test_user['email'], "password": test_user['password']}
    )
    login_response = schemas.Token(**response.json())
    payload = jwt.decode(login_response.access_token, settings.secret_key, algorithms=[settings.algorithm])
    id = payload.get("user_id")
    assert id == test_user['id']
    assert login_response.token_type == "bearer"
    assert response.status_code == 200

@pytest.mark.parametrize("email, password, status_code", [
    ('sengfong@gmail.com', 'wrongpassword', 403),
    ('wrongemail@gmail.com', 'password123', 403),
    ('wrongemail@gmail.com', 'wrongpassword', 403),
    ('', 'password123', 403),
    ('sengfong@gmail.com', '', 403),
])
def test_incorrect_login(test_user, client, email, password, status_code):
    response = client.post(
        "/login", data={"username": email, "password": password}
    )
    assert response.status_code == status_code
    # assert response.json().get("detail") == "Invalid Credentials"