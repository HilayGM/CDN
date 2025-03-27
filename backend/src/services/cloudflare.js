const FormData = require('form-data');
const fs = require('fs');
const Client = require('./axios');

class CloudFlare extends Client {
    constructor() {
        super();
    }

    static getInstance() {
        if (!CloudFlare.instance) {
            CloudFlare.instance = new CloudFlare();
        }
        return CloudFlare.instance;
    }

    async uploadImages(path) {
        const file = fs.createReadStream(path);
        const formData = new FormData();
        formData.append('file', file);

        const headers = formData.getHeaders();

        const result = await this.client.post(
            `/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`,
            formData,
            { headers }
        );

        fs.unlinkSync(path);
        return result;
    }

    removeImage(imageId) {
        return this.client.delete(`/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${imageId}`);
    }
    async getAllImages() {
        const result = await this.client.get(
            `/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`
        );
        return result;
    }
}

module.exports = CloudFlare;
