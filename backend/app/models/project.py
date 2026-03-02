from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

docker_image = Column(String, nullable=True)
class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    repo_url = Column(String)
    local_path = Column(String)
    project_type = Column(String)
    docker_image = Column(String, nullable=True)

    owner_id = Column(Integer, ForeignKey("users.id"))
