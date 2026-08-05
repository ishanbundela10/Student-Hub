import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import { Property } from "../models/property.model.js";
import {Visit} from "../models/visit.model.js"
import { Booking } from "../models/booking.model.js"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(404, "User not found")
        }

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}

const signUp = asyncHandler(async (req, res) => {
    const { fullname, email, phoneNumber, password, role } = req.body

    if (
        [fullname, email, phoneNumber, password, role].some((field) => !field || field?.toString().trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    if (!email.includes("@")) {
        throw new ApiError(400, "Invalid email")
    }

    const existedUser = await User.findOne({ email })

    if (existedUser) {
        throw new ApiError(400, "User with email already exist")
    }

    // const profileImage = req.files?.profileImage?.[0]?.path
    // console.log(req.files)

    // const avatar = await UploadOnCloudinary(avatarLocalPath)

    const user = await User.create({
        fullname,
        email,
        password,
        role,
        phoneNumber
    })

    const createdUser = await User.findById(user._id)
        .select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    const { accessToken, refreshToken } =
        await generateAccessAndRefreshToken(createdUser._id);

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                201,
                {
                    user: createdUser,
                    accessToken,
                    refreshToken,
                },
                "User registered successfully"
            ))
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    // console.log(email, password)

    if (!email || !password) {
        throw new ApiError(400, "email or password are required")
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new ApiError(404, "user does not exists")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedinUser = await User.findById(user._id)
        .select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200,
                {
                    user: loggedinUser, accessToken, refreshToken
                },
                "User logged in successfully"
            )
        )

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            returnDocument: "after"
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken
    console.log(incomingRefreshToken)

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newrefreshToken } = await generateAccessAndRefreshToken(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newrefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newrefreshToken },
                    "Access Token is refreshed"
                )
            )

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { fullname,
            phoneNumber,
            role,
            bio,
            university,
            location, } = req.body;
            
    const profileImagePath = req.file?.path || null;

    console.log("User ID:", userId);
    console.log("Request body:", req.body);

    // Validate userId
    if (!userId) {
        throw new ApiError(400, "Unauthorized - Please login first");
    }

    if (!fullname?.trim() || !phoneNumber?.trim()) {
        throw new ApiError(400, "fullname and phoneNumber are required");
    }

    // Find and update user
    const updateData = {
        fullname,
        phoneNumber,
        role,
        bio,
        university,
        location,
    };
    // if (fullname) updateData.fullname = fullname.trim();
    // if (phoneNumber) updateData.phoneNumber = phoneNumber.trim();
    // if (role) updateData.role = role.trim();
    // if (profileImagePath) updateData.profileImage = profileImagePath;

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { returnDocument: 'after',
            runValidators: true,
         }
    ).select("-password -refreshToken");

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedUser, "Profile updated successfully")
        );
});

const currentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(200, req.user, "Current user fetched")
        )
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})


const getOwnerDashboardStats = asyncHandler(async (req, res) => {
    const ownerId = req.user._id

    const activeListings = await Property.countDocuments({
        owner: ownerId,
        isAvailable: true
    });
        console.log("Active Listings:", activeListings);

    const occupiedRooms = await Property.countDocuments({
        owner: ownerId,
        isAvailable: false
    });
        console.log("Occupied Rooms:", occupiedRooms);

    const bookingRequests = await Booking.countDocuments({
        owner: ownerId,
        status: "pending"
    });
        console.log("Booking Requests:", bookingRequests)

    const occupiedProperties = await Property.find({
        owner: ownerId,
        isAvailable: false
    }).select("price priceType");

    const monthlyIncome = occupiedProperties.reduce((total, property) => {
        let monthlyPrice = property.price || 0;

        if (property.priceType === "per_year") {
            monthlyPrice = monthlyPrice / 12;
        } else if (property.priceType === "per_day") {
            monthlyPrice = monthlyPrice * 30;
        }

        return total + monthlyPrice;
    }, 0);

    const stats = {
        activeListings,
        occupiedRooms,
        bookingRequests,
        monthlyIncome: Math.round(monthlyIncome), // Round to integer
    };
        console.log("Final Stats:", stats);


    return res
        .status(200)
        .json(new ApiResponse(200, stats, "Stats fetched successfully"));
});



export {
    signUp,
    loginUser,
    logoutUser,
    updateProfile,
    refreshAccessToken,
    currentUser,
    changeCurrentPassword,
    getOwnerDashboardStats
};