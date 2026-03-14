# ProjectPilot

A modern issue tracking system built with FastAPI and React. Features a clean glassmorphism UI and a robust backend.

## Tech Stack
- **Backend:** FastAPI, SQLAlchemy (SQLite), JWT for auth
- **Frontend:** React, Axios, Lucide Icons, Glassmorphism CSS

## How to Setup

### 1. Backend
- Go into the `backend` folder
- Install requirements: `pip install -r requirements.txt`
- Set up your `.env` (check the example below)
- **Run this first** to create the demo user and sample data: `python seed.py`
- Start the server: `uvicorn main:app --reload`

**Backend .env example:**
```env
DATABASE_URL=sqlite:///./project_pilot.db
SECRET_KEY=yoursupersecretkey
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 2. Frontend
- Go into the `frontend` folder
- Install deps: `npm install`
- Create a `.env` file for the API URL:
  ```env
  REACT_APP_API_URL=http://localhost:8000
  ```
- Start the app: `npm start`

## Demo Login
(Make sure to run the seed script mentioned above first!)
- **Email:** kaibalya@gmail.com
- **Password:** password

## Features
- Glassmorphism dashboard with overview stats
- Project and issue management
- Real-time comments on issues
- Profile menu with logout
- Scrollable issue lists and sticky headers
