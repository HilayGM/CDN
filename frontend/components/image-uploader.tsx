"use client"

import type React from "react"

import { useState } from "react"
import styles from "./image-uploader.module.css"

export default function ImageUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setMessage({ text: "", type: "" })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setMessage({ text: "Please select a file first", type: "error" })
      return
    }

    setUploading(true)
    setMessage({ text: "", type: "" })

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("http://localhost:3001/images/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Upload failed")
      }

      const data = await response.json()
      setMessage({ text: "Image uploaded successfully!", type: "success" })
      setFile(null)

      // Trigger a refresh of the image gallery
      window.dispatchEvent(new CustomEvent("imageUploaded"))
    } catch (error) {
      console.error("Error uploading image:", error)

      // Provide more specific error messages
      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        setMessage({
          text: "Cannot connect to the server. Please check if the backend is running on port 3001.",
          type: "error",
        })
      } else {
        setMessage({
          text: `Failed to upload image: ${error instanceof Error ? error.message : "Unknown error"}`,
          type: "error",
        })
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={styles.uploader}>
      <h2>Upload New Image</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.fileInput}>
          <input type="file" id="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
          <label htmlFor="file">{file ? file.name : "Choose an image file"}</label>
        </div>

        <button type="submit" className={styles.uploadButton} disabled={uploading || !file}>
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
      </form>

      {message.text && <div className={`${styles.message} ${styles[message.type]}`}>{message.text}</div>}
    </div>
  )
}

