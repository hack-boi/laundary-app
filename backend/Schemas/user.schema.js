import { Schema } from "mongoose";

const profile_imgs_name_list = [
    "Garfield", "Tinkerbell", "Annie", "Loki", "Cleo", "Angel", "Bob", "Mia",
    "Coco", "Gracie", "Bear", "Bella", "Abby", "Harley", "Cali", "Leo", "Luna",
    "Jack", "Felix", "Kiki"
];

const profile_imgs_collections_list = [
    "notionists-neutral", "adventurer-neutral", "fun-emoji"
];

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
            },
            password: {
                type: String,
                required: true,
                minlength: [8, 'password must be 8 letters long'],
            },
            profile_img: {
                type: String,
                default: () => {
                    return `https://api.dicebear.com/6.x/${profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)]}/svg?seed=${profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)]}`
                }
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
