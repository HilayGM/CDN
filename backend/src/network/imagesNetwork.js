// Corregir la importación del controlador
const ImageController = require("../controllers/imageController")
const express = require("express")
const multer = require("multer")

// Multer guarda la imagen de forma temporal en /uploads
const upload = multer({ dest: "uploads/" })

// Crear un router de Express
const router = express.Router()

// Ruta POST para subir una imagen a Cloudflare
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("Recibiendo solicitud de carga de imagen")

    if (!req.file) {
      console.error("No se recibió ningún archivo")
      return res.status(400).json({ success: false, error: "No se recibió ningún archivo" })
    }

    console.log("Archivo recibido:", req.file.originalname, "tamaño:", req.file.size)

    // Verificar que ImageController.onNewImage existe y es una función
    if (typeof ImageController.onNewImage !== "function") {
      console.error("Error crítico: ImageController.onNewImage no es una función")
      console.error("ImageController:", ImageController)
      return res.status(500).json({
        success: false,
        error: "ImageController.onNewImage is not a function",
        details: null,
      })
    }

    const result = await ImageController.onNewImage(req.file.path)
    console.log("Respuesta de Cloudflare:", JSON.stringify(result.data, null, 2))

    res.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error("Error al subir imagen:", error.message)
    if (error.response) {
      console.error("Detalles del error:", JSON.stringify(error.response.data, null, 2))
    }

    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response ? error.response.data : null,
    })
  }
})

// Ruta DELETE para eliminar imagen desde Cloudflare por ID
router.delete("/delete/:imageId", async (req, res) => {
  try {
    const { imageId } = req.params
    console.log("Eliminando imagen con ID:", imageId)

    const result = await ImageController.onRemoveImage(imageId)
    console.log("Respuesta de eliminación:", JSON.stringify(result.data, null, 2))

    res.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error("Error al eliminar imagen:", error.message)
    res.status(500).json({ success: false, error: error.message })
  }
})

// DELETE con param
router.delete("/delete", async (req, res) => {
  try {
    const imageId = req.query.imageId
    if (!imageId) {
      return res.status(400).json({ error: "Debes proporcionar un imageId en los query params." })
    }

    console.log("Eliminando imagen con ID (query):", imageId)
    const result = await ImageController.onRemoveImage(imageId)

    res.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error("Error al eliminar imagen (query):", error.message)
    res.status(500).json({ success: false, error: error.message })
  }
})

router.get("/list", async (req, res) => {
  try {
    console.log("Obteniendo todas las imágenes")
    const result = await ImageController.getAllImages()

    console.log("Total de imágenes obtenidas:", result.data.images ? result.data.images.length : 0)
    if (result.data.images && result.data.images.length > 0) {
      console.log("Primera imagen:", JSON.stringify(result.data.images[0], null, 2))
    }

    res.json({
      images: result.data.images,
      accountHash: process.env.CLOUDFLARE_ACCOUNT_HASH || "No configurado",
    })
  } catch (error) {
    console.error("Error al obtener todas las imágenes:", error.message)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Nueva ruta para obtener solo las primeras 5 imágenes
router.get("/top", async (req, res) => {
  try {
    const limit = Number.parseInt(req.query.limit) || 5
    console.log(`Obteniendo las primeras ${limit} imágenes`)

    const result = await ImageController.getTopImages(limit)

    console.log("Total de imágenes obtenidas (top):", result.data.images ? result.data.images.length : 0)
    if (result.data.images && result.data.images.length > 0) {
      console.log("Primera imagen (top):", JSON.stringify(result.data.images[0], null, 2))
    }

    res.json({
      images: result.data.images,
      accountHash: process.env.CLOUDFLARE_ACCOUNT_HASH || "No configurado",
    })
  } catch (error) {
    console.error("Error en onGetTopImages:", error.message)
    if (error.response) {
      console.error("Detalles del error:", JSON.stringify(error.response.data, null, 2))
    }

    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response ? error.response.data : null,
    })
  }
})

// Ruta para verificar la conexión con Cloudflare
router.get("/check-connection", async (req, res) => {
  try {
    console.log("Verificando conexión con Cloudflare")

    // Intentamos hacer una petición simple a la API de Cloudflare
    const cloudflareService = require("../services/services_locator/composer").getCloudflareService()
    const result = await cloudflareService.client.get(`/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1/stats`)

    console.log("Conexión con Cloudflare exitosa:", JSON.stringify(result.data, null, 2))

    res.json({
      success: true,
      message: "Conexión con Cloudflare establecida correctamente",
      data: result.data,
      accountHash: process.env.CLOUDFLARE_ACCOUNT_HASH || "No configurado",
    })
  } catch (error) {
    console.error("Error al verificar conexión con Cloudflare:", error.message)

    const errorDetails = {
      message: error.message,
      code: error.code || "UNKNOWN",
    }

    if (error.response) {
      errorDetails.status = error.response.status
      errorDetails.data = error.response.data
    }

    res.status(500).json({
      success: false,
      error: "No se pudo conectar con Cloudflare",
      details: errorDetails,
    })
  }
})

// Nueva ruta para obtener información detallada de las imágenes
router.get("/details", async (req, res) => {
  try {
    console.log("Obteniendo información detallada de las imágenes")

    const cloudflareService = require("../services/services_locator/composer").getCloudflareService()
    const result = await cloudflareService.getImageDetails()

    res.json({
      success: true,
      data: result.data,
      accountHash: process.env.CLOUDFLARE_ACCOUNT_HASH || "No configurado",
    })
  } catch (error) {
    console.error("Error al obtener detalles de las imágenes:", error.message)

    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Ruta para obtener el hash de la cuenta de Cloudflare
router.get("/account-hash", async (req, res) => {
  try {
    console.log("Intentando obtener el account hash de Cloudflare")

    // Intentamos obtener una imagen directamente de la API
    const cloudflareService = require("../services/services_locator/composer").getCloudflareService()
    const result = await cloudflareService.client.get(`/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`)

    console.log("Respuesta completa de Cloudflare:", JSON.stringify(result.data, null, 2))

    // Intentar extraer el hash de diferentes partes de la respuesta
    let accountHash = process.env.CLOUDFLARE_ACCOUNT_HASH || null

    // Si ya tenemos el hash en las variables de entorno, usarlo
    if (accountHash) {
      console.log("Using account hash from environment variable:", accountHash)
    } else {
      console.log("Account hash not found in environment variables, trying to extract from API response")

      // Método 1: Buscar en las variantes de las imágenes
      if (result.data.result && result.data.result.images && result.data.result.images.length > 0) {
        const image = result.data.result.images[0]
        if (image.variants && image.variants.length > 0) {
          const variantUrl = image.variants[0]
          const match = variantUrl.match(/imagedelivery\.net\/([^/]+)/)
          if (match && match[1]) {
            accountHash = match[1]
            console.log("Extracted account hash from image variant:", accountHash)
          }
        }
      }
    }

    res.json({
      success: true,
      message: accountHash ? "Account hash encontrado" : "No se pudo encontrar el account hash",
      accountHash: accountHash,
    })
  } catch (error) {
    console.error("Error al obtener account hash:", error.message)

    const errorDetails = {
      message: error.message,
      code: error.code || "UNKNOWN",
    }

    if (error.response) {
      errorDetails.status = error.response.status
      errorDetails.data = error.response.data
    }

    res.status(500).json({
      success: false,
      error: "No se pudo obtener el account hash",
      details: errorDetails,
    })
  }
})

// Exportar el router
module.exports = router

