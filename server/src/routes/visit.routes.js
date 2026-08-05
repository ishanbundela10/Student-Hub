import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    requestVisit,
    getOwnerVisits,
    getPendingVisits,
    updateVisitStatus,
    clearAllVisits,
    deleteVisit
} from "../controllers/visit.controller.js";

const router = Router();

router.route("/request").post(verifyJWT, requestVisit)
router.route("/owner").get(verifyJWT, getOwnerVisits);
router.route("/owner/pending").get(verifyJWT, getPendingVisits);
router.route("/owner/clear-all").delete(verifyJWT, clearAllVisits);
router.route("/:visitId/status").patch(verifyJWT, updateVisitStatus);
router.route("/:visitId").delete(verifyJWT, deleteVisit);

export default router;