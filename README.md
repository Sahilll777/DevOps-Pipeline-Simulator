# DevOps Pipeline Simulator

A full-stack SaaS-style CI/CD dashboard that simulates real DevOps pipeline workflows including install, test, Docker build, and image push stages.

Built using React, FastAPI, SQLAlchemy, and Docker.

---

## Project Overview

DevOps Pipeline Simulator is a multi-project CI/CD system that allows users to:

- Register Git repositories
- Detect project type (Python / Node)
- Run stage-based pipelines
- Track live logs
- Build Docker images
- Push images to Docker Hub
- View pipeline history per project

It simulates how tools like GitHub Actions, GitLab CI, or Jenkins operate under the hood.

---

## Architecture

### Tech Stack

Frontend:
- React (Vite)
- React Router
- Axios

Backend:
- FastAPI
- SQLAlchemy ORM
- Background Worker

Database:
- SQLite / PostgreSQL

DevOps:
- Docker
- Docker Hub Integration

---

### System Flow

User → React Dashboard → FastAPI API → Database  
→ Pipeline Executor → INSTALL → TEST → BUILD → PUSH  
→ Docker Image Built → Logs Updated → UI Reflects Status                            
---

## Features

- Multi-project DevOps dashboard
- Stage-based pipeline execution
- Real-time status updates
- Live terminal-style log viewer
- Docker image auto-generation
- Docker Hub image push
- Sidebar project switcher
- Pipeline history tracking
- Professional SaaS UI design

---

## Pipeline Stages

1. INSTALL  
   - npm install / pip install

2. TEST  
   - pytest / npm test (if script exists)

3. BUILD  
   - Auto-generate Dockerfile (if missing)
   - Build Docker image

4. PUSH  
   - Tag image
   - Push to Docker Hub

---

## 🛠 How to Run Locally

### Backend

cd backend
uvicorn app.main:app --reload
venv\Scripts\python -m worker.worker (To Start the Worker)

### Frontend

cd frontend
npm install
npm run dev

---

## What This Project Demonstrates

- Full-stack system design
- CI/CD pipeline logic
- Docker automation
- REST API development
- Background job execution
- Real-time UI updates
- Multi-project architecture

---

## Future Improvements

- Real-time WebSocket logs
- Kubernetes deployment stage
- Authentication & multi-user isolation
- Cloud deployment version
- Git webhook trigger support

---

## Author

Sahil  
Cloud & DevOps Enthusiast
