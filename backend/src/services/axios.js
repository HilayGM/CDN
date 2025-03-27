require('dotenv').config();
const axios = require('axios');

class Client {
    client;
    constructor() {
        this.client = axios.create({
            baseURL: 'https://api.cloudflare.com/client/v4',
            headers: {
                'Authorization': `Bearer ${process.env.CLOUDFLARE_TOKEN}`
            }
        });
    }
}

module.exports = Client;
