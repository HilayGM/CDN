const cors = require("cors")

// Configuración de CORS para permitir solicitudes desde tu frontend
const corsOptions = {
  origin: ["http://localhost:3000", "https://tu-frontend-desplegado.vercel.app"],
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type"],
}

module.exports = corsOptions

