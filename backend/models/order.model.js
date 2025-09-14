const mongoose = require('mongoose');

const StudentInfoSchema = new mongoose.Schema({
    name: String,
    id: String,
    email: String
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    school_id: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    trustee_id: { type: mongoose.Schema.Types.ObjectId, required: false },
    student_info: StudentInfoSchema,
    gateway_name: { type: String },
    payment_url: { type: String },
    date: { type: Date, default: Date.now() },
    custom_order_id: { type: String, index: true }, // helpful unique identifier
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);

