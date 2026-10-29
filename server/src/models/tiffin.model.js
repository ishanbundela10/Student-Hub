import mongoose, { Schema } from "mongoose";

const tiffinSchema = new Schema(
  {
    // Basic Info
    kitchenName: { type: String, required: true, trim: true },
    providerName: { type: String, required: true },
    description: { type: String, required: true }, // "Tell us about your food..."
    
    // Food Details
    foodType: {
      type: String,
      enum: ["Pure Veg", "Non-Veg", "Jain", "Vegan"],
      default: "Pure Veg",
      required: true,
    },
    
    // 🌟 MAGIC FIX: Instead of complex arrays, we ask for a simple description of a normal plate.
    typicalMeal: {
      type: String, 
      required: true 
      // e.g., "4 Roti, 1 Dal, 1 Dry Sabzi, Rice. Sabzi changes daily."
    },

    // Simplified Pricing
    pricing: {
      pricePerMeal: { type: Number, required: true }, // e.g., 80
      pricePerMonth: { type: Number }, // e.g., 2200 (Optional)
    },
    
    deliveryOptions: {
      type: String,
      enum: ["Home Delivery", "Self Pickup", "Both"],
      default: "Home Delivery"
    },
    
    contactPhone: { type: String, required: true },
    
    thumbnail: { type: String, required: true },
    
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    mealTime: { type: String, enum: ["Lunch", "Dinner", "Both"], default: "Both" },
    
    timing: {
      lunch: { type: String }, // e.g. "12:30 PM to 2:00 PM"
      dinner: { type: String } // e.g. "7:30 PM to 9:00 PM"
    },
    
    address: {
      area: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },     // NEW
      pincode: { type: String, required: true },   // NEW
    },
  },
  { timestamps: true }
);

export const Tiffin = mongoose.model("Tiffin", tiffinSchema);