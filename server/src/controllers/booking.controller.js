import { Booking } from "../models/booking.model.js";
import { Property } from "../models/property.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Visit } from "../models/visit.model.js";


const createBooking = asyncHandler(async (req, res) => {

    const { propertyId, message } = req.body;

    if (!propertyId) {
        throw new ApiError(400, "Property ID is required");
    }

    const property = await Property.findById(propertyId);

    if (!property) {
        throw new ApiError(404, "Property not found");
    }

    if (!property.isAvailable) {
        throw new ApiError(400, "This property is already booked");
    }

    // Check if user already has a pending booking for this property
    const existingBooking = await Booking.findOne({
        property: propertyId,
        student: req.user._id,
        status: "pending"
    });

    if (existingBooking) {
        throw new ApiError(400, "You already have a pending booking for this property");
    }

    const booking = await Booking.create({
        property: property._id,
        owner: property.owner,
        student: req.user._id,
        message: message || ""
    });

    return res.status(201).json(
        new ApiResponse(201, booking, "Booking request sent successfully")
    );
});

const getOwnerBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ owner: req.user._id })
        .populate("property", "title address city images price priceType isAvailable")
        .populate("student", "fullname email phoneNumber")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, bookings, "Bookings fetched successfully")
    );
});

const updateBookingStatus = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
        throw new ApiError(400, "Invalid status");
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (booking.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized");
    }

    if (booking.status !== "pending") {
        throw new ApiError(400, `Booking already ${booking.status}`);
    }

    // Update booking status
    booking.status = status;

    // ✅ If accepted → Mark property as booked (isAvailable: false)
    if (status === "accepted") {
        booking.bookedAt = new Date();
        
        const property = await Property.findById(booking.property);
        if (property) {
            property.isAvailable = false;  // 🏠 Auto mark as booked
            await property.save();
        }

        // ✅ Auto-reject other pending bookings for same property
        await Booking.updateMany(
            {
                property: booking.property,
                _id: { $ne: booking._id },
                status: "pending"
            },
            { status: "rejected" }
        );
    }

    await booking.save();

    return res.status(200).json(
        new ApiResponse(
            200, 
            booking, 
            status === "accepted" 
                ? "Booking accepted! Property marked as booked." 
                : "Booking rejected"
        )
    );
});

const deleteBooking = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (booking.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized");
    }

    await Booking.findByIdAndDelete(bookingId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Booking deleted successfully")
    );
});

const getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ student: req.user._id })
        .populate("property", "title address city images price")
        .populate("owner", "fullname email phoneNumber")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, bookings, "My bookings fetched")
    );
});

const getOwnerContacts = asyncHandler(async (req, res) => {
    const ownerId = req.user._id;

    const bookings = await Booking.find({ owner: ownerId })
        .populate("student", "fullname email phoneNumber avatar")
        .populate("property", "title")
        .sort({ createdAt: -1 });

    const visits = await Visit.find({ owner: ownerId })
        .populate("student", "fullname email phoneNumber avatar")
        .populate("property", "title")
        .sort({ createdAt: -1 });

    const contactsMap = new Map();

    bookings.forEach((booking) => {
        if (!booking.student) return;
        
        const studentId = booking.student._id.toString();
        
        if (!contactsMap.has(studentId)) {
            contactsMap.set(studentId, {
                _id: booking.student._id,
                fullname: booking.student.fullname,
                email: booking.student.email,
                phoneNumber: booking.student.phoneNumber,
                avatar: booking.student.avatar,
                bookings: [],
                visits: [],
                lastActivity: booking.createdAt,
                totalInteractions: 0
            });
        }

        const contact = contactsMap.get(studentId);
        contact.bookings.push({
            _id: booking._id,
            property: booking.property?.title || 'Deleted Property',
            status: booking.status,
            date: booking.createdAt
        });
        contact.totalInteractions++;
        
        if (new Date(booking.createdAt) > new Date(contact.lastActivity)) {
            contact.lastActivity = booking.createdAt;
        }
    });

    visits.forEach((visit) => {
        if (!visit.student) return;
        
        const studentId = visit.student._id.toString();
        
        if (!contactsMap.has(studentId)) {
            contactsMap.set(studentId, {
                _id: visit.student._id,
                fullname: visit.student.fullname,
                email: visit.student.email,
                phoneNumber: visit.student.phoneNumber,
                avatar: visit.student.avatar,
                bookings: [],
                visits: [],
                lastActivity: visit.createdAt,
                totalInteractions: 0
            });
        }

        const contact = contactsMap.get(studentId);
        contact.visits.push({
            _id: visit._id,
            property: visit.property?.title || 'Deleted Property',
            status: visit.status,
            date: visit.createdAt
        });
        contact.totalInteractions++;

        if (new Date(visit.createdAt) > new Date(contact.lastActivity)) {
            contact.lastActivity = visit.createdAt;
        }
    })

    const contacts = Array.from(contactsMap.values())
        .sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));

    return res.status(200).json(
        new ApiResponse(200, contacts, "Contacts fetched successfully")
    )
})

export {
    createBooking,
    getOwnerBookings,
    updateBookingStatus,
    deleteBooking,
    getMyBookings,
    getOwnerContacts

};