const axios = require('axios');
const jwt = require('jsonwebtoken');
const config = require('../config/config');


async function createCollectRequest(payload) {
    const { school_id, amount, callback_url } = payload;

    // Create the exact JWT payload as per docs
    const jwtPayload = { school_id, amount: amount.toString(), callback_url };

    // Sign it with PG secret key
    const sign = jwt.sign(jwtPayload, config.paymentApi.pgKey, { algorithm: 'HS256' });

    // Prepare body for API
    const body = {
        school_id,
        amount: amount.toString(),
        callback_url,
        sign,
    };

    // Headers
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.paymentApi.apiKey}`, // <-- FIXED
    };

    // Call API
    const url = config.paymentApi.createCollectUrl;
    if (!url) throw new Error('PAYMENT_CREATE_COLLECT_URL not configured');

    const resp = await axios.post(url, body, { headers, timeout: 15000 });
    return resp.data;
}

module.exports = { createCollectRequest };
