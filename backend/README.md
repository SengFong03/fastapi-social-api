# FastForum 🚀

**FastForum** is a full-stack social media application built with **FastAPI** and **Vanilla JavaScript**. It features a complete authentication system, real-time voting, and post management.

## ✨ Features

* **User Authentication**: Secure Login & Registration using OAuth2 (JWT Tokens).
* **Create Posts**: Users can publish new content instantly.
* **Vote System**: Like/Unlike posts with real-time updates.
* **Search**: Filter posts by title or content.
* **Responsive UI**: Clean interface built with Bootstrap (SB Admin 2).
* **Robust Backend**: Powered by FastAPI, SQLAlchemy, and PostgreSQL.

## 🛠️ Tech Stack

* **Backend**: Python, FastAPI, Pydantic, SQLAlchemy
* **Frontend**: HTML5, JavaScript (Fetch API), Bootstrap 4
* **Database**: PostgreSQL
* **Security**: BCrypt password hashing, JWT authorization

## 🚀 How to Run

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/FastForum.git](https://github.com/SengFong03/fastapi-social-api.git)
    cd FastForum
    ```

2.  **Install dependencies**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add your database credentials:
    ```env
    DATABASE_HOSTNAME=localhost
    DATABASE_PORT=5432
    DATABASE_PASSWORD=your_password
    DATABASE_NAME=fastapi
    DATABASE_USERNAME=postgres
    SECRET_KEY=your_secret_key
    ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_MINUTES=30
    ```

4.  **Run the App**
    ```bash
    uvicorn app.main:app --reload
    ```

5.  **Access the App**
    Open your browser and go to `http://127.0.0.1:8000`