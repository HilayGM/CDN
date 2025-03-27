// Aquí vive nuestro patrón Singleton e Inyección de Dependencias
class DependencyLocator {
    factories = new Map();
    lazySingletons = new Map();
    static instance;

    constructor() {}

    // Registro tipo factory
    bindFactory(token, fn) {
        this.factories.set(token, { type: 'factory', fn });
    }

    // Registro tipo singleton (se crea solo una vez)
    bindLazySingleton(token, fn) {
        this.factories.set(token, { type: 'lazySingleton', fn });
    }

    // Singleton del ServiceLocator mismo
    static getInstance() {
        if (!DependencyLocator.instance) {
            DependencyLocator.instance = new DependencyLocator();
        }
        return DependencyLocator.instance;
    }

    // Obtener instancia registrada
    get(token) {
        const factory = this.factories.get(token);
        if (!factory) {
            throw new Error(`❌ Dependency ${token} no está registrada`);
        }
        if (factory.type === 'lazySingleton') {
            const singleton = this.lazySingletons.get(token) || factory.fn();
            this.lazySingletons.set(token, singleton);
            return singleton;
        } else {
            return factory.fn();
        }
    }

    // Limpieza total (por si se requiere)
    clear() {
        this.factories.clear();
        this.lazySingletons.clear();
    }
}

module.exports = DependencyLocator;
