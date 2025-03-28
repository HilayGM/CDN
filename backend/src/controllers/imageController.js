const { getCloudflareService } = require("../services/services_locator/composer")

// Controlador para subir imágenes
function onNewImage(path) {
  console.log("ImageController.onNewImage llamado con path:", path)
  const cloudflareService = getCloudflareService()
  return cloudflareService.uploadImages(path)
}

// Controlador para eliminar imágenes por ID
function onRemoveImage(imageId) {
  console.log("ImageController.onRemoveImage llamado con imageId:", imageId)
  const cloudflareService = getCloudflareService()
  return cloudflareService.removeImage(imageId)
}

function getAllImages() {
  console.log("ImageController.getAllImages llamado")
  const cloudflareService = getCloudflareService()
  return cloudflareService.getAllImages()
}

// Controlador para obtener solo las primeras 5 imágenes
function getTopImages(limit = 5) {
  console.log("ImageController.getTopImages llamado con limit:", limit)
  const cloudflareService = getCloudflareService()
  return cloudflareService.getTopImages(limit)
}

// Nuevo controlador para obtener detalles de las imágenes
function getImageDetails() {
  console.log("ImageController.getImageDetails llamado")
  const cloudflareService = getCloudflareService()
  return cloudflareService.getImageDetails()
}

// Exportar todas las funciones
const controller = {
  onNewImage,
  onRemoveImage,
  getAllImages,
  getTopImages,
  getImageDetails,
}

// Verificar que todas las funciones existen
console.log("Exportando controlador de imágenes con funciones:", Object.keys(controller))

module.exports = controller

