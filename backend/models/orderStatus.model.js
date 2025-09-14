const mongoose = require('mongoose');

const OrderStatusSchema = new mongoose.Schema({
    collect_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    order_amount: { type: Number, required: true },
    transaction_amount: { type: Number },
    payment_mode: { type: String },
    payment_details: { type: String },
    bank_reference: { type: String },
    payment_message: { type: String },
    payment_url: { type: String },
    status: { type: String, enum: ['success', 'pending', 'failed'], index: true },
    date: { type: Date, default: Date.now() },
    error_message: { type: String },
    payment_time: { type: Date, default: Date.now() }
}, { timestamps: true });

module.exports = mongoose.model('OrderStatus', OrderStatusSchema);
