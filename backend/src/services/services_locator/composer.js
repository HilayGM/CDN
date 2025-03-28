const ServiceLocator = require("./dependencyLocator")
const Cloudflare = require("../cloudflare")

const dl = ServiceLocator.getInstance()

// Registramos el servicio de Cloudflare como Singleton (una sola instancia viva)
function init() {
  console.log("Inicializando servicios...")
  try {
    dl.bindLazySingleton("Cloudflare", () => Cloudflare.getInstance())
    console.log("Servicio Cloudflare registrado correctamente")
  } catch (error) {
    console.error("Error al registrar el servicio Cloudflare:", error)
  }
}

// Helper para obtener el servicio en cualquier parte del código
function getCloudflareService() {
  try {
    const service = dl.get("Cloudflare")
    if (!service) {
      console.error("❌ El servicio Cloudflare no está disponible")
    }
    return service
  } catch (error) {
    console.error("❌ Error al obtener el servicio Cloudflare:", error)
    throw error
  }
}

module.exports = { init, getCloudflareService }

