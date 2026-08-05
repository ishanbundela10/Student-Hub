import mongoose, { Schema } from "mongoose"
import { User } from "./user.model.js"

const propertyDetailsSchema = new Schema({
    furnishingType: {
        type: String,
        enum: ['furnished', 'semi_furnished', 'unfurnished']
    },
    area: String,
    rooms: Number,
    bathrooms: Number,
    tenants: Number,
    availableFrom: Date,
    amenities: [String],

}, { _id: false })

const visitSlotSchema = new Schema(
    {
        from: {
            type: String,
            required: true,
        },

        to: {
            type: String,
            required: true,
        },
    },
    {
        _id: false,
    }
);

const visitAvailabilitySchema = new Schema(
    {
        day: {
            type: String,
            required: true,
        },

        slots: [visitSlotSchema],
    },
    {
        _id: false,
    }
);

const propertySchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    propertyType: {
        type: String,
        enum: ['room', 'hostel', 'pg'],
        required: true
    },
    contactName: String,
    contactPhone: String,
    contactEmail: String,
    alternatePhone: String,
    visitAvailability: {
        type: [visitAvailabilitySchema],
        default: [],
    },
    price: Number,
    priceType: String,
    securityDeposit: String,
    maintenanceCharge: String,
    description: String,
    propertyDetails: {
        type: propertyDetailsSchema,
        default: {}
    },
    images: [String],
    address: {
        type: String,
        required: true
    },
    city: String,
    state: String,
    pincode: String,
    landmark: String,
    rating: String,
    reviews: String,
    girls_only: Boolean,
    isAvailable: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

export const Property = mongoose.model("Property", propertySchema)