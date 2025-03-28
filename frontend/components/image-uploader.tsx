"use client"

import type React from "react"

import { useState } from "react"
import styles from "./image-uploader.module.css"

export default function ImageUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      console.log("Archivo seleccionado:", selectedFile.name, "tamaño:", selectedFile.size, "tipo:", selectedFile.type)
      setFile(selectedFile)
      setMessage({ text: "", type: "" })
      setDebugInfo(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setMessage({ text: "Por favor selecciona un archivo primero", type: "error" })
      return
    }

    setUploading(true)
    setMessage({ text: "", type: "" })
    setDebugInfo(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      console.log("Enviando archivo al servidor:", file.name)

      const response = await fetch("http://localhost:3001/images/upload", {
        method: "POST",
        body: formData,
      })

      console.log("Respuesta del servidor:", response.status)
      const data = await response.json()
      console.log("Datos de respuesta:", data)

      // Guardar información de depuración
      setDebugInfo(data)

      if (!response.ok) {
        throw new Error(data.error || "Error al subir la imagen")
      }

      setMessage({ text: "¡Imagen subida con éxito!", type: "success" })
      setFile(null)

      // Limpiar el input de archivo
      const fileInput = document.getElementById("file") as HTMLInputElement
      if (fileInput) {
        fileInput.value = ""
      }

      // Recargar la página para mostrar la nueva imagen
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error("Error al subir imagen:", error)

      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        setMessage({
          text: "No se puede conectar al servidor. Por favor verifica que el backend esté ejecutándose en el puerto 3001.",
          type: "error",
        })
      } else {
        setMessage({
          text: `Error al subir imagen: ${error instanceof Error ? error.message : "Error desconocido"}`,
          type: "error",
        })
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={styles.uploader}>
      <h2>Subir Nueva Imagen</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.fileInput}>
          <input type="file" id="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
          <label htmlFor="file">{file ? file.name : "Selecciona una imagen"}</label>
        </div>

        <button type="submit" className={styles.uploadButton} disabled={uploading || !file}>
          {uploading ? "Subiendo..." : "Subir Imagen"}
        </button>
      </form>

      {message.text && <div className={`${styles.message} ${styles[message.type]}`}>{message.text}</div>}

      {/* Información de depuración */}
      {debugInfo && (
        <div className={styles.debugInfo}>
          <h4>Respuesta del servidor:</h4>
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

