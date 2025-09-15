const jwt = require("jsonwebtoken");
const paymentService = require('../services/payment.service');
const Order = require('../models/order.model');
const OrderStatus = require('../models/orderStatus.model');

exports.createPayment = async (req, res, next) => {
    try {
        const { order_id, order_amount, student_info, gateway_name, date } = req.body;

        const generatedId = "ORD-" + Date.now(); // like- ORD-1725961718217
        const customOrderId = order_id || generatedId;

        // Create Order
        const order = new Order({
            school_id: req.body.school_id || req.user.school_id || null,
            trustee_id: req.body.trustee_id || null,
            student_info: student_info || {},
            gateway_name: gateway_name || "unknown",
            custom_order_id: customOrderId,
            date
        });
        await order.save();
        console.log("Order created");

        // Create OrderStatus
        const status = new OrderStatus({
            collect_id: order._id,
            order_amount,
            status: "pending",
        });
        await status.save();
        console.log("Order Status saved");

        // payload 
        const callbackUrl = `${process.env.FRONTEND_URL}/payment/callback`;

        const signPayload = {
            school_id: order.school_id.toString(),
            amount: order_amount.toString(),
            callback_url: callbackUrl,
        };

        // Sign with pg key
        const sign = jwt.sign(signPayload, process.env.PG_KEY);

        const paymentPayload = {
            school_id: order.school_id.toString(),
            amount: order_amount.toString(),
            callback_url: callbackUrl,
            sign,
        };

        // Call Payment API
        const resp = await paymentService.createCollectRequest(paymentPayload);
        console.log("Payment API called");

        // Extract payment url

        const paymentUrl = resp.collect_request_url || resp.payment_url || resp.redirect_url;


        if (!paymentUrl) {
            return res.status(502).json({ message: "Payment gateway did not return a payment url", raw: resp });
        }

        order.payment_url = paymentUrl;
        await order.save();
        console.log("Payment Url saved in order");


        status.payment_url = paymentUrl;
        await status.save();
        console.log("Payment Url saved in order status");




        res.status(200).json({ message: "Payment initiated successfully", payment_url: paymentUrl, custom_order_id: customOrderId, order, orderStatus: status });
    } catch (err) {
        console.error("Payment error", err);
        next(err);
    }
};