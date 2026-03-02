import os
from git import Repo

BASE_DIR = os.path.abspath("repos")

def clone_repository(repo_url: str, project_name: str):
    project_path = os.path.join(BASE_DIR, project_name)

    if not os.path.exists(BASE_DIR):
        os.makedirs(BASE_DIR)

    Repo.clone_from(repo_url, project_path)

    return project_path
