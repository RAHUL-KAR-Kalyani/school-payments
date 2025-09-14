// simple seeder to create sample orders and statuses
const mongoose = require('mongoose');
const config = require('../src/config/config');
const Order = require('../src/models/order.model');
const OrderStatus = require('../src/models/orderStatus.model');

async function seed() {
    await mongoose.connect(config.mongoUri);
    await Order.deleteMany({});
    await OrderStatus.deleteMany({});

    const orders = [];
    for (let i = 0; i < 10; i++) {
        const o = new Order({
            school_id: new mongoose.Types.ObjectId(),
            trustee_id: new mongoose.Types.ObjectId(),
            student_info: { name: `Student ${i + 1}`, id: `S${1000 + i}`, email: `s${i + 1}@school.com` },
            gateway_name: 'DemoGateway',
            custom_order_id: `ORDER-${Date.now()}-${i}`
        });
        await o.save();
        const os = new OrderStatus({
            collect_id: o._id,
            order_amount: 1000 + i * 100,
            transaction_amount: 1000 + i * 100,
            status: i % 2 === 0 ? 'success' : 'pending',
            payment_time: new Date()
        });
        await os.save();
        orders.push(o);
    }

    console.log('Seeded', orders.length);
    process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
