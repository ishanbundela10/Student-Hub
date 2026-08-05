
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createBooking,
    getOwnerBookings,
    updateBookingStatus,
    deleteBooking,
    getMyBookings,
    getOwnerContacts
} from "../controllers/booking.controller.js";

const router = Router();

router.route("/create").post(verifyJWT, createBooking);
router.route("/owner").get(verifyJWT, getOwnerBookings);
router.route("/my").get(verifyJWT, getMyBookings);
router.route("/:bookingId/status").patch(verifyJWT, updateBookingStatus);
router.route("/:bookingId").delete(verifyJWT, deleteBooking)
router.route("/contacts").get(verifyJWT, getOwnerContacts)

export default router;