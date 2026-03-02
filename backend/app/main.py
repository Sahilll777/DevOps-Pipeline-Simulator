from fastapi import FastAPI
from app.database import engine, Base
from app.models.user import User
from app.models.project import Project
from app.models.pipeline import Pipeline
from app.routes import auth
from app.routes import projects
from app.routes import pipeline as pipeline_route
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="DevOps Pipeline Simulator")
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CREATE TABLES AFTER IMPORTS
Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(pipeline_route.router)

@app.get("/")
def root():
    return {"message": "DevOps Pipeline Simulator Running 🚀"}
