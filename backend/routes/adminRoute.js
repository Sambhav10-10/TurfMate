import express from 'express';
import { loginAdmin, loginOwner, registerOwner, listMatches, deleteMatch, getPaymentData, adminDashboard, getCompletedMatches, processRevenueShare, getRevenueStats } from '../controllers/adminController.js';
import { getAllTurfsForAdmin, verifyTurf, rejectTurf, getAdminWallet } from '../controllers/turfController.js';
import authAdmin from '../middleware/authAdmin.js';
const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);
adminRouter.post("/owner/login", loginOwner);
adminRouter.post("/owner/register", registerOwner);
adminRouter.get("/matches", authAdmin, listMatches);
adminRouter.post("/delete-match", authAdmin, deleteMatch);
adminRouter.get("/payments", authAdmin, getPaymentData);
adminRouter.get("/dashboard", authAdmin, adminDashboard);

// Turf verification routes
adminRouter.get("/turfs/all", authAdmin, getAllTurfsForAdmin);
adminRouter.post("/verify-turf", authAdmin, verifyTurf);
adminRouter.post("/reject-turf", authAdmin, rejectTurf);

// Admin wallet/earnings from registration fees
adminRouter.get("/wallet", authAdmin, getAdminWallet);

// Revenue sharing routes (Match earnings split between admin and turf owner)
adminRouter.get("/completed-matches", authAdmin, getCompletedMatches); // Get matches awaiting revenue split
adminRouter.post("/process-revenue", authAdmin, processRevenueShare); // Process revenue split
adminRouter.get("/revenue-stats", authAdmin, getRevenueStats); // Get revenue statistics

export default adminRouter;