const NetworkImages = require("../network/imagesNetwork");

function routes(app) {
    // Todas las rutas de imágenes estarán bajo /images
    app.use("/images", NetworkImages);
}

module.exports = routes;
