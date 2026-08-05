import { asyncHandler } from "../utils/asyncHandler.js";
import { Property } from "../models/property.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UploadOnCloudinary } from "../utils/Cloudinary.js"
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

const addProperty = asyncHandler(async (req, res) => {
    //logic

    let parsedVisitAvailability = [];
    if (req.body.visitAvailability) {
        try {
            parsedVisitAvailability = typeof req.body.visitAvailability === 'string'
                ? JSON.parse(req.body.visitAvailability)
                : req.body.visitAvailability;
        } catch (error) {
            throw new ApiError(400, "Invalid visitAvailability format");
        }
    }

    console.log("Parsed visitAvailability:", parsedVisitAvailability);

    // const owner = req.user._id

    // const { title, propertyType, price, priceType, landmark, address, city,
    //     state, pincode, securityDeposit, maintenanceCharge, description,
    //     furnishingType, area, rooms, bathrooms, tenants, availableFrom,
    //     contactName, contactPhone, contactEmail, alternatePhone } = req.body

    // const amenities = Array.isArray(req.body.amenities)
    //     ? req.body.amenities
    //     : req.body.amenities ? [req.body.amenities] : []

    // const propertyDetails = {
    //     furnishingType,
    //     area,
    //     rooms: rooms ? Number(rooms) : undefined,
    //     bathrooms: bathrooms ? Number(bathrooms) : undefined,
    //     tenants: tenants ? Number(tenants) : undefined,
    //     availableFrom: availableFrom ? new Date(availableFrom) : undefined,
    //     amenities
    // }

    const uploadedImages = []

    for (const file of req.files || []) {
        const uploaded = await UploadOnCloudinary(file.path)

        if (!uploaded) {
            throw new ApiError(400, "Error while uploading")
        }

        uploadedImages.push(uploaded.secure_url)
    }

    // const property = await Property.create({
    //     owner, title, propertyType, price, priceType, landmark, address, city,
    //     state, pincode, securityDeposit, maintenanceCharge, description,
    //     propertyDetails, amenities, contactName, contactPhone, contactEmail,
    //     images: uploadedImages
    // })

    const property = await Property.create({
        ...req.body,
        visitAvailability: parsedVisitAvailability, // ✅ Sahi variable name
        owner: req.user._id,
    });
    console.log(req.body);
    // console.log(req.files);
    // console.log(req.user);
    // console.log("Visit Availability:", visitAvailability);
    return res
        .status(201)
        .json(
            new ApiResponse(201, property, "property added succesfully")
        );
})

const getMyProperties = asyncHandler(async (req, res) => {
    const myproperties = await Property.find(
        {
            owner: req.user._id
        }
    )
    return res
        .status(200)
        .json(new ApiResponse(200, myproperties, "my properties fetched successfully"))
})

const getProperties = asyncHandler(async (req, res) => {
    const { propertyType } = req.query;

    const query = {};

    if (propertyType) {
        const types = propertyType.split(",");

        query.propertyType = {
            $in: types,
        }
    }

    const properties = await Property.find(query);

    return res.status(200).json(
        new ApiResponse(200, properties, "Properties fetched successfully")
    );
});

const getHostels = asyncHandler(async (req, res) => {
    const hostels = await Property.find(
        {
            propertyType: "hostel"
        }
    )
    // console.log(hostels)
    return res
        .status(200)
        .json(new ApiResponse(200, hostels, "hostels fetched"))
})

const getPropertyById = asyncHandler(async (req, res) => {
    const {id} = req.params

    const property = await Property.findById(id)

    if (!property) {
        throw new ApiError(404, "Property not found")
    }
    let isSaved = false

    const token = req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded._id);

            if (user && user.savedProperties) {
                isSaved = user.savedProperties.some(
                    savedId => savedId.toString() === id
                );
            }
        } catch (error) {
            // Invalid/expired token - just set isSaved to false
            console.log("Token invalid, treating as guest");
            isSaved = false;
        }
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            { property, isSaved },
            "Property fetched successfully"
        )
    );
})

// const saveProperties = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const user = await User.findById(req.user._id);

//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }

//   if(!user.savedProperties){
//     user.savedProperties= []
//   }
//   const alreadySaved = user.savedProperties.some(
//     (propertyId) => propertyId.toString() === id
//   );

//   if (alreadySaved) {
//     throw new ApiError(400, "Property already saved");
//   }

//   user.savedProperties.push(id);

//   await user.save();

//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       user.savedProperties,
//       "Property saved successfully"
//     )
//   );
// });

const toggleSaveProperty = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!user.savedProperties) {
        user.savedProperties = [];
    }

    const index = user.savedProperties.findIndex(
        (propertyId) => propertyId.toString() === id
    );

    let saved = false;

    if (index === -1) {
        user.savedProperties.push(id);
        saved = true;
    } else {
        user.savedProperties.splice(index, 1);
        saved = false;
    }

    await user.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            { saved },
            saved
                ? "Property saved successfully"
                : "Property removed successfully"
        )
    );
});

const removeProperties = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    user.savedProperties = user.savedProperties.filter(
        (id) => id.toString() != req.params.id
    )

    await user.save()
})

const getSavedProperties = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate("savedProperties")
})

const updateProperty = asyncHandler(async (req, res) => {
    const { propertyId } = req.params

    const property = await Property.findById(propertyId)

    if (!property) {
        throw new ApiError(403, "property not found")
    }

    if (property.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this property");
    }

    let parsedVisitAvailability = property.visitAvailability
    if (req.body.visitAvailability) {
        try {
            parsedVisitAvailability = typeof req.body.visitAvailability === 'string' ?
                JSON.parse(req.body.visitAvailability)
                : req.body.visitAvailability
        } catch (error) {
            throw new ApiError(400, "Invalid visitAvailability")
        }
    }

    let amenities = property.propertyDetails?.amenities || [];
    if (req.body.amenities) {
        amenities = Array.isArray(req.body.amenities)
            ? req.body.amenities
            : [req.body.amenities];
    }

    const updateFields = {
        ...req.body,
        visitAvailability: parsedVisitAvailability,
    };

    Object.keys(updateFields).forEach(key => {
        if (updateFields[key] === undefined || updateFields[key] === '') {
            delete updateFields[key];
        }
    })

    if (amenities.length > 0) {
        updateFields['propertyDetails.amenities'] = amenities;
        delete updateFields.amenities;
    }

    if (req.body.isAvailable !== undefined) {
        updateFields.isAvailable = req.body.isAvailable === 'true' || req.body.isAvailable === true;
    }

    const updatedProperty = await Property.findByIdAndUpdate(
        propertyId,
        { $set: updateFields },
        { new: true, runValidators: true }
    )

    return res.status(200).json(
        new ApiResponse(200, updatedProperty, "Property updated successfully")
    )
})

const deleteProperty = asyncHandler(async (req, res) => {
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);

    if (!property) {
        throw new ApiError(404, "Property not found");
    }

    if (property.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized");
    }

    await Visit.deleteMany({ property: propertyId })

    await Property.findByIdAndDelete(propertyId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Property and related visits deleted successfully")
    );
});



export {
    addProperty,
    getMyProperties,
    getHostels,
    getProperties,
    getPropertyById,
    toggleSaveProperty,
    updateProperty,
    deleteProperty
}