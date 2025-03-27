const express = require("express")
const app = express()
const routes = require("./src/routes/index")
const port = 3001
const { init } = require("./src/services/services_locator/composer")
const cors = require("cors")
const corsOptions = require("./cors-config")

// Habilitamos CORS para permitir solicitudes desde el frontend
app.use(cors(corsOptions))

// Registramos todas las dependencias que necesitamos (Cloudflare, etc.)
init()

// Configuramos nuestras rutas después de tener las dependencias listas
routes(app)

// Lanzamos el servidor en el puerto definido
app.listen(port, () => {
  console.log(` Servidor escuchando en el puerto ${port}`)
})

