import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addProperty,
         getMyProperties, 
         getHostels, 
         getProperties, 
         getPropertyById,
         toggleSaveProperty,
         updateProperty,
         deleteProperty
        } from "../controllers/property.controller.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router()

router.route('/addproperties').post(
            verifyJWT,
            upload.array("images", 10),
            addProperty
        )

router.route('/myproperties').get(verifyJWT, getMyProperties)
router.route('/hostels').get(getHostels)
router.route('/').get(getProperties)
router.route('/:id').get(getPropertyById)
router.route('/save/:id').post(verifyJWT, toggleSaveProperty)
router.route("/:propertyId")
    .patch(verifyJWT, upload.array("images", 10), updateProperty)
    .delete(verifyJWT, deleteProperty)

export default router