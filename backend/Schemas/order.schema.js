import { Schema } from 'mongoose';

const OrderSchema = new Schema(
    {
        order_id: {
            type: String,
            unique: true,
            required: true
        },
        title: {
            type: String,
            required: true,
        },
        des: {
            type: String,
            default: ''
        },
        order_status: {
            type: Number,
            default: 0 // 0: pending, 1: processing, 2: shipped, 3: delivered, 4: cancelled 
        },
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
    },
    {
        timestamps: {
            createdAt: 'publishedAt'
        }
    }
)

export default OrderSchema;
