import { Schema } from "mongoose";

const userSchema = Schema(
    {
        personal_info: {
            fullname: {
                type: String,
                lowercase: true,
                required: true,
                minlength: [3, 'fullname must be 3 letters long'],
            },
            mobile: {
                type: String,
                required: true,
                unique: true,
                validate: {
                    validator: function (v) {
                        return /^\+?[1-9]\d{9,14}$/.test(v);
                    },
                    message: props => `${props.value} is not a valid phone number!`
                }
            },
            password: {
                type: String,
                required: true,
                minlength: [8, 'password must be 8 letters long'],
            },
        },
        role: {
            type: Number,
            default: 0 // 0 - customer, 1 - manager 
        },
        orders: {
            type: [Schema.Types.ObjectId],
            ref: 'orders',
            default: [],
        }
    },
    {
        timestamps: {
            createdAt: 'joinedAt'
        }
    }
)

export default userSchema;
