 import React from "react"

function Navbar() {
  return (
    <div style={styles.nav}>
      <h1 style={styles.logo}>DevOps Pipeline Simulator</h1>
      <span style={styles.user}>Sahil • Cloud Engineer</span>
    </div>
  )
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 30px",
    backgroundColor: "#1e293b",
    borderBottom: "1px solid #334155"
  },
  logo: {
    color: "#38bdf8",
    margin: 0
  },
  user: {
    fontSize: "14px",
    color: "#94a3b8"
  }
}

export default Navbar
