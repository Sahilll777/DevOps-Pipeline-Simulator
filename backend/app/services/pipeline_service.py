import os

def detect_project_type(project_path: str):

    # Node.js
    if os.path.exists(os.path.join(project_path, "package.json")):
        return "node"

    # Python (multiple indicators)
    if (
        os.path.exists(os.path.join(project_path, "requirements.txt")) or
        os.path.exists(os.path.join(project_path, "pyproject.toml")) or
        any(f.endswith(".py") for f in os.listdir(project_path))
    ):
        return "python"

    # Java
    if os.path.exists(os.path.join(project_path, "pom.xml")):
        return "java"

    # Go
    if os.path.exists(os.path.join(project_path, "go.mod")):
        return "go"

    return "unknown"
