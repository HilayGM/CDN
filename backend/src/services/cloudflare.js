const FormData = require("form-data")
const fs = require("fs")
const Client = require("./axios")

class CloudFlare extends Client {
  constructor() {
    super()
    console.log("CloudFlare service initialized")
    console.log("Using account ID:", process.env.CLOUDFLARE_ACCOUNT_ID)
    // No imprimir el token completo por seguridad
    console.log(
      "Token configured:",
      process.env.CLOUDFLARE_TOKEN ? "Yes (length: " + process.env.CLOUDFLARE_TOKEN.length + ")" : "No",
    )
    console.log("Account Hash:", process.env.CLOUDFLARE_ACCOUNT_HASH || "Not configured")
  }

  static getInstance() {
    if (!CloudFlare.instance) {
      CloudFlare.instance = new CloudFlare()
    }
    return CloudFlare.instance
  }

  async uploadImages(path) {
    try {
      console.log("Uploading image from path:", path)

      if (!fs.existsSync(path)) {
        throw new Error(`El archivo no existe en la ruta: ${path}`)
      }

      const stats = fs.statSync(path)
      console.log("File size:", stats.size, "bytes")

      const file = fs.createReadStream(path)
      const formData = new FormData()
      formData.append("file", file)

      const headers = formData.getHeaders()
      console.log("Request headers:", headers)

      console.log("Sending request to Cloudflare...")
      const result = await this.client.post(`/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`, formData, {
        headers,
      })

      console.log("Upload successful, response:", JSON.stringify(result.data, null, 2))

      // Eliminar el archivo temporal después de subirlo
      fs.unlinkSync(path)
      return result
    } catch (error) {
      console.error("Error uploading image:", error.message)
      if (error.response) {
        console.error("Response error data:", JSON.stringify(error.response.data, null, 2))
      }
      throw error
    }
  }

  async removeImage(imageId) {
    try {
      console.log("Removing image with ID:", imageId)

      const result = await this.client.delete(`/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${imageId}`)

      console.log("Image removed successfully")
      return result
    } catch (error) {
      console.error("Error removing image:", error.message)
      throw error
    }
  }

  async getAllImages() {
    try {
      console.log("Getting all images from Cloudflare")

      const result = await this.client.get(`/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`)

      console.log(
        "Got images, count:",
        result.data.result && result.data.result.images ? result.data.result.images.length : 0,
      )

      // Procesar las URLs de las imágenes para asegurar que sean correctas
      if (result.data.result && result.data.result.images && result.data.result.images.length > 0) {
        result.data.result.images = this.processImageUrls(result.data.result.images)
      }

      return {
        data: {
          images: result.data.result && result.data.result.images ? result.data.result.images : [],
        },
      }
    } catch (error) {
      console.error("Error getting all images:", error.message)
      throw error
    }
  }

  // Método para obtener solo las primeras imágenes
  async getTopImages(limit = 5) {
    try {
      console.log(`Getting top ${limit} images from Cloudflare`)

      const result = await this.client.get(`/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1?per_page=${limit}`)

      console.log(
        "Got top images, count:",
        result.data.result && result.data.result.images ? result.data.result.images.length : 0,
      )

      // Procesar las URLs de las imágenes para asegurar que sean correctas
      if (result.data.result && result.data.result.images && result.data.result.images.length > 0) {
        result.data.result.images = this.processImageUrls(result.data.result.images)
      }

      return {
        data: {
          images: result.data.result && result.data.result.images ? result.data.result.images : [],
        },
      }
    } catch (error) {
      console.error("Error getting top images:", error.message)
      throw error
    }
  }

  // Método para procesar y corregir las URLs de las imágenes
  processImageUrls(images) {
    return images.map((image) => {
      // Asegurarse de que las variantes tengan URLs completas
      if (!image.variants || !Array.isArray(image.variants) || image.variants.length === 0) {
        image.variants = []
      }

      // Añadir la URL predeterminada si tenemos el account hash
      if (process.env.CLOUDFLARE_ACCOUNT_HASH) {
        const defaultUrl = `https://imagedelivery.net/${process.env.CLOUDFLARE_ACCOUNT_HASH}/${image.id}/public`

        // Solo añadir si no existe ya
        if (!image.variants.includes(defaultUrl)) {
          image.variants.push(defaultUrl)
        }
      }

      return image
    })
  }

  // Método para obtener información detallada de las imágenes
  async getImageDetails() {
    try {
      console.log("Getting detailed image information")

      // Primero obtenemos la lista de imágenes
      const result = await this.getAllImages()

      if (!result.data.images || result.data.images.length === 0) {
        console.log("No images found")
        return { data: { images: [] } }
      }

      // Para cada imagen, obtenemos detalles adicionales
      const detailedImages = await Promise.all(
        result.data.images.map(async (image) => {
          try {
            const detailsResult = await this.client.get(
              `/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${image.id}`,
            )

            return {
              ...image,
              details: detailsResult.data.result,
            }
          } catch (error) {
            console.error(`Error getting details for image ${image.id}:`, error.message)
            return image
          }
        }),
      )

      result.data.images = detailedImages
      return result
    } catch (error) {
      console.error("Error getting image details:", error.message)
      throw error
    }
  }
}

module.exports = CloudFlare

