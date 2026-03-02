import React, { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import PipelineStatusCard from "../components/PipelineStatusCard"
import { getProjects, getPipelines } from "../services/api"

function Dashboard() {

  const [projects, setProjects] = useState([])
  const [pipelines, setPipelines] = useState([])

  useEffect(() => {
    fetchData()

    const interval = setInterval(() => {
      fetchData()
    }, 5000) // refresh every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const projectsRes = await getProjects()
      const pipelinesRes = await getPipelines()

      setProjects(projectsRes.data)
      setPipelines(pipelinesRes.data)
    } catch (err) {
      console.error("Error fetching data", err)
    }
  }

  return (
    <div>
      <Navbar />

      <div style={{ padding: "20px", display: "grid", gap: "20px" }}>
        {projects.map((project) => {

  // get all pipelines of this project
  const projectPipelines = pipelines.filter(
    (p) => p.project_id === project.id
  )

  // pick latest pipeline (first one because backend sorts DESC)
  const latestPipeline = projectPipelines[0]

  return (
    <PipelineStatusCard
      key={project.id}
      project={project}
      pipeline={latestPipeline}
    />
  )
})}

      </div>
    </div>
  )
}

export default Dashboard
