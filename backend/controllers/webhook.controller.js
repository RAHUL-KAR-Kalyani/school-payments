const WebhookLog = require('../models/webhookLog.model');
const OrderStatus = require('../models/orderStatus.model');
const Order = require('../models/order.model');


exports.handleWebhook = async (req, res, next) => {
    try {
        const payload = req.body;
        // Save raw payload for audit

        const log = new WebhookLog({ rawPayload: payload });
        await log.save();

        if (!payload || !payload.order_info) {
            log.processed = false;
            log.notes = 'Missing order_info';
            await log.save();
            return res.status(400).json({ message: 'Missing order_info' });
        }

        // parse order_id. You said "order_id": "collect_id/transaction_id"

        let collectIdStr = payload.order_info.order_id;
        

        let order = null;
        if (collectIdStr) {
            // try by custom_order_id
            order = await Order.findOne({ custom_order_id: collectIdStr });
            if (!order) {
                const mongoose = require('mongoose');
                if (mongoose.Types.ObjectId.isValid(collectIdStr)) {
                    order = await Order.findById(collectIdStr);
                }
            }
        }

        if (!order) {
            log.processed = false;
            log.notes = 'Order not found for order_id: ' + collectIdStr;
            await log.save();
            return res.status(404).json({ message: 'Order not found' });
        }

        // Upsert OrderStatus based on collect_id

        const info = payload.order_info;
        const filter = { collect_id: order._id };
        const update = {
            order_amount: info.order_amount,
            transaction_amount: info.transaction_amount,
            bank_reference: info.bank_reference,
            status: info.status,
            payment_mode: info.payment_mode,
            payment_details: info.payemnt_details || info.payment_details || '',
            payment_message: info.Payment_message || info.payment_message || '',
            error_message: info.error_message,
            payment_time: info.payment_time ? new Date(info.payment_time) : undefined
        };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };

        const updated = await OrderStatus.findOneAndUpdate(filter, { $set: update }, options);

        log.processed = true;
        log.notes = 'OrderStatus updated: ' + (updated ? updated._id : 'none');
        await log.save();

        res.status(200).json({ message: 'ok', updated });
    } catch (err) {
        next(err);
    }
};


exports.updateTransactionStatus = async (req, res, next) => {
    try {
        const payload = req.body;
        const log = new WebhookLog({ rawPayload: payload });
        await log.save();

        if (!payload || !payload.order_info) {
            log.processed = false;
            log.notes = 'Missing order_info';
            await log.save();
            return res.status(400).json({ message: 'Missing order_info' });
        }

        let collectIdStr = payload.order_info.order_id;

        let order = null;

        if (collectIdStr) {
            order = await Order.findOne({ custom_order_id: collectIdStr });
            if (!order) {
                const mongoose = require('mongoose');
                if (mongoose.Types.ObjectId.isValid(collectIdStr)) {
                    order = await Order.findById(collectIdStr);
                }
            }
        }

        if (!order) {
            log.processed = false;
            log.notes = 'Order not found for order_id: ' + collectIdStr;
            await log.save();
            return res.status(404).json({ message: 'Order not found' });
        }

        const info = payload.order_info;
        const filter = { collect_id: order._id };
        const update = {
            order_amount: info.order_amount,
            transaction_amount: info.transaction_amount,
            bank_reference: info.bank_reference,
            status: info.status,
            payment_mode: info.payment_mode,
            payment_details: info.payemnt_details || info.payment_details || '',
            payment_message: info.Payment_message || info.payment_message || '',
            error_message: info.error_message,
            payment_time: info.payment_time ? new Date(info.payment_time) : undefined
        };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };

        const updated = await OrderStatus.findOneAndUpdate(filter, { $set: update }, options);

        log.processed = true;
        log.notes = 'OrderStatus updated: ' + (updated ? updated._id : 'none');
        await log.save();

        res.status(200).json({ message: 'ok', updated });
    } catch (err) {
        next(err);
    }
};


exports.paymentWebhook = async (req, res) => {
    try {
        const event = req.body;

        const { custom_order_id, payment_status } = event;

        let newStatus = "failed";
        if (payment_status === "success") newStatus = "confirmed";

        await Order.updateOne(
            { custom_order_id },
            { $set: { "orderStatus.status": newStatus } }
        );

        res.status(200).json({ success: true });
    } catch (err) {
        console.error("Webhook error:", err);
        res.status(500).json({ success: false });
    }
};
