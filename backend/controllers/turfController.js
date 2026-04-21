import turfModel from "../models/turfModel.js";
import userModel from "../models/userModel.js";

/**
 * IMPROVEMENT #2: Turf Entity System Controller
 * Manages turf CRUD operations for owners
 * 
 * Features:
 * - Create turf with complete details (name, location, capacity, facilities, etc.)
 * - List turfs owned by specific owner
 * - Get turf details with matches
 * - Update turf information
 * - Delete turf
 * - Rate turf based on match ratings
 */

// Create a new turf (Owner)
const createTurf = async (req, res) => {
    try {
        const { ownerId, name, location, city, basePrice, capacity, surface, facilities, images, latitude, longitude } = req.body;

        // Validate required fields
        if (!ownerId || !name || !location || !city || !basePrice || !capacity) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        // Validate owner exists
        const ownerExists = await userModel.findById(ownerId);
        if (!ownerExists) {
            return res.json({ success: false, message: "Owner not found" });
        }

        const turfData = {
            name,
            location,
            city,
            basePrice,
            capacity,
            surface: surface || "artificial",
            ownerId,
            facilities: facilities || [],
            images: images || [],
            latitude: latitude || 0,
            longitude: longitude || 0,
            verified: false,
            rating: 0,
            totalRatings: 0
        };

        const turf = new turfModel(turfData);
        await turf.save();

        res.json({
            success: true,
            message: "Turf created successfully",
            turf: turf
        });
    } catch (error) {
        console.error("Create turf error:", error);
        res.json({ success: false, message: error.message });
    }
};

// Get all turfs by owner
const getTurfsByOwner = async (req, res) => {
    try {
        const { ownerId } = req.body;

        if (!ownerId) {
            return res.json({ success: false, message: "Owner ID required" });
        }

        const turfs = await turfModel.find({ ownerId }).sort({ createdAt: -1 });

        res.json({
            success: true,
            turfs: turfs
        });
    } catch (error) {
        console.error("Get turfs by owner error:", error);
        res.json({ success: false, message: error.message });
    }
};

// Get turf details with all matches at this turf
const getTurfDetails = async (req, res) => {
    try {
        const { turfId } = req.body;

        if (!turfId) {
            return res.json({ success: false, message: "Turf ID required" });
        }

        const turf = await turfModel.findById(turfId);

        if (!turf) {
            return res.json({ success: false, message: "Turf not found" });
        }

        res.json({
            success: true,
            turf: turf
        });
    } catch (error) {
        console.error("Get turf details error:", error);
        res.json({ success: false, message: error.message });
    }
};

// Update turf information
const updateTurf = async (req, res) => {
    try {
        const { turfId, name, location, city, basePrice, capacity, surface, facilities, images, latitude, longitude } = req.body;

        if (!turfId) {
            return res.json({ success: false, message: "Turf ID required" });
        }

        const turf = await turfModel.findById(turfId);

        if (!turf) {
            return res.json({ success: false, message: "Turf not found" });
        }

        // Update fields
        if (name) turf.name = name;
        if (location) turf.location = location;
        if (city) turf.city = city;
        if (basePrice) turf.basePrice = basePrice;
        if (capacity) turf.capacity = capacity;
        if (surface) turf.surface = surface;
        if (facilities) turf.facilities = facilities;
        if (images) turf.images = images;
        if (latitude !== undefined) turf.latitude = latitude;
        if (longitude !== undefined) turf.longitude = longitude;

        turf.updatedAt = Date.now();
        await turf.save();

        res.json({
            success: true,
            message: "Turf updated successfully",
            turf: turf
        });
    } catch (error) {
        console.error("Update turf error:", error);
        res.json({ success: false, message: error.message });
    }
};

// Delete turf
const deleteTurf = async (req, res) => {
    try {
        const { turfId } = req.body;

        if (!turfId) {
            return res.json({ success: false, message: "Turf ID required" });
        }

        await turfModel.findByIdAndDelete(turfId);

        res.json({
            success: true,
            message: "Turf deleted successfully"
        });
    } catch (error) {
        console.error("Delete turf error:", error);
        res.json({ success: false, message: error.message });
    }
};

// Get all turfs (for browsing)
const getAllTurfs = async (req, res) => {
    try {
        const turfs = await turfModel.find({}).sort({ createdAt: -1 });

        res.json({
            success: true,
            turfs: turfs
        });
    } catch (error) {
        console.error("Get all turfs error:", error);
        res.json({ success: false, message: error.message });
    }
};

// Rate a turf (after match - aggregate from match ratings)
const rateTurf = async (req, res) => {
    try {
        const { turfId, rating } = req.body;

        if (!turfId || !rating || rating < 1 || rating > 5) {
            return res.json({ success: false, message: "Invalid rating data" });
        }

        const turf = await turfModel.findById(turfId);

        if (!turf) {
            return res.json({ success: false, message: "Turf not found" });
        }

        // Update turf rating (weighted average)
        const currentTotal = turf.rating * turf.totalRatings;
        turf.totalRatings += 1;
        turf.rating = (currentTotal + rating) / turf.totalRatings;
        turf.rating = Math.round(turf.rating * 10) / 10; // Round to 1 decimal

        await turf.save();

        res.json({
            success: true,
            message: "Turf rated successfully",
            turf: turf
        });
    } catch (error) {
        console.error("Rate turf error:", error);
        res.json({ success: false, message: error.message });
    }
};

