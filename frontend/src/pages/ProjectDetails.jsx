import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getProjects, getPipelines } from "../services/api"

function ProjectDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [projects, setProjects] = useState([])
  const [project, setProject] = useState(null)
  const [pipelines, setPipelines] = useState([])
  const [selectedPipeline, setSelectedPipeline] = useState(null)

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    const projectsRes = await getProjects()
    const pipelinesRes = await getPipelines()

    setProjects(projectsRes.data)

    const selectedProject = projectsRes.data.find(
      (p) => p.id === parseInt(id)
    )

    const projectPipelines = pipelinesRes.data.filter(
      (p) => p.project_id === parseInt(id)
    )

    setProject(selectedProject)
    setPipelines(projectPipelines)

    if (projectPipelines.length > 0) {
      setSelectedPipeline(projectPipelines[0])
    } else {
      setSelectedPipeline(null)
    }
  }

  if (!project) return null

  const stages = ["INSTALL", "TEST", "BUILD", "PUSH"]

  const currentIndex = selectedPipeline?.current_stage
    ? stages.indexOf(selectedPipeline.current_stage)
    : -1

  const progress =
    currentIndex >= 0
      ? ((currentIndex + 1) / stages.length) * 100
      : 0

  const getStatusColor = (status) => {
    if (status === "success") return "#22c55e"
    if (status === "failed") return "#ef4444"
    if (status === "running") return "#facc15"
    return "#64748b"
  }

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Projects</h2>

        {projects.map((proj) => (
          <div
            key={proj.id}
            style={{
              ...styles.projectItem,
              backgroundColor:
                proj.id === parseInt(id) ? "#334155" : "transparent"
            }}
            onClick={() => navigate(`/project/${proj.id}`)}
          >
            {proj.name}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <h2>{project.name}</h2>

        {selectedPipeline && (
          <>
            <div style={styles.header}>
              <span
                style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(selectedPipeline.status)
                }}
              >
                {selectedPipeline.status.toUpperCase()}
              </span>

              <span style={{ color: "#94a3b8" }}>
                Stage: {selectedPipeline.current_stage}
              </span>
            </div>

            <div style={styles.progressContainer}>
              <div
                style={{
                  ...styles.progressBar,
                  width: `${progress}%`
                }}
              />
            </div>
          </>
        )}

        <div style={styles.section}>
          <h3>Logs</h3>
          <div style={styles.terminal}>
            <pre>
              {selectedPipeline?.logs || "No logs available"}
            </pre>
          </div>
        </div>

        <div style={styles.section}>
          <h3>Pipeline History</h3>
          {pipelines.map((pipeline) => (
            <div
              key={pipeline.id}
              style={{
                ...styles.historyItem,
                border:
                  selectedPipeline?.id === pipeline.id
                    ? "1px solid #38bdf8"
                    : "1px solid #334155"
              }}
              onClick={() => setSelectedPipeline(pipeline)}
            >
              <strong>#{pipeline.id}</strong>
              <span
                style={{
                  marginLeft: "10px",
                  color: getStatusColor(pipeline.status)
                }}
              >
                {pipeline.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  layout: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    fontFamily: "Inter, sans-serif"
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#1e293b",
    padding: "30px",
    borderRight: "1px solid #334155"
  },
  sidebarTitle: {
    color: "#38bdf8",
    marginBottom: "20px"
  },
  projectItem: {
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "10px",
    cursor: "pointer",
    transition: "background 0.2s"
  },
  main: {
    flex: 1,
    padding: "40px"
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px"
  },
  statusBadge: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontWeight: "bold",
    color: "#000"
  },
  progressContainer: {
    height: "8px",
    backgroundColor: "#1e293b",
    borderRadius: "5px",
    overflow: "hidden",
    marginBottom: "30px"
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#38bdf8",
    transition: "width 0.4s ease"
  },
  section: {
    marginBottom: "40px"
  },
  terminal: {
    backgroundColor: "#000",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #334155",
    fontSize: "13px",
    color: "#22c55e",
    maxHeight: "400px",
    overflowY: "auto"
  },
  historyItem: {
    backgroundColor: "#1e293b",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "10px",
    cursor: "pointer"
  }
}

export default ProjectDetails
