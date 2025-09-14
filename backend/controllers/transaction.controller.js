// const Order = require('../models/order.model');
// const OrderStatus = require('../models/orderStatus.model');
// const mongoose = require('mongoose');

// /*
// * GET /transactions
// * Query params:
// *  - page, limit
// *  - sort (e.g., payment_time), order (asc/desc)
// *  - status (optional)
// */

// exports.getAllTransactions = async (req, res, next) => {
//     try {
//         const page = Math.max(1, parseInt(req.query.page || '1'));
//         const limit = Math.max(1, parseInt(req.query.limit || '10'));
//         const sortField = req.query.sort || 'createdAt';
//         const sortOrder = req.query.order === 'asc' ? 1 : -1;
//         const statusFilter = req.query.status;

//         const match = {};
//         if (statusFilter) match['orderStatus.status'] = statusFilter;

//         // Aggregation join Order -> OrderStatus
//         const pipeline = [
//             {
//                 $lookup: {
//                     from: 'orderstatuses',
//                     localField: '_id',
//                     foreignField: 'collect_id',
//                     as: 'orderStatus'
//                 }
//             },
//             { $unwind: { path: '$orderStatus', preserveNullAndEmptyArrays: true } },
//             { $match: match },
//             {
//                 $project: {
//                     collect_id: '$_id',
//                     school_id: 1,
//                     gateway: '$gateway_name',
//                     order_amount: '$orderStatus.order_amount',
//                     transaction_amount: '$orderStatus.transaction_amount',
//                     status: '$orderStatus.status',
//                     custom_order_id: '$custom_order_id',
//                     payment_time: '$orderStatus.payment_time'
//                 }
//             },
//             { $sort: { [sortField]: sortOrder } },
//             { $skip: (page - 1) * limit },
//             { $limit: limit }
//         ];

//         const results = await Order.aggregate(pipeline);
//         const total = await Order.countDocuments();

//         res.status(200).json({ page, limit, total, data: results });
//     } catch (err) {
//         next(err);
//     }
// };

// exports.getTransactionsBySchool = async (req, res, next) => {
//     try {
//         const schoolId = req.params.schoolId;
//         if (!mongoose.Types.ObjectId.isValid(schoolId)) return res.status(400).json({ message: 'Invalid school id' });
//         const pipeline = [
//             { $match: { school_id: new mongoose.Types.ObjectId(schoolId) } },
//             {
//                 $lookup: {
//                     from: 'orderstatuses',
//                     localField: '_id',
//                     foreignField: 'collect_id',
//                     as: 'orderStatus'
//                 }
//             },
//             { $unwind: { path: '$orderStatus', preserveNullAndEmptyArrays: true } },
//             {
//                 $project: {
//                     collect_id: '$_id',
//                     school_id: 1,
//                     gateway: '$gateway_name',
//                     order_amount: '$orderStatus.order_amount',
//                     transaction_amount: '$orderStatus.transaction_amount',
//                     status: '$orderStatus.status',
//                     custom_order_id: '$custom_order_id'
//                 }
//             }
//         ];

//         const results = await Order.aggregate(pipeline);
//         res.status(200).json({ data: results });
//     } catch (err) {
//         next(err);
//     }
// };

// exports.getTransactionStatus = async (req, res, next) => {
//     try {
//         const custom_order_id = req.params.custom_order_id;
//         const order = await Order.findOne({ custom_order_id });
//         if (!order) return res.status(404).json({ message: 'Order not found' });
//         const status = await OrderStatus.findOne({ collect_id: order._id });
//         if (!status) return res.json({ status: 'not found' });
//         res.status(200).json({ status: status.status, order_status: status });
//     } catch (err) {
//         next(err);
//     }
// };



const Order = require('../models/order.model');
const OrderStatus = require('../models/orderStatus.model');
const mongoose = require('mongoose');

/*
GET /transactions
Supports:
  - ?page, ?limit
  - ?sort=createdAt&order=asc/desc
  - ?status=Success
*/
exports.getAllTransactions = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page || '1'));
        const limit = Math.max(1, parseInt(req.query.limit || '10'));
        const sortField = req.query.sort || 'createdAt';
        const sortOrder = req.query.order === 'asc' ? 1 : -1;
        const statusFilter = req.query.status;

        const match = {};
        if (statusFilter) match['orderStatus.status'] = statusFilter;

        const pipeline = [
            {
                $lookup: {
                    from: 'orderstatuses',
                    localField: '_id',
                    foreignField: 'collect_id',
                    as: 'orderStatus'
                }
            },
            { $unwind: { path: '$orderStatus', preserveNullAndEmptyArrays: true } },
            { $match: match },
            {
                $project: {
                    collect_id: '$_id',
                    school_id: 1,
                    gateway: '$gateway_name',
                    order_amount: '$orderStatus.order_amount',
                    transaction_amount: '$orderStatus.transaction_amount',
                    status: '$orderStatus.status',
                    custom_order_id: '$custom_order_id',
                    payment_time: '$orderStatus.payment_time',
                    payment_url: '$payment_url',
                    createdAt: 1
                }
            },
            { $sort: { [sortField]: sortOrder } },
            { $skip: (page - 1) * limit },
            { $limit: limit }
        ];

        const results = await Order.aggregate(pipeline);

        const countPipeline = [
            {
                $lookup: {
                    from: 'orderstatuses',
                    localField: '_id',
                    foreignField: 'collect_id',
                    as: 'orderStatus'
                }
            },
            { $unwind: { path: '$orderStatus', preserveNullAndEmptyArrays: true } },
            { $match: match },
            { $count: "total" }
        ];
        const countResult = await Order.aggregate(countPipeline);
        const total = countResult[0]?.total || 0;

        res.status(200).json({ page, limit, total, data: results });
    } catch (err) {
        next(err);
    }
};


exports.getTransactionsBySchool = async (req, res, next) => {
    try {
        const schoolId = req.params.schoolId;


        // if (!schoolId) {
        //     res.status(200).json({ message: 'no data found' });
        // }


        if (!mongoose.Types.ObjectId.isValid(schoolId)) {
            return res.status(400).json({ message: 'Invalid school id' });
        }

        const pipeline = [
            { $match: { school_id: new mongoose.Types.ObjectId(schoolId) } },
            {
                $lookup: {
                    from: 'orderstatuses',
                    localField: '_id',
                    foreignField: 'collect_id',
                    as: 'orderStatus'
                }
            },
            { $unwind: { path: '$orderStatus', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    collect_id: '$_id',
                    school_id: 1,
                    gateway: '$gateway_name',
                    order_amount: '$orderStatus.order_amount',
                    transaction_amount: '$orderStatus.transaction_amount',
                    status: '$orderStatus.status',
                    custom_order_id: '$custom_order_id',
                    createdAt: 1
                }
            }
        ];

        const results = await Order.aggregate(pipeline);




        res.status(200).json({ data: results });
    } catch (err) {
        next(err);
    }
};


exports.getTransactionStatus = async (req, res, next) => {
    try {
        const custom_order_id = req.params.custom_order_id;
        const order = await Order.findOne({ custom_order_id });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        const status = await OrderStatus.findOne({ collect_id: order._id });

        res.status(200).json({
            collect_id: order._id,
            custom_order_id: order.custom_order_id,
            school_id: order.school_id,
            gateway: order.gateway_name,
            order_amount: status?.order_amount || null,
            transaction_amount: status?.transaction_amount || null,
            status: status?.status || "unknown",
            createdAt: order.createdAt
        });
    } catch (err) {
        next(err);
    }
};