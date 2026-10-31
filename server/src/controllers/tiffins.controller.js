import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tiffin } from "../models/tiffin.model.js";
import { UploadOnCloudinary } from "../utils/Cloudinary.js";


export const addTiffin = asyncHandler(async (req, res) => {
    const {
        kitchenName,
        name, // Fallback if kitchenName is sent as name
        providerName,
        description,
        foodType,
        typicalMeal,
        pricePerMeal,
        pricePerMonth,
        mealTime,
        lunchTiming,
        dinnerTiming,
        deliveryOptions,
        area,
        city,
        state,
        pincode,
        contactPhone,
        contactEmail
    } = req.body;

    // 1. Mandatory Fields Validation
    const actualKitchenName = kitchenName || name;

    if (
        !actualKitchenName ||
        !providerName ||
        !description ||
        !typicalMeal ||
        !pricePerMeal ||
        !area ||
        !city ||
        !state ||
        !pincode ||
        !contactPhone
    ) {
        throw new ApiError(400, "Please fill in all required fields (kitchen name, provider name, price, address, phone, and meal description).");
    }

    // 2. Handle Thumbnail Image Upload (from Multer to Cloudinary)
    const thumbnailLocalPath =
        req.files?.thumbnail?.[0]?.path || req.file?.path;

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "A food thumbnail photo is required");
    }

    const thumbnail = await UploadOnCloudinary(thumbnailLocalPath);

    if (!thumbnail?.url) {
        throw new ApiError(400, "Failed to upload food image to cloud storage");
    }

    // 3. Process optional extra gallery images
    let images = [];
    if (req.files?.images && req.files.images.length > 0) {
        for (const file of req.files.images) {
            const uploaded = await UploadOnCloudinary(file.path);
            if (uploaded?.url) images.push(uploaded.url);
        }
    }

    // 4. Create Document in MongoDB
    const tiffin = await Tiffin.create({
        name: actualKitchenName,
        kitchenName: actualKitchenName,
        providerName,
        description,
        foodType: foodType || "Veg",
        typicalMeal,

        // Simple Pricing
        pricing: {
            pricePerMeal: Number(pricePerMeal),
            pricePerMonth: pricePerMonth ? Number(pricePerMonth) : null,
        },

        // Timings & Delivery
        mealTime: mealTime || "Both",
        timing: {
            lunch: mealTime === "Dinner" ? "" : (lunchTiming || "12:30 PM - 2:00 PM"),
            dinner: mealTime === "Lunch" ? "" : (dinnerTiming || "7:30 PM - 9:30 PM")
        },
        deliveryOptions: deliveryOptions || "Home Delivery",

        // Structured Address
        address: {
            area,
            city,
            state,
            pincode
        },

        contactPhone,
        contactEmail: contactEmail || "",
        thumbnail: thumbnail.url,
        images,
        isAvailable: true,
        rating: 5.0,
        reviewsCount: 0
    });

    // 5. Return Success Response
    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                tiffin,
                "Tiffin service registered successfully! 🎉"
            )
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

// Delete tiffin
export const deleteTiffin = asyncHandler(async (req, res) => {
    const tiffin = await Tiffin.findByIdAndDelete(req.params.id);
    if (!tiffin) throw new ApiError(404, "Tiffin not found");
    return res.status(200).json(new ApiResponse(200, {}, "Tiffin deleted"));
});

// Toggle availability
export const toggleTiffinStatus = asyncHandler(async (req, res) => {
    const { isAvailable } = req.body;
    const tiffin = await Tiffin.findByIdAndUpdate(
        req.params.id,
        { isAvailable },
        { new: true }
    );
    return res.status(200).json(new ApiResponse(200, tiffin, "Status updated"));
});