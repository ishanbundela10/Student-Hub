import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addTiffin, getAllTiffins, getTiffinById } from "../controllers/tiffins.controller.js";

const router = Router();

// ✅ Provider adds tiffin (Protected + Multer for images)
router.route("/add").post(
    verifyJWT,
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "images", maxCount: 5 }
    ]),
    addTiffin
);

// ✅ Public routes
router.route("/").get(getAllTiffins);
router.route("/:tiffinId").get(getTiffinById);

export default router;