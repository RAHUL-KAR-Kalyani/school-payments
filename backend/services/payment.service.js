const axios = require('axios');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * createCollectRequest:
 * - This function posts to the configured payment create-collect endpoint.
 * - The exact request shape depends on the external docs. We sign a JWT payload (if required)
 *   using the configured PG key and include API Key header.
 */
async function createCollectRequest(payload) {
    const { school_id, amount, callback_url } = payload;

    // 1. Create the exact JWT payload as per docs
    const jwtPayload = { school_id, amount: amount.toString(), callback_url };

    // 2. Sign it with PG secret key
    const sign = jwt.sign(jwtPayload, config.paymentApi.pgKey, { algorithm: 'HS256' });

    // 3. Prepare body for API
    const body = {
        school_id,
        amount: amount.toString(),
        callback_url,
        sign,
    };

    // 4. Headers
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.paymentApi.apiKey}`, // <-- FIXED
    };

    // 5. Call API
    const url = config.paymentApi.createCollectUrl;
    if (!url) throw new Error('PAYMENT_CREATE_COLLECT_URL not configured');

    const resp = await axios.post(url, body, { headers, timeout: 15000 });
    return resp.data;
}

module.exports = { createCollectRequest };
