import React from "react"

function LogViewer() {
  return (
    <div style={styles.terminal}>
      <pre>
{`===== STAGE: INSTALL =====
$ npm install
----- INSTALL COMPLETED -----

===== STAGE: BUILD =====
$ docker build ...
Docker image built successfully

===== STAGE: PUSH =====
$ docker push 15sahil/crud-image:5
Push completed successfully`}
      </pre>
    </div>
  )
}

const styles = {
  terminal: {
    backgroundColor: "#000000",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #334155",
    fontSize: "14px",
    color: "#22c55e",
    overflowX: "auto"
  }
}

export default LogViewer
