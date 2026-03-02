from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.project import Project
from app.models.pipeline import Pipeline
from app.services.git_service import clone_repository
from app.services.pipeline_service import detect_project_type

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.post("/create")
def create_project(name: str, repo_url: str, db: Session = Depends(get_db)):

    try:
        local_path = clone_repository(repo_url, name)
        project_type = detect_project_type(local_path)

        new_project = Project(
            name=name,
            repo_url=repo_url,
            local_path=local_path,
            project_type=project_type,
            owner_id=1
        )

        db.add(new_project)
        db.commit()
        db.refresh(new_project)

        return {
            "message": "Project created successfully",
            "project_type": project_type
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{project_id}/pipelines")
def get_project_pipelines(
    project_id: int,
    db: Session = Depends(get_db)
):
    pipelines = (
        db.query(Pipeline)
        .filter(Pipeline.project_id == project_id)
        .order_by(Pipeline.id.desc())
        .all()
    )

    return pipelines

@router.get("/")
def get_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    return projects
