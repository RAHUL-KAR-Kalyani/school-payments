const mongoose = require('mongoose');

const WebhookLogSchema = new mongoose.Schema({
    rawPayload: { type: Object },
    receivedAt: { type: Date, default: Date.now },
    processed: { type: Boolean, default: false },
    notes: { type: String }
});

module.exports = mongoose.model('WebhookLog', WebhookLogSchema);
