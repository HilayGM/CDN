"use client"

import type React from "react"

import { useEffect } from "react"
import styles from "./image-modal.module.css"

interface CloudflareImage {
  id: string
  filename: string
  uploaded: string
  requireSignedURLs: boolean
  variants: string[]
  details?: any
}

interface ImageModalProps {
  image: CloudflareImage
  onClose: () => void
  getResizedImageUrl: (url: string, size: number) => string
  accountHash: string
}

export default function ImageModal({ image, onClose, getResizedImageUrl, accountHash }: ImageModalProps) {
  // Cerrar el modal con la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    // Prevenir el scroll del body mientras el modal está abierto
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "auto"
    }
  }, [onClose])

  // Cerrar el modal si se hace clic fuera de la imagen
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Determinar la URL de la imagen
  const imageUrl =
    image.variants && image.variants.length > 0
      ? image.variants[0]
      : accountHash
        ? `https://imagedelivery.net/${accountHash}/${image.id}/public`
        : null

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        <div className={styles.imageContainer}>
          <img
            src={imageUrl ? getResizedImageUrl(imageUrl, 750) : "/placeholder.svg?height=750&width=750"}
            alt={image.filename}
            className={styles.modalImage}
            width={750}
            height={750}
            onError={(e) => {
              console.error(`Error loading image in modal: ${imageUrl}`)
              e.currentTarget.src = "/placeholder.svg?height=750&width=750"
            }}
          />
        </div>

        <div className={styles.imageDetails}>
          <h3>{image.filename}</h3>
          <p>Subida: {new Date(image.uploaded).toLocaleDateString()}</p>
          <p>ID: {image.id}</p>

          {/* Mostrar URL de la imagen */}
          {imageUrl && (
            <div className={styles.imageUrl}>
              <p>URL:</p>
              <input
                type="text"
                value={imageUrl}
                readOnly
                onClick={(e) => e.currentTarget.select()}
                className={styles.urlInput}
              />
            </div>
          )}

          {/* Mostrar detalles adicionales si están disponibles */}
          {image.details && (
            <details className={styles.additionalDetails}>
              <summary>Detalles adicionales</summary>
              <pre>{JSON.stringify(image.details, null, 2)}</pre>
            </details>
          )}
        </div>
      </div>
    </div>
  )
}

