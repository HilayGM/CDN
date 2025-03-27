const { getCloudflareService } = require('../services/services_locator/composer');

// Controlador para subir imágenes
function onNewImage(path) {
    const cloudflareService = getCloudflareService();
    return cloudflareService.uploadImages(path);
}

// Controlador para eliminar imágenes por ID
function onRemoveImage(imageId) {
    const cloudflareService = getCloudflareService();
    return cloudflareService.removeImage(imageId);
}

function getAllImages() {
    const cloudflareService = getCloudflareService();
    return cloudflareService.getAllImages();
}

module.exports = {
    onNewImage, 
    onRemoveImage,
    getAllImages
};
