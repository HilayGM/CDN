"use client"

import { useState, useEffect } from "react"
import styles from "./image-gallery.module.css"
import ImageModal from "./image-modal"

interface CloudflareImage {
  id: string
  filename: string
  uploaded: string
  requireSignedURLs: boolean
  variants: string[]
  details?: any
}

export default function ImageGallery() {
  const [images, setImages] = useState<CloudflareImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedImage, setSelectedImage] = useState<CloudflareImage | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [accountHash, setAccountHash] = useState<string | null>(process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH || null)

  const fetchImages = async () => {
    try {
      setLoading(true)
      setError("")
      setDebugInfo(null)

      console.log("Fetching images from backend...")
      // Usamos el endpoint para obtener las primeras 5 imágenes
      const response = await fetch("http://localhost:3001/images/top?limit=5")

      console.log("Response status:", response.status)
      const data = await response.json()
      console.log("Response data:", data)

      // Guardar información de depuración
      setDebugInfo(data)

      // Guardar el account hash si está disponible
      if (data.accountHash && data.accountHash !== "No configurado") {
        setAccountHash(data.accountHash)
        console.log("Account hash set:", data.accountHash)
      }

      if (!response.ok) {
        throw new Error(data.error || "Error al obtener imágenes")
      }

      if (!data.images || !Array.isArray(data.images)) {
        console.warn("No se recibieron imágenes o el formato es incorrecto:", data)
        setImages([])
      } else {
        console.log(`Recibidas ${data.images.length} imágenes`)

        // Procesar las imágenes para asegurar que tengan URLs correctas
        const processedImages = data.images.map((img: CloudflareImage) => {
          if (!img.variants || img.variants.length === 0) {
            return {
              ...img,
              variants: accountHash ? [`https://imagedelivery.net/${accountHash}/${img.id}/public`] : [],
            }
          }
          return img
        })

        setImages(processedImages)
      }
    } catch (error) {
      console.error("Error fetching images:", error)

      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        setError("No se puede conectar al servidor. Verifica que el backend esté ejecutándose en el puerto 3001.")
      } else {
        setError(`Error al cargar imágenes: ${error instanceof Error ? error.message : "Error desconocido"}`)
      }
    } finally {
      setLoading(false)
    }
  }

  // Función para obtener la URL con el tamaño específico
  const getResizedImageUrl = (url: string, size: number) => {
    if (!url) {
      return `/placeholder.svg?height=${size}&width=${size}`
    }

    // Si la URL ya tiene parámetros, añadir los nuevos parámetros
    if (url.includes("?")) {
      return `${url}&width=${size}&height=${size}&fit=cover`
    }

    // Si no tiene parámetros, añadirlos
    return `${url}?width=${size}&height=${size}&fit=cover`
  }

  useEffect(() => {
    fetchImages()
  }, [])

  if (loading && images.length === 0) {
    return <div className={styles.loading}>Cargando imágenes...</div>
  }

  if (error && images.length === 0) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={fetchImages} className={styles.retryButton}>
          Reintentar
        </button>

        {/* Mostrar información de depuración */}
        {debugInfo && (
          <div className={styles.debugInfo}>
            <h4>Información de depuración:</h4>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No se encontraron imágenes. ¡Sube tu primera imagen!</p>

        {/* Mostrar información de depuración */}
        {debugInfo && (
          <div className={styles.debugInfo}>
            <h4>Información de depuración:</h4>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={styles.gallery}>
      <h2>Imágenes de Cloudflare</h2>

      {/* Botón para recargar imágenes */}
      <button onClick={fetchImages} className={styles.reloadButton}>
        Recargar imágenes
      </button>

      <div className={styles.grid}>
        {images.map((image) => {
          // Determinar la URL de la imagen
          const imageUrl =
            image.variants && image.variants.length > 0
              ? image.variants[0]
              : accountHash
                ? `https://imagedelivery.net/${accountHash}/${image.id}/public`
                : null

          return (
            <div key={image.id} className={styles.imageCard} onClick={() => setSelectedImage(image)}>
              <div className={styles.imageWrapper}>
                <img
                  src={imageUrl ? getResizedImageUrl(imageUrl, 250) : "/placeholder.svg?height=250&width=250"}
                  alt={image.filename}
                  className={styles.image}
                  width={250}
                  height={250}
                  onError={(e) => {
                    console.error(`Error loading image: ${imageUrl}`)
                    // Cambiar a imagen de error
                    e.currentTarget.src = "/placeholder.svg?height=250&width=250"
                  }}
                />
              </div>
              <div className={styles.imageInfo}>
                <p className={styles.imageName}>{image.filename}</p>
                <p className={styles.imageId}>ID: {image.id.substring(0, 8)}...</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal para mostrar la imagen ampliada */}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          getResizedImageUrl={getResizedImageUrl}
          accountHash={accountHash || ""}
        />
      )}

      {/* Información de depuración (oculta por defecto) */}
      <details className={styles.debugDetails}>
        <summary>Mostrar información de depuración</summary>
        <div className={styles.debugInfo}>
          <h4>Respuesta del servidor:</h4>
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>

          <h4>Account Hash:</h4>
          <pre>{accountHash || "No disponible"}</pre>
        </div>
      </details>
    </div>
  )
}

