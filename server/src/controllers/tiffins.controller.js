import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tiffin } from "../models/tiffin.model.js";
import { UploadOnCloudinary } from "../utils/Cloudinary.js";

export const addTiffin = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        foodType,
        oneTimePrice,
        weeklyPrice,
        monthlyPrice,
        mealTime,
        calories,
        preparationType,
        packaging,
        deliverySlots,
        itemsIncluded // 👈 Ye frontend se String format me aa raha hai
    } = req.body;

    // 1. Thumbnail Image Upload
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail image is required");
    }

    const thumbnail = await UploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail?.url) {
        throw new ApiError(400, "Error uploading thumbnail to Cloudinary");
    }

    // 2. Extra Images (Optional)
    let images = [];
    if (req.files?.images && req.files.images.length > 0) {
        for (const file of req.files.images) {
            const uploaded = await UploadOnCloudinary(file.path);
            if (uploaded?.url) {
                images.push(uploaded.url);
            }
        }
    }

    // 3. 🚨 YE CRITICAL STEP HAI: JSON.parse karo
    let parsedItems = [];
    if (itemsIncluded) {
        try {
            parsedItems = typeof itemsIncluded === "string" 
                ? JSON.parse(itemsIncluded) 
                : itemsIncluded;
        } catch (error) {
            throw new ApiError(400, "Invalid format for itemsIncluded");
        }
    }

    let parsedDeliverySlots = [];
    if (deliverySlots) {
        try {
            parsedDeliverySlots = typeof deliverySlots === "string"
                ? JSON.parse(deliverySlots)
                : deliverySlots;
        } catch (error) {
            parsedDeliverySlots = [deliverySlots];
        }
    }

    // 4. Create in Database
    const tiffin = await Tiffin.create({
        name,
        description,
        foodType,
        thumbnail: thumbnail.url,
        images,
        pricing: {
            oneTime: Number(oneTimePrice),
            weekly: weeklyPrice ? Number(weeklyPrice) : undefined,
            monthly: monthlyPrice ? Number(monthlyPrice) : undefined,
        },
        itemsIncluded: parsedItems, // 👈 Parsed Array of Objects pass karo
        details: {
            mealTime: mealTime || "Both",
            calories: calories || "",
            preparationType: preparationType || "Home-style less oil",
            packaging: packaging || "Eco-friendly insulated box",
            deliverySlots: parsedDeliverySlots,
        },
        isAvailable: true,
    });

    return res.status(201).json(
        new ApiResponse(201, tiffin, "Tiffin added successfully")
    );
});

export const getAllTiffins = asyncHandler(async (req, res) => {
    const tiffins = await Tiffin.find({ isAvailable: true }).sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, tiffins, "Tiffins fetched successfully")
    );
});

export const getTiffinById = asyncHandler(async (req, res) => {
    const tiffin = await Tiffin.findById(req.params.tiffinId);

    if (!tiffin) {
        throw new ApiError(404, "Tiffin not found");
    }

    return res.status(200).json(
        new ApiResponse(200, tiffin, "Tiffin fetched successfully")
    );
});