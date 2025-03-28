const express = require("express")
const NetworkImages = require("../network/imagesNetwork")

function routes(app) {
  // Todas las rutas de imágenes estarán bajo /images
  app.use("/images", NetworkImages)

  // Verificar que NetworkImages es un router de Express
  console.log("Tipo de NetworkImages:", typeof NetworkImages)
  console.log("¿Es NetworkImages un router de Express?", NetworkImages instanceof express.Router)
}

module.exports = routes

