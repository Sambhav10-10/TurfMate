import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import matchModel from "../models/matchModel.js";
import bcrypt from "bcrypt";
// admin controller for TurfMate/PlaySlot

// API for admin login
const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for turf owner login
const loginOwner = async (req, res) => {
    try {
        const { email, password } = req.body

        // Find user by email
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        // Generate token
        const token = jwt.sign({ id: user._id, email: user.email, role: 'owner' }, process.env.JWT_SECRET)

        // Return token and basic user data
        res.json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
                phone: user.phone
            }
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for turf owner registration
const registerOwner = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body

        // Validate input
        if (!name || !email || !password || !phone) {
            return res.json({ success: false, message: "All fields are required" })
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.json({ success: false, message: "Email already registered" })
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            phone,
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemSAAAACXBIWXMAABCcAAAQnAEmzTo0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAA5uSURLBVHgB7d0JchvHFcbxN+C+iaQolmzFsaWqHMA5QXID+wZJTmDnBLZu4BvER4hvYJ/AvoHlimPZRUngvoAg4PkwGJOiuGCd6df9/1UhoJZYJIBvXndPL5ndofljd8NW7bP8y79bZk+tmz8ATFdmu3nWfuiYfdNo2383389e3P5Xb9B82X1qs/YfU3AB1Cuzr+3cnt8U5Mb132i+7n5mc/a9EV4gDF37Z15Qv3/9a/fz63/0VgXOw/uFdexLAxCqLze3s+flL/4IcK/yduwrAxC0zoX9e+u9rJfVXoB7fV41m7u2YQBCt2tt+6v6xEUfeM6+ILyAGxv9QWbL+iPOPxoAX2Zts9GZtU8NgDudln3eyNvQnxgAd/Lw/k194I8NgD+ZPc2aO92uAXCpYQDcIsCAYwQYcIwAA44RYMAxAgw4RoABxwgw4BgBBhwjwIBjBBhwjAADjhFgwDECDDhGgAHHCDDgGAEGHCPAgGMEGHCMAAOOEWDAMQIMOEaAAccIMOAYAQYcI8CAYwQYcIwAA44RYMAxAgw4RoABxwgw4BgBBhwjwIBjBBhwjAADjhFgwDECDDhGgAHHCDDgGAEGHCPAgGMEGHCMAAOOEWDAMQIMOEaAAccIMOAYAQYcI8CAYwQYcIwAA44RYMAxAgw4RoABxwgw4BgBBhwjwIBjBBhwjAADjhFgwDECDDhGgAHHCDDgGAEGHCPAgGMEGHCMAAOOEWDAMQIMOEaAAccIMOAYAQYcI8CAYwQYcIwAA44RYMAxAgw4RoABxwgw4BgBBhwjwIBjBBhwjAADjhFgwDECDDhGgAHHCDDgGAEGHCPAgGMEGHCMAAOOEWDAMQIMOEaAAccIMOAYAQYcI8CAYwQYcIwAA44RYMAxAgw4RoABxwgw4BgBBhwjwIBjBBhwjAADjhFgwDECDDhGgAHHCDDgGAEGHCPAgGMEGHCMAAOOEWDAMQIMOEaAAccIMOAYAQYcI8CAYwQYcIwAA44RYMAxAgw4RoABxwgw4BgBBhwjwIBjBBhwjAADjhFgwDECDDhGgAHHCDDgGAEGHCPAgGMEGHCMAAOOEWDAMQIMOEaAAccIMOAYAQYcI8CAYwQYcIwAA44RYMAxAgw4RoABxwgw4BgBBhwjwIBjBBhwjAADjhFgwDECDDhGgAHHCDDgGAEGHCPAgGMEGHCMAAOOEWDAMQIMOEaAAccIMOAYAQYcI8CAYwQYcIwAA44RYMAxAgw4RoABxwgw4BgBBhwjwIBjBBhwjAADjhFgwDECDDhGgAHHCDDgGAEGHCPAgGMEGHCMAAOOEWDAMQIMOEaAAccIMOAYAQYcI8CAYwQYcIwAA44RYMAxAgw4RoABxwgw4BgBBhwjwIBjBBhwjAADjhFgwDECDDhGgAHHCDDgGAEGHCPAgGMEGHCMAAOOEWDAMQIMOEaAAccIMOAYAQYcI8CAYwQYcIwAA44RYMAxAgw4RoABxwgw4BgBBhwjwIBjBBhwjAADjhFgwDECDDhGgAHHCDDgGAEGHCPAgGMEGHCMAAOOEWDAMQIMOEaAAccIMOAYAQYcI8CAYwQYcIwAA44RYMAxAgw4RoABxwgw4BgBBhwjwIBjBBhwjAADjhFgwDECDDhGgAHHCDDgGAEGHCPAgGMEGHCMAAOOEWDAMQIMOEaAAccIMOAYAQYcI8CAYwQYcIwAA44RYMAxAgw4RoABxwgw4BgBBhwjwIBjBBhwjAADjhFgwDECDDhGgAHHCDDgGAEGHCPAgGMEGHCMAAOOEWDAMQIMOEaAAccIMOAYAQYcI8CAYwQYcIwAA44RYMAxAgw4RoABxwgw4BgBBhwjwIBjBBhwjAADjhFgwDECDDhGgAHHCDDgGAEGHCPAgGMEGHCMAAOOEWDAMQIMOEaAAccIMOAYAQYcI8CAYwQYcIwAA44RYMAxAgw4RoABxwgw4BgBBhwjwIBjBBhwjAADjhFgwDECDDhGgAHHCDDgGAEGHCPAgGMEGHCMAAOOEWDAMQIMOEaAAccIMOAYAQYcI8CAYwQYcIwAA44RYMAxAgw4RoABxwgw4BgBBhwjwIBjBBhwjAADjhFgwDECDDhGgAHHCDDgGAEGHCPAgGMEGHCMAAOOEWDAMQIMOEaAAccIMOAYAQYcI8CAYwQYcIwAA44RYMAxAgw4RoABxwgw4BgBBhwjwIBjBBhwjAADjhFgwDECDDhGgAHHCDDgGAEGHCPAgGMEGHCMAAOOEWDAMQIMOEaAAccIMOAYAQYcI8CAYwQYcIwAA44RYMAxAgw4RoABxwgw4BgBBhwjwIBjBBhwjAADjhFgwDECDDhGgAHHCDDgGAEGHCPAgGMEGHCMAAOOEWDAMQIMOEaAAccIMOAYAQYcI8CAYwQYcIwAA44RYMAxAgw4RoABxwgw4BgBBhwjwIBjBBhwjAADjhFgwDECDDhGgAHHCDDgGAEGHCPAgGMEGHCMAAOOEWDAMQIMOEaAAccIMOAYAQYcI8CAYwQYcIwAA44RYMAxAgw4RoABxwgw4BgBBhwjwIBjBBhwjAADjhFgwDECDDhGgAHHCDDgGAEGHCPAgGMEGHCMAAOOEWDAMQIMOEaAAccIMOAYAQYcI8CAYwQYcIwAA44RYMAxAgw4RoABxwgw4BgBBhwjwIBjBBhwjAADjhFgwDECDDhGgAHHCDDgGAEGHCPAgGMEGHCMAAOOEWDAMQIMOEaAAccIMOAYAQYcI8CAYwQYcIwAA44RYMAxAgw4RoABxwgw4BgBBhwjwIBjBBhwjAADjhFgwDECDDhGgAHHCDDgGAEGHCPAgGMEGHCMAAOOEWDAMQIMOEaAAccIMOAYAQYcI8CAYwQYcIwAA44RYMAxAgw4RoABxwgw4BgBBhwjwIBjZMSG2QiVHCr7L8pRXzLDhXLKsJA3bzBCAGLEmg8P+sxW+GrZ6d2LN1TiDTqPRAHvpR5TRvxN2mFwpqAB3+3pQ2EFN5fThS+YEqrQN69VRuXJ4RmcKs8N5GBg9j0xVvPRGkVLEt1gUl3Y6t7n4SYlNOqlF5aW9fLzpq3YaZ3sZqNv9Ry1x3c0e4gVquPcTCNQhvLGcNg6eCvTZ0Gt0y0tGepK3YsVRX3K5/T0dHRX0fgFVRvWODJOIg5P8B1TYq6f5rlCKw5fqLmP3/Kh8e1sQaKjVriBVLEP7TqYhx5pGTVcBhkrghuNMVzlv4L0LUi7TKpcdnS6ZQsJBT0wh+lJCy4qv7K5dT0bYowV7c7SoVNq3c8Fz7l5JvvCO&'
        })

        await newUser.save()

        res.json({
            success: true,
            message: "Registration successful! Please login with your credentials.",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}


// list all matches (optionally filter by full/cancelled)
const listMatches = async (req, res) => {
    try {
        const filters = {};
        if (req.query.isFull) filters.isFull = req.query.isFull === 'true';
        if (req.query.isCancelled) filters.isCancelled = req.query.isCancelled === 'true';
        const matches = await matchModel.find(filters);
        res.json({ success: true, matches });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// delete a match by id
const deleteMatch = async (req, res) => {
    try {
        const { matchId } = req.body;
        await matchModel.findByIdAndDelete(matchId);
        res.json({ success: true, message: 'Match deleted' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// removed doctor management - not needed for TurfMate

// API to get payment and earnings data for admin
const getPaymentData = async (req, res) => {
    try {
        const matches = await matchModel.find({});
        const payments = [];
        const cancellations = [];
        let totalEarnings = 0;
        let totalConfirmed = 0;
        let totalPending = 0;
        let totalPenalties = 0;

        // Process each match to extract payment information
        for (const match of matches) {
            // For each player in payment status
            for (const paymentStatus of match.playerPaymentStatus || []) {
                const player = await userModel.findById(paymentStatus.userId);
                const isConfirmed = paymentStatus.confirmed;
                const amount = match.pricePerHead;

                // Add to payments array
                payments.push({
                    _id: `${match._id}_${paymentStatus.userId}`,
                    matchId: match._id,
                    playerId: paymentStatus.userId,
                    playerName: player?.name || 'Unknown',
                    playerEmail: player?.email || 'Unknown',
                    sportType: match.sportType,
                    location: match.location,
                    turfName: match.turfName,
                    matchDate: match.createdAt,
                    amount: amount,
                    paymentStatus: isConfirmed ? 'confirmed' : 'pending',
                    reservedAt: paymentStatus.reservedAt,
                    confirmedAt: paymentStatus.confirmedAt
                });

                // Update totals
                totalEarnings += amount;
                if (isConfirmed) {
                    totalConfirmed += amount;
                } else {
                    totalPending += amount;
                }
            }

            // For each cancellation, track it
            for (const cancellation of match.playerCancellations || []) {
                const player = await userModel.findById(cancellation.userId);
                const penaltyAmount = cancellation.penaltyApplied ? match.pricePerHead * 0.1 : 0; // 10% penalty

                cancellations.push({
                    _id: `${match._id}_cancel_${cancellation.userId}`,
                    matchId: match._id,
                    playerId: cancellation.userId,
                    playerName: player?.name || 'Unknown',
                    playerEmail: player?.email || 'Unknown',
                    sportType: match.sportType,
                    location: match.location,
                    turfName: match.turfName,
                    matchDate: match.createdAt,
                    originalAmount: match.pricePerHead,
                    cancelledAt: cancellation.cancelledAt,
                    hoursBeforeMatch: cancellation.hoursBeforeMatch || 0,
                    penaltyApplied: cancellation.penaltyApplied,
                    penaltyAmount: penaltyAmount
                });

                if (penaltyAmount > 0) {
                    totalPenalties += penaltyAmount;
                }
            }
        }

        const earnings = {
            totalEarnings,
            totalConfirmed,
            totalPending,
            totalPenalties,
            totalCancellations: cancellations.length
        };

        res.json({ success: true, payments, cancellations, earnings });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {
        const users = await userModel.find({});
        const matches = await matchModel.find({});

        const dashData = {
            totalUsers: users.length,
            totalMatches: matches.length,
            activeMatches: matches.filter(m => !m.isFull && !m.isCancelled).length,
            fullMatches: matches.filter(m => m.isFull).length,
        };

        res.json({ success: true, dashData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    loginAdmin,
    loginOwner,
    registerOwner,
    listMatches,
    deleteMatch,
    getPaymentData,
    adminDashboard,
    getCompletedMatches,
    processRevenueShare,
    getRevenueStats
};

// Get all completed matches awaiting revenue split
const getCompletedMatches = async (req, res) => {
    try {
        // Get matches that are completed but revenue hasn't been processed yet
        const completedMatches = await matchModel.find({
            status: "completed",
            revenueProcessed: false
        }).populate('turfId', 'name ownerId').sort({ createdAt: -1 });

        // Enrich with turf owner info
        const enrichedMatches = await Promise.all(
            completedMatches.map(async (match) => {
                const turf = await matchModel.collection.db.collection('turfs').findOne({ _id: match.turfId });
                let ownerName = "Unknown";
                let ownerEmail = "Unknown";

                if (match.turfId) {
                    const owner = await userModel.findById(match.turfId.ownerId);
                    if (owner) {
                        ownerName = owner.name;
                        ownerEmail = owner.email;
                    }
                }

                return {
                    ...match.toObject(),
                    turfOwnerName: ownerName,
                    turfOwnerEmail: ownerEmail,
                    confirmedPlayers: match.playerPaymentStatus.filter(p => p.confirmed).length
                };
            })
        );

        res.json({
            success: true,
            matches: enrichedMatches,
            count: enrichedMatches.length
        });
    } catch (error) {
        console.error("Get completed matches error:", error);
        res.json({ success: false, message: error.message });
    }
};

// Process revenue share for a completed match
const processRevenueShare = async (req, res) => {
    try {
        const { matchId, adminCommissionPercent } = req.body;

        if (!matchId || adminCommissionPercent === undefined) {
            return res.json({ success: false, message: "Match ID and commission percent required" });
        }

        if (adminCommissionPercent < 0 || adminCommissionPercent > 100) {
            return res.json({ success: false, message: "Commission percent must be between 0-100" });
        }

        const match = await matchModel.findById(matchId);
        if (!match) {
            return res.json({ success: false, message: "Match not found" });
        }

        if (match.status !== "completed") {
            return res.json({ success: false, message: "Only completed matches can have revenue processed" });
        }

        // Calculate total amount from confirmed players
        const confirmedCount = match.playerPaymentStatus.filter(p => p.confirmed).length;
        const totalAmount = confirmedCount * match.pricePerHead;

        // Calculate split
        const adminCommission = (totalAmount * adminCommissionPercent) / 100;
        const ownerEarning = totalAmount - adminCommission;
        const ownerPercent = 100 - adminCommissionPercent;

        // Update match with revenue data
        match.totalAmount = totalAmount;
        match.adminCommissionPercent = adminCommissionPercent;
        match.ownerEarningPercent = ownerPercent;
        match.adminEarning = adminCommission;
        match.ownerEarning = ownerEarning;
        match.revenueProcessed = true;
        match.revenueProcessedAt = new Date();

        await match.save();

        res.json({
            success: true,
            message: "Revenue split processed successfully",
            data: {
                totalAmount,
                adminEarning: adminCommission,
                ownerEarning,
                adminPercent: adminCommissionPercent,
                ownerPercent
            }
        });
    } catch (error) {
        console.error("Process revenue share error:", error);
        res.json({ success: false, message: error.message });
    }
};

// Get revenue statistics for admin
const getRevenueStats = async (req, res) => {
    try {
        // Get all completed matches with processed revenue
        const processedMatches = await matchModel.find({
            revenueProcessed: true,
            status: "completed"
        });

        // Calculate totals
        const totalRevenue = processedMatches.reduce((sum, match) => sum + (match.totalAmount || 0), 0);
        const adminTotal = processedMatches.reduce((sum, match) => sum + (match.adminEarning || 0), 0);

        // Group by revenue range
        const revenueBreakdown = processedMatches.map(match => ({
            matchId: match._id,
            totalAmount: match.totalAmount,
            adminEarning: match.adminEarning,
            ownerEarning: match.ownerEarning,
            adminPercent: match.adminCommissionPercent,
            playersCount: match.playerPaymentStatus.filter(p => p.confirmed).length,
            pricePerHead: match.pricePerHead,
            processedAt: match.revenueProcessedAt
        }));

        res.json({
            success: true,
            totalRevenue,
            adminTotal,
            ownerTotal: totalRevenue - adminTotal,
            matchesProcessed: processedMatches.length,
            breakdown: revenueBreakdown
        });
    } catch (error) {
        console.error("Get revenue stats error:", error);
        res.json({ success: false, message: error.message });
    }
};