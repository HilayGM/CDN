const Controller = require('../controllers/imageController');
const express = require('express');
const multer = require('multer');

// Multer guarda la imagen de forma temporal en /uploads
const upload = multer({ dest: 'uploads/' });

const routes = express.Router();

// Ruta POST para subir una imagen a Cloudflare
async function imagesNetwork(request, response) {
    const file = request.file;
    const result = await Controller.onNewImage(file.path);
    response.send(result.data);
}

// Ruta DELETE para eliminar imagen desde Cloudflare por ID
async function onRemoveImage(req, res) {
    const { imageId } = req.params;
    const result = await Controller.onRemoveImage(imageId);
    res.send(result.data);
}
// DELETE con param
async function onRemoveImageByQuery(req, res) {
    const imageId = req.query.imageId;
    if (!imageId) {
        return res.status(400).json({ error: "Debes proporcionar un imageId en los query params." });
    }
    const result = await Controller.onRemoveImage(imageId);
    res.send(result.data);
}
async function onGetAllImages(req, res) {
    const result = await Controller.getAllImages();
    res.send(result.data);
}
routes.delete("/delete", onRemoveImageByQuery);   
routes.post("/upload", upload.single('file'), imagesNetwork);
routes.delete("/delete/:imageId", onRemoveImage);
routes.get("/list", onGetAllImages); 
module.exports = routes;
