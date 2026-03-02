import axios from "axios"

const API = axios.create({
  baseURL: "http://127.0.0.1:8000"
})

export const getProjects = () => API.get("/projects/")
export const getPipelines = () => API.get("/pipelines/")
export const getPipelineById = (id) => API.get(`/pipelines/${id}`)
export const runPipeline = (projectId) => API.post(`/pipelines/run/${projectId}`)

export default API
