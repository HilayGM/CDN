const ServiceLocator = require('./dependencyLocator');
const Cloudflare = require('../cloudflare');

const dl = ServiceLocator.getInstance();

// Registramos el servicio de Cloudflare como Singleton (una sola instancia viva)
function init() {
    dl.bindLazySingleton('Cloudflare', () => Cloudflare.getInstance());
}

// Helper para obtener el servicio en cualquier parte del código
function getCloudflareService() {
    return dl.get('Cloudflare');
}

module.exports = { init, getCloudflareService };
