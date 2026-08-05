import { Visit } from "../models/visit.model.js";
import { Property } from "../models/property.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const requestVisit = asyncHandler(async (req, res) => {
  const { propertyId, day, from, to, message } = req.body;

  if (!propertyId || !day || !from || !to) {
    throw new ApiError(400, "All required fields are missing");
  }

  const property = await Property.findById(propertyId);

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  const visit = await Visit.create({
    property: property._id,
    owner: property.owner,
    student: req.user._id,

    day,
    from,
    to,

    message,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      visit,
      "Visit request sent successfully"
    )
  );
}); 

const getOwnerVisits = asyncHandler(async (req, res) => {
    const ownerId = req.user._id;

    const visits = await Visit.find({ owner: ownerId })
        .populate("property", "title address city images price")
        .populate("student", "fullName email phone avatar")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, visits, "Owner visits fetched successfully")
    );
});


const getPendingVisits = asyncHandler(async (req, res) => {
    const ownerId = req.user._id;

    const visits = await Visit.find({ 
        owner: ownerId, 
        status: "pending" 
    })
        .populate("property", "title address city images price")
        .populate("student", "fullName email phone avatar")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, visits, "Pending visits fetched successfully")
    );
});

const updateVisitStatus = asyncHandler(async (req, res) => {
    const { visitId } = req.params;
    const { status } = req.body; // "accepted" or "rejected"

    if (!["accepted", "rejected"].includes(status)) {
        throw new ApiError(400, "Invalid status. Must be 'accepted' or 'rejected'");
    }

    const visit = await Visit.findById(visitId);

    if (!visit) {
        throw new ApiError(404, "Visit not found");
    }

    // Check if the logged-in user is the owner
    if (visit.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this visit");
    }

    visit.status = status;
    await visit.save();

    return res.status(200).json(
        new ApiResponse(200, visit, `Visit ${status} successfully`)
    );
});

const deleteVisit = asyncHandler(async (req, res) => {
    const { visitId } = req.params;

    const visit = await Visit.findById(visitId);

    if (!visit) {
        throw new ApiError(404, "Visit not found");
    }

    if (visit.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized to delete this visit");
    }

    await Visit.findByIdAndDelete(visitId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Visit deleted successfully")
    );
});

const clearAllVisits = asyncHandler(async (req, res) => {
    const result = await Visit.deleteMany({ owner: req.user._id });

    return res.status(200).json(
        new ApiResponse(200, result, `${result.deletedCount} visits cleared successfully`)
    );
});

export { 
    requestVisit, 
    getOwnerVisits, 
    getPendingVisits, 
    updateVisitStatus,
    deleteVisit,
    clearAllVisits
}