// Get all turfs for admin (with owner info)
const getAllTurfsForAdmin = async (req, res) => {
    try {
        const turfs = await turfModel.find();

        // Enrich with owner details
        const turfsWithOwner = await Promise.all(
            turfs.map(async (turf) => {
                const owner = await userModel.findById(turf.ownerId);
                return {
                    ...turf.toObject(),
                    ownerName: owner?.name || "Unknown",
                    ownerEmail: owner?.email || "Unknown"
                };
            })
        );

        res.json({
            success: true,
            turfs: turfsWithOwner
        });
    } catch (error) {
        console.error("Get all turfs error:", error);
        res.json({ success: false, message: error.message });
    }
};

// Verify turf and collect registration fee (Admin)
const verifyTurf = async (req, res) => {
    try {
        const { turfId, registrationFee } = req.body;

        if (!turfId || registrationFee === undefined) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        const turf = await turfModel.findById(turfId);
        if (!turf) {
            return res.json({ success: false, message: "Turf not found" });
        }

        turf.verified = true;
        turf.registrationFee = registrationFee;
        await turf.save();

        res.json({
            success: true,
            message: "Turf verified successfully",
            turf
        });
    } catch (error) {
        console.error("Verify turf error:", error);
        res.json({ success: false, message: error.message });
    }
};

// Reject turf (Admin)
const rejectTurf = async (req, res) => {
    try {
        const { turfId } = req.body;

        if (!turfId) {
            return res.json({ success: false, message: "Turf ID is required" });
        }

        const turf = await turfModel.findByIdAndDelete(turfId);
        if (!turf) {
            return res.json({ success: false, message: "Turf not found" });
        }

        res.json({
            success: true,
            message: "Turf rejected and deleted"
        });
    } catch (error) {
        console.error("Reject turf error:", error);
        res.json({ success: false, message: error.message });
    }
};

// Owner approves the registration fee and activates turf (Owner)
const approveOwnerPayment = async (req, res) => {
    try {
        const { turfId } = req.body;

        if (!turfId) {
            return res.json({ success: false, message: "Turf ID is required" });
        }

        const turf = await turfModel.findById(turfId);
        if (!turf) {
            return res.json({ success: false, message: "Turf not found" });
        }

        if (!turf.verified) {
            return res.json({ success: false, message: "Turf must be verified by admin first" });
        }

        turf.ownerApproved = true;
        turf.feeConfirmed = new Date(); // Mark fee as confirmed/collected
        await turf.save();

        res.json({
            success: true,
            message: "Turf approved and activated successfully",
            turf
        });
    } catch (error) {
        console.error("Approve owner payment error:", error);
        res.json({ success: false, message: error.message });
    }
};

// Owner removes/cancels turf after admin verification (Owner)
const ownerRemoveTurf = async (req, res) => {
    try {
        const { turfId } = req.body;

        if (!turfId) {
            return res.json({ success: false, message: "Turf ID is required" });
        }

        const turf = await turfModel.findByIdAndDelete(turfId);
        if (!turf) {
            return res.json({ success: false, message: "Turf not found" });
        }

        res.json({
            success: true,
            message: "Turf removed successfully"
        });
    } catch (error) {
        console.error("Owner remove turf error:", error);
        res.json({ success: false, message: error.message });
    }
};

export { createTurf, getTurfsByOwner, getTurfDetails, updateTurf, deleteTurf, getAllTurfs, rateTurf, getAllTurfsForAdmin, verifyTurf, rejectTurf, approveOwnerPayment, ownerRemoveTurf, getAdminWallet };

// Get admin wallet/earnings from confirmed registration fees
const getAdminWallet = async (req, res) => {
    try {
        // Get all turfs where fee has been confirmed (owner approved)
        const confirmedTurfs = await turfModel.find({
            verified: true,
            ownerApproved: true,
            feeConfirmed: { $ne: null }
        });

        // Calculate total earnings and breakdown
        const totalEarnings = confirmedTurfs.reduce((sum, turf) => sum + (turf.registrationFee || 0), 0);
        const totalTurfsVerified = confirmedTurfs.length;

        // Get breakdown by turf with owner info
        const turfsWithOwner = await Promise.all(
            confirmedTurfs.map(async (turf) => {
                const owner = await userModel.findById(turf.ownerId);
                return {
                    turfId: turf._id,
                    turfName: turf.name,
                    city: turf.city,
                    registrationFee: turf.registrationFee,
                    ownerName: owner?.name || "Unknown",
                    ownerEmail: owner?.email || "Unknown",
                    feeConfirmedDate: turf.feeConfirmed
                };
            })
        );

        res.json({
            success: true,
            totalEarnings,
            totalTurfsVerified,
            turfsBreakdown: turfsWithOwner
        });
    } catch (error) {
        console.error("Get admin wallet error:", error);
        res.json({ success: false, message: error.message });
    }
};
