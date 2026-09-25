import mongoose from "mongoose";

const tiffinSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    foodType: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        default: [],
    },
    pricing: {
        oneTime: {
            type: Number,
            required: true,
        },
        weekly: {
            type: Number,
            default: null,
        },
        monthly: {
            type: Number,
            default: null,
        },
    },
    itemsIncluded: [
        {
            itemName: {
                type: String,
                required: true,
            },
            quantity: {
                type: String,
                required: true,
            }
        }
    ],
    details: {
        mealTime: {
            type: String,
            default: "Both",
        },
        calories: {
            type: String,
            default: "",
        },
        preparationType: {
            type: String,
            default: "Home-style less oil",
        },
        packaging: {
            type: String,
            default: "Eco-friendly insulated box",
        },
        deliverySlots: {
            type: [String],
            default: [],
        },
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

export const Tiffin = mongoose.model("Tiffin", tiffinSchema);