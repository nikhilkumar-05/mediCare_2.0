# mediCare 2.0

A production-grade full-stack healthcare platform.

## Features
- **Frontend**: React.js (Vite), Tailwind CSS, React Router, Redux/Context.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Socket.io.
- **Authentication**: JWT, bcrypt, Role-Based Access Control (Admin, Doctor, Patient).
- **Deployment**: Dockerized with NGINX reverse proxy, automated via GitHub Actions CI.

## Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- MongoDB (running locally if not using Docker)

## Getting Started (Local Development)

### 1. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

## Running with Docker
You can spin up the entire application (Frontend, Backend, and MongoDB) using Docker Compose:
```bash
docker-compose up --build
```
The application will be accessible at `http://localhost:3000`.

## API Documentation
Import the provided `postman_collection.json` into Postman to test the available API endpoints.
