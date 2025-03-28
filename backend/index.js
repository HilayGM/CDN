const express = require("express")
const app = express()
const routes = require("./src/routes/index")
const port = 3001
const { init } = require("./src/services/services_locator/composer")
const cors = require("cors")
require("dotenv").config()

// Verificar variables de entorno críticas
console.log("Verificando variables de entorno:")
const requiredEnvVars = ["CLOUDFLARE_TOKEN", "CLOUDFLARE_ACCOUNT_ID"]
const missingVars = []

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    missingVars.push(varName)
    console.error(`❌ Variable de entorno ${varName} no está configurada`)
  } else {
    console.log(`✅ Variable de entorno ${varName} configurada correctamente`)
  }
})

if (missingVars.length > 0) {
  console.error(`⚠️ Faltan variables de entorno: ${missingVars.join(", ")}`)
  console.error("Por favor, configura estas variables en un archivo .env")
}

// Habilitamos CORS para permitir peticiones desde el frontend
app.use(cors())

// Middleware para logging de solicitudes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
  next()
})

// Middleware para parsear JSON
app.use(express.json())

// Registramos todas las dependencias que necesitamos (Cloudflare, etc.)
console.log("Inicializando dependencias...")
init()
console.log("Dependencias inicializadas")

// Configuramos nuestras rutas después de tener las dependencias listas
console.log("Configurando rutas...")
routes(app)
console.log("Rutas configuradas")

// Ruta de prueba para verificar que el servidor está funcionando
app.get("/ping", (req, res) => {
  res.json({ message: "pong", timestamp: new Date().toISOString() })
})

// Lanzamos el servidor en el puerto definido
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`)
  console.log(`Prueba la conexión en: http://localhost:${port}/ping`)
  console.log(`Verifica la conexión con Cloudflare en: http://localhost:${port}/images/check-connection`)
})

