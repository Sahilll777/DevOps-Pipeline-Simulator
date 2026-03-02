import subprocess
import os
from datetime import datetime
from app.database import SessionLocal
from app.models.user import User
from app.models.project import Project
from app.models.pipeline import Pipeline


def run_pipeline_job(pipeline_id: int):

    print("RUNNING PIPELINE JOB", pipeline_id)

    db = SessionLocal()
    pipeline = db.query(Pipeline).filter(Pipeline.id == pipeline_id).first()

    if not pipeline:
        return

    project = db.query(Project).filter(Project.id == pipeline.project_id).first()

    pipeline.status = "running"
    db.commit()

    project_path = project.local_path
    project_type = project.project_type

    def log(message):
        timestamp = datetime.now().strftime("%H:%M:%S")
        pipeline.logs += f"\n[{timestamp}] {message}"
        db.commit()

    def run_command(command):
        log(f"$ {command}")

        result = subprocess.run(
            command,
            cwd=project_path,
            shell=True,
            capture_output=True,
            text=True
        )

        pipeline.logs += result.stdout
        pipeline.logs += result.stderr
        db.commit()

        if result.returncode != 0:
            raise Exception(f"Command failed: {command}")

    def run_stage(stage_name, stage_function):
        log(f"\n===== STAGE: {stage_name} =====")
        pipeline.current_stage = stage_name
        db.commit()

        stage_function()

        log(f"----- {stage_name} COMPLETED -----")

    try:

        # ================= INSTALL STAGE =================
        def install_stage():
            if project_type == "python":
                if os.path.exists(os.path.join(project_path, "requirements.txt")):
                    run_command("pip install -r requirements.txt")
                elif os.path.exists(os.path.join(project_path, "pyproject.toml")):
                    run_command("pip install .")
                else:
                    log("No dependency file found. Skipping install.")
            elif project_type == "node":
                run_command("npm install")
            else:
                log("Unknown project type. Skipping install.")

        run_stage("INSTALL", install_stage)

        # ================= TEST STAGE =================
        def test_stage():
            if project_type == "python":
                run_command("pytest")
            elif project_type == "node":
                package_json_path = os.path.join(project_path, "package.json")
                if os.path.exists(package_json_path):
                    import json
                    with open(package_json_path, "r") as f:
                        package_data = json.load(f)
                    if "scripts" in package_data and "test" in package_data["scripts"]:
                        run_command("npm test")
                    else:
                        log("No test script found in package.json. Skipping test stage.")
                else:
                    log("No package.json found. Skipping test stage.")
            else:
                log("No test stage defined.")

        run_stage("TEST", test_stage)

        # ================= BUILD STAGE =================
        def build_stage():
            dockerfile_path = os.path.join(project_path, "Dockerfile")
            image_name = f"{project.name.lower()}-image:{pipeline.id}"

            # Auto-generate Dockerfile if not exists
            if not os.path.exists(dockerfile_path):
                log("No Dockerfile found. Generating default Dockerfile...")

                if project_type == "python":
                    docker_content = """
FROM python:3.11
WORKDIR /app
COPY . .
RUN pip install .
CMD ["python"]
"""
                elif project_type == "node":
                    docker_content = """
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
"""
                else:
                    log("Unsupported project type for Docker build.")
                    return

                with open(dockerfile_path, "w") as f:
                    f.write(docker_content)

            # Build Docker image
            run_command(f"docker build -t {image_name} .")

            project.docker_image = image_name
            db.commit()

            log(f"Docker image built: {image_name}")

        run_stage("BUILD", build_stage)

        # ================= PUSH STAGE =================
        def push_stage():
            docker_username = "15sahil"
            image_name = project.docker_image
            full_image_name = f"{docker_username}/{image_name}"

            # Tag image for Docker Hub
            run_command(f"docker tag {image_name} {full_image_name}")

            # Push to Docker Hub
            run_command(f"docker push {full_image_name}")

            log(f"Docker image pushed: {full_image_name}")

        run_stage("PUSH", push_stage)

        pipeline.status = "success"
        pipeline.current_stage = "COMPLETED"
        log(" Pipeline completed successfully")
        db.commit()

    except Exception as e:
        pipeline.status = "failed"
        log(f" Pipeline failed: {str(e)}")
        db.commit()

    finally:
        db.close()
