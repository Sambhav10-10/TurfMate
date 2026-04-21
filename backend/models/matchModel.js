import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
    creatorId: { type: String, required: true, index: true },
    // turfId is optional for now - will be required after migration
    turfId: { type: mongoose.Schema.Types.ObjectId, ref: "turf", default: null, index: true },

    // Legacy fields (for backward compatibility - populated from location/turfName during transition)
    location: { type: String, default: "" },
    turfName: { type: String, default: "" },

    sportType: { type: String, enum: ["football", "cricket"], required: true, index: true },
    date: { type: String, required: true, index: true },
    time: { type: String, required: true },
    durationMinutes: { type: Number, default: 60 }, // For time conflict detection
    totalSlots: { type: Number, required: true },
    joinedPlayers: { type: [String], default: [] },
    pricePerHead: { type: Number, required: true },
    isFull: { type: Boolean, default: false },
    isCancelled: { type: Boolean, default: false },
    cancellationReason: { type: String, default: "" },
    skillLevel: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    createdAt: { type: Date, default: Date.now },

    // FIX 1 & 2: Payment Lock System
    playerPaymentStatus: {
        type: [{
            userId: String,
            reserved: { type: Boolean, default: true },
            confirmed: { type: Boolean, default: false },
            reservedAt: { type: Date, default: Date.now },
            confirmedAt: { type: Date, default: null }
        }],
        default: []
    },
    paymentLockDuration: { type: Number, default: 5 * 60 * 1000 }, // 5 minutes in ms

    // FIX 3: Match Status & Expiry
    status: {
        type: String,
        enum: ["upcoming", "ongoing", "completed", "cancelled"],
        default: "upcoming"
    },

    // FIX 4: Cancellation Policy
    cancellationDeadlineHours: { type: Number, default: 2 },
    playerCancellations: {
        type: [{
            userId: String,
            cancelledAt: { type: Date, default: Date.now },
            hoursBeforeMatch: Number,
            penaltyApplied: { type: Boolean, default: false }
        }],
        default: []
    },

    // IMPROVEMENT 2: Track pending reservations per user
    // Prevents reservation abuse by limiting concurrent pending reservations
    pendingReservations: { type: Number, default: 0 },

    // Revenue Sharing System (Admin Commission Model)
    totalAmount: { type: Number, default: 0 }, // Total payment from all players (pricePerHead * confirmedPlayers)
    revenueProcessed: { type: Boolean, default: false }, // Whether admin has set the split
    adminCommissionPercent: { type: Number, default: 0 }, // What % admin keeps (e.g., 20)
    ownerEarningPercent: { type: Number, default: 0 }, // What % owner gets (e.g., 80)
    adminEarning: { type: Number, default: 0 }, // Amount admin keeps
    ownerEarning: { type: Number, default: 0 }, // Amount turf owner gets
    revenueProcessedAt: { type: Date, default: null }, // When admin processed the split
});

// IMPROVEMENT 6: Add indexes for performance and queries
// These dramatically improve query speed for commonly filtered fields
matchSchema.index({ date: 1, sportType: 1 }); // For filtering matches by date and sport
matchSchema.index({ turfId: 1, date: 1 }); // For checking time conflicts at same turf
matchSchema.index({ creatorId: 1 }); // For creator's match history
matchSchema.index({ status: 1 }); // For filtering by match status
matchSchema.index({ createdAt: -1 }); // For sorted recent matches

const matchModel = mongoose.models.match || mongoose.model("match", matchSchema);
export default matchModel;
