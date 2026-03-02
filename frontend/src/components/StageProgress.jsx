function StageProgress({ currentStage, status }) {

  const stages = ["INSTALL", "TEST", "BUILD", "PUSH"]

  const getStageStatus = (stage) => {
    if (status === "failed" && currentStage === stage)
      return "failed"

    const stageIndex = stages.indexOf(stage)
    const currentIndex = stages.indexOf(currentStage)

    if (stageIndex < currentIndex) return "completed"
    if (stageIndex === currentIndex && status === "running") return "running"
    if (stageIndex === currentIndex && status === "success") return "completed"

    return "pending"
  }

  const getColor = (stageState) => {
    switch (stageState) {
      case "completed":
        return "bg-green-500"
      case "running":
        return "bg-yellow-500 animate-pulse"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <div className="flex gap-4 mb-6">
      {stages.map(stage => {
        const stageState = getStageStatus(stage)

        return (
          <div key={stage} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full ${getColor(stageState)}`} />
            <span className="text-sm">{stage}</span>
          </div>
        )
      })}
    </div>
  )
}

export default StageProgress
