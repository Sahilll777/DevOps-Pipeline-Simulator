import React from "react"
import { useNavigate } from "react-router-dom"
import { runPipeline } from "../services/api"

function PipelineStatusCard({ project, pipeline }) {
  const navigate = useNavigate()

  const handleRun = async (e) => {
    e.stopPropagation() // Prevent card click
    await runPipeline(project.id)
    window.location.reload()
  }

  const getStatusColor = () => {
    if (!pipeline) return "#94a3b8"
    if (pipeline.status === "success") return "#22c55e"
    if (pipeline.status === "failed") return "#ef4444"
    if (pipeline.status === "running") return "#facc15"
    return "#94a3b8"
  }

  const stages = ["INSTALL", "TEST", "BUILD", "PUSH"]

  const currentIndex = pipeline?.current_stage
    ? stages.indexOf(pipeline.current_stage)
    : -1

  const progress =
    currentIndex >= 0
      ? ((currentIndex + 1) / stages.length) * 100
      : 0

  return (
    <div
      style={styles.card}
      onClick={() => navigate(`/project/${project.id}`)}
    >
      <h3>{project.name}</h3>

      <p>
        Status:{" "}
        <span style={{ color: getStatusColor(), fontWeight: "bold" }}>
          {pipeline ? pipeline.status : "No pipeline"}
        </span>
      </p>

      <p>
        Current Stage: {pipeline?.current_stage || "N/A"}
      </p>

      <div style={styles.progressContainer}>
        <div
          style={{
            ...styles.progressBar,
            width: `${progress}%`
          }}
        />
      </div>

      <button style={styles.button} onClick={handleRun}>
        Run Pipeline
      </button>
    </div>
  )
}

const styles = {
  card: {
    backgroundColor: "#1e293b",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #334155",
    cursor: "pointer",
    transition: "transform 0.2s ease"
  },
  button: {
    marginTop: "15px",
    padding: "8px 12px",
    backgroundColor: "#38bdf8",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  progressContainer: {
    height: "8px",
    backgroundColor: "#0f172a",
    borderRadius: "5px",
    marginTop: "10px",
    overflow: "hidden"
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#38bdf8",
    transition: "width 0.4s ease"
  }
}

export default PipelineStatusCard
