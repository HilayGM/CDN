"use client"

import { useState, useEffect } from "react"
import styles from "./image-gallery.module.css"

interface CloudflareImage {
  id: string
  filename: string
  uploaded: string
  requireSignedURLs: boolean
  variants: string[]
}

export default function ImageGallery() {
  const [images, setImages] = useState<CloudflareImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchImages = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await fetch("http://localhost:3001/images/list")

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to fetch images")
      }

      const data = await response.json()
      setImages(data.images || [])
    } catch (error) {
      console.error("Error fetching images:", error)

      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        setError("Cannot connect to the server. Please check if the backend is running on port 3001.")
      } else {
        setError(`Failed to load images: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return
    }

    try {
      setDeleting(imageId)

      const response = await fetch(`http://localhost:3001/images/delete/${imageId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to delete image")
      }

      // Remove the deleted image from the state
      setImages(images.filter((img) => img.id !== imageId))
    } catch (error) {
      console.error("Error deleting image:", error)

      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        alert("Cannot connect to the server. Please check if the backend is running.")
      } else {
        alert(`Failed to delete image: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    } finally {
      setDeleting(null)
    }
  }

  useEffect(() => {
    fetchImages()

    // Listen for image upload events to refresh the gallery
    const handleImageUploaded = () => {
      fetchImages()
    }

    window.addEventListener("imageUploaded", handleImageUploaded)

    return () => {
      window.removeEventListener("imageUploaded", handleImageUploaded)
    }
  }, [])

  if (loading && images.length === 0) {
    return <div className={styles.loading}>Loading images...</div>
  }

  if (error && images.length === 0) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={fetchImages} className={styles.retryButton}>
          Retry
        </button>
      </div>
    )
  }

  if (images.length === 0) {
    return <div className={styles.empty}>No images found. Upload your first image!</div>
  }

  return (
    <div className={styles.gallery}>
      <h2>Your Images</h2>
      <div className={styles.grid}>
        {images.map((image) => (
          <div key={image.id} className={styles.imageCard}>
            <div className={styles.imageWrapper}>
              <img src={image.variants[0] || "/placeholder.svg"} alt={image.filename} className={styles.image} />
            </div>
            <div className={styles.imageInfo}>
              <p className={styles.imageName}>{image.filename}</p>
              <p className={styles.imageDate}>{new Date(image.uploaded).toLocaleDateString()}</p>
              <button
                onClick={() => handleDelete(image.id)}
                className={styles.deleteButton}
                disabled={deleting === image.id}
              >
                {deleting === image.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

