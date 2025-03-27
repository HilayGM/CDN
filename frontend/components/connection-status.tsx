"use client"

import { useState, useEffect } from "react"
import styles from "./connection-status.module.css"

export default function ConnectionStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "disconnected">("checking")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch("http://localhost:3001/images/list", {
          method: "HEAD",
          // Short timeout to quickly detect connection issues
          signal: AbortSignal.timeout(3000),
        })

        if (response.ok) {
          setStatus("connected")
          setMessage("Connected to backend server")
        } else {
          setStatus("disconnected")
          setMessage("Backend server is running but returned an error")
        }
      } catch (error) {
        setStatus("disconnected")
        if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
          setMessage("Cannot connect to backend server. Please check if it's running on port 3001.")
        } else if (error instanceof DOMException && error.name === "AbortError") {
          setMessage("Connection to backend timed out. Server might be slow or unreachable.")
        } else {
          setMessage(`Connection error: ${error instanceof Error ? error.message : "Unknown error"}`)
        }
      }
    }

    checkConnection()

    // Check connection status periodically
    const interval = setInterval(checkConnection, 30000)

    return () => clearInterval(interval)
  }, [])

  if (status === "checking") {
    return <div className={`${styles.status} ${styles.checking}`}>Checking connection to backend...</div>
  }

  return (
    <div className={`${styles.status} ${styles[status]}`}>
      <span className={styles.indicator}></span>
      <span>{message}</span>
    </div>
  )
}

