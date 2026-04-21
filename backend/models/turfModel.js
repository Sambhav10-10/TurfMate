import mongoose from "mongoose";

const turfSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true, index: true },
    city: { type: String, required: true, index: true },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    basePrice: { type: Number, required: true }, // Price per hour
    capacity: { type: Number, required: true }, // Max people that can play at once
    surface: { type: String, enum: ["grass", "artificial", "concrete"], default: "artificial" },
    ownerId: { type: String, required: true, index: true },
    facilities: { type: [String], default: [] }, // e.g., ["parking", "water", "lights"]
    images: { type: [String], default: [] },
    verified: { type: Boolean, default: false }, // Admin has verified the turf
    registrationFee: { type: Number, default: 0 }, // Fee paid to admin for verification
    ownerApproved: { type: Boolean, default: false }, // Owner has approved/paid the registration fee
    feeConfirmed: { type: Date, default: null }, // When owner approved & fee was confirmed/added to admin wallet
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Add compound indexes for performance
turfSchema.index({ location: 1, city: 1 });
turfSchema.index({ ownerId: 1 });
turfSchema.index({ createdAt: -1 });

const turfModel = mongoose.models.turf || mongoose.model("turf", turfSchema);
export default turfModel;
