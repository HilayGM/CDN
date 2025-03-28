"use client"

import { useState, useEffect } from "react"
import styles from "./connection-status.module.css"

export default function ConnectionStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "disconnected">("checking")
  const [message, setMessage] = useState("")
  const [cloudflareStatus, setCloudflareStatus] = useState<"checking" | "connected" | "disconnected">("checking")
  const [cloudflareMessage, setCloudflareMessage] = useState("")

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Verificar conexión con el backend
        const response = await fetch("http://localhost:3001/ping", {
          method: "GET",
          signal: AbortSignal.timeout(3000),
        })

        if (response.ok) {
          setStatus("connected")
          setMessage("Conectado al servidor backend")

          // Si el backend está conectado, verificar la conexión con Cloudflare
          checkCloudflareConnection()
        } else {
          setStatus("disconnected")
          setMessage("El servidor backend está ejecutándose pero devolvió un error")
          setCloudflareStatus("disconnected")
          setCloudflareMessage("No se puede verificar la conexión con Cloudflare")
        }
      } catch (error) {
        setStatus("disconnected")
        if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
          setMessage("No se puede conectar al servidor backend. Verifica que esté ejecutándose en el puerto 3001.")
        } else if (error instanceof DOMException && error.name === "AbortError") {
          setMessage("La conexión al backend se agotó. El servidor podría estar lento o inaccesible.")
        } else {
          setMessage(`Error de conexión: ${error instanceof Error ? error.message : "Error desconocido"}`)
        }

        setCloudflareStatus("disconnected")
        setCloudflareMessage("No se puede verificar la conexión con Cloudflare")
      }
    }

    const checkCloudflareConnection = async () => {
      try {
        setCloudflareStatus("checking")
        setCloudflareMessage("Verificando conexión con Cloudflare...")

        const response = await fetch("http://localhost:3001/images/check-connection", {
          method: "GET",
          signal: AbortSignal.timeout(5000),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          setCloudflareStatus("connected")
          setCloudflareMessage("Conectado a la API de Cloudflare")
        } else {
          setCloudflareStatus("disconnected")
          setCloudflareMessage(data.error || "No se pudo conectar con Cloudflare")
        }
      } catch (error) {
        setCloudflareStatus("disconnected")
        setCloudflareMessage(
          `Error al verificar Cloudflare: ${error instanceof Error ? error.message : "Error desconocido"}`,
        )
      }
    }

    checkConnection()

    // Verificar conexión periódicamente
    const interval = setInterval(checkConnection, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.connectionContainer}>
      <div className={`${styles.status} ${styles[status]}`}>
        <span className={styles.indicator}></span>
        <span>Backend: {message}</span>
      </div>

      <div className={`${styles.status} ${styles[cloudflareStatus]}`}>
        <span className={styles.indicator}></span>
        <span>Cloudflare: {cloudflareMessage}</span>
      </div>
    </div>
  )
}

