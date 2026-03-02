import React from "react"
import { Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import ProjectDetails from "./pages/ProjectDetails"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/project/:id" element={<ProjectDetails />} />
    </Routes>
  )
}

export default App
