from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.pipeline import Pipeline
from rq import Queue
import redis
from worker.pipeline_executor import run_pipeline_job

router = APIRouter(prefix="/pipelines", tags=["Pipelines"])

# Redis connection
redis_conn = redis.Redis(host="localhost", port=6379, db=0)
queue = Queue(connection=redis_conn)


# ✅ IMPORTANT: Static route FIRST
@router.get("/")
def get_all_pipelines(db: Session = Depends(get_db)):
    return db.query(Pipeline).order_by(Pipeline.id.desc()).all()


# ✅ Dynamic route AFTER
@router.get("/{pipeline_id}")
def get_pipeline(pipeline_id: int, db: Session = Depends(get_db)):

    pipeline = db.query(Pipeline).filter(Pipeline.id == pipeline_id).first()

    if not pipeline:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    return {
        "id": pipeline.id,
        "status": pipeline.status,
        "logs": pipeline.logs
    }


@router.post("/run/{project_id}")
def run_pipeline(project_id: int, db: Session = Depends(get_db)):

    # Create pipeline entry
    new_pipeline = Pipeline(
        project_id=project_id,
        status="pending",
        logs=""
    )

    db.add(new_pipeline)
    db.commit()
    db.refresh(new_pipeline)

    # Enqueue job to worker
    queue.enqueue(run_pipeline_job, new_pipeline.id)

    return {
        "message": "Pipeline queued",
        "pipeline_id": new_pipeline.id
    }
