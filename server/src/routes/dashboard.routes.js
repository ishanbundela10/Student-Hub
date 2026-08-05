import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getOwnerDashboardStats } from "../controllers/user.controller.js";


const router = Router()

router.route('/ownerstats').get(verifyJWT, getOwnerDashboardStats)

export default router