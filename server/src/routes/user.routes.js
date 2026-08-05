import { Router } from "express";
import { signUp, 
         loginUser,
         logoutUser,
         updateProfile,
         refreshAccessToken, 
         currentUser,
         changeCurrentPassword} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/signup").post(
    // upload.fields([
    //     {
    //         name: "profileImage",
    //         maxCount: 1
    //     }
    // ]),
    signUp
)

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT ,logoutUser)

router.route("/profile/:userId").patch(
    verifyJWT,
    upload.single("profileImage"),
    updateProfile
);
router.route("/refreshtoken").post(refreshAccessToken)
router.route("/updateProfile").patch(verifyJWT, upload.single("profileImage"), updateProfile)
router.route("/currentuser").get(verifyJWT, currentUser)
router.route("/updatepass").post(verifyJWT, changeCurrentPassword)

export default router