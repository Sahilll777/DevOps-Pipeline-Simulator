function PipelineHistory({ pipelines }) {

  const getColor = (status) => {
    switch (status) {
      case "success":
        return "text-green-400"
      case "failed":
        return "text-red-400"
      case "running":
        return "text-yellow-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="bg-gray-800 p-4 rounded-xl mt-6">
      <h3 className="font-semibold mb-3">Pipeline History</h3>

      <div className="space-y-2">
        {pipelines.map(p => (
          <div key={p.id} className="flex justify-between text-sm">
            <span>Pipeline #{p.id}</span>
            <span className={getColor(p.status)}>
              {p.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PipelineHistory
