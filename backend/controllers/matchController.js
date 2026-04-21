import matchModel from "../models/matchModel.js";
import userModel from "../models/userModel.js";

/*
  Controller for match-related endpoints:
  - createMatch
  - joinMatch (with atomic update to prevent race conditions)
  - confirmPayment (FIX #2)
  - leaveMatch (with cancellation deadline check - FIX #4)
  - listMatches (with automatic expiry check - FIX #3)
  - listUserMatches
  - ratePlayer
*/

// FIX #3: Helper to update match status based on date/time
const updateMatchStatus = async (match) => {
    // Skip if already completed or cancelled
    if (match.status === 'completed' || match.status === 'cancelled') return match;

    // Parse match date format (assumes format: "DD_MM_YYYY")
    try {
        if (!match.date || !match.time) {
            console.warn(`Match ${match._id} has invalid date/time:`, match.date, match.time);
            // Set status to upcoming if not already set
            if (!match.status) {
                match.status = 'upcoming';
                await match.save();
            }
            return match;
        }

        const dateParts = match.date.split('_');
        if (dateParts.length !== 3) {
            console.warn(`Match ${match._id} has invalid date format:`, match.date);
            if (!match.status) {
                match.status = 'upcoming';
                await match.save();
            }
            return match;
        }

        const [day, month, year] = dateParts.map(Number);

        // Validate date values
        if (!day || !month || !year || day < 1 || day > 31 || month < 1 || month > 12 || year < 2000) {
            console.warn(`Match ${match._id} has invalid date values:`, { day, month, year });
            if (!match.status) {
                match.status = 'upcoming';
                await match.save();
            }
            return match;
        }

        const matchDateTime = new Date(year, month - 1, day);
        const [hours, minutes] = match.time.split(':').map(Number);
        matchDateTime.setHours(hours || 0);
        matchDateTime.setMinutes(minutes || 0);

        const now = new Date();

        // If match time has passed, mark as completed
        if (now > matchDateTime && match.status === 'upcoming') {
            match.status = 'completed';
            await match.save();
        }
    } catch (error) {
        console.error(`Error updating status for match ${match._id}:`, error);
        // Default to upcoming status if there's an error
        if (!match.status) {
            match.status = 'upcoming';
            await match.save();
        }
    }

    return match;
};

// Create a new turf match
const createMatch = async (req, res) => {
    try {
        const {
            creatorId,
            sportType,
            location,
            turfName,
            date,
            time,
            totalSlots,
            pricePerHead,
            skillLevel,
        } = req.body;

        if (!creatorId || !sportType || !location || !turfName || !date || !time || !totalSlots || !pricePerHead) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        const matchData = {
            creatorId,
            sportType,
            location,
            turfName,
            date,
            time,
            totalSlots,
            pricePerHead,
            skillLevel,
            status: 'upcoming', // Explicitly set to upcoming
            joinedPlayers: [], // Explicitly set empty array
            playerPaymentStatus: [], // Explicitly set empty array
        };

        const newMatch = new matchModel(matchData);
        await newMatch.save();

        res.json({ success: true, match: newMatch });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// FIX #1: ATOMIC CONCURRENCY-SAFE JOIN
// Uses MongoDB atomic operations to prevent race conditions
// Only allows join if:
// 1. Match is not full
// 2. User not already joined
// 3. Slots available
// 4. Match not cancelled
const joinMatch = async (req, res) => {
    try {
        const { userId, matchId } = req.body;

        if (!userId || !matchId) {
            return res.json({ success: false, message: "Missing userId or matchId" });
        }

        // Check user's active match limit
        const activeCount = await matchModel.countDocuments({
            joinedPlayers: userId,
            isCancelled: false,
            status: { $in: ["upcoming", "ongoing"] }
        });
        if (activeCount >= 3) {
            return res.json({ success: false, message: "User has reached maximum active matches (3)" });
        }

        // ATOMIC UPDATE: This entire operation is atomic at MongoDB level
        // If ANY condition fails, the update fails and returns null
        const updated = await matchModel.findOneAndUpdate(
            {
                _id: matchId,
                isFull: false,
                isCancelled: false,
                status: { $ne: "completed" },
                joinedPlayers: { $nin: [userId] }, // User not already joined (correct array check)
                $expr: { $lt: [{ $size: "$joinedPlayers" }, "$totalSlots"] } // Slots available
            },
            {
                $push: {
                    joinedPlayers: userId,
                    // Track payment status: reserved but not yet confirmed
                    playerPaymentStatus: {
                        userId,
                        reserved: true,
                        confirmed: false,
                        reservedAt: new Date(),
                        confirmedAt: null
                    }
                }
            },
            { new: true }
        );

        if (!updated) {
            // Debug: Check which condition failed
            const match = await matchModel.findById(matchId);
            if (!match) {
                return res.json({ success: false, message: "Match not found" });
            }
            if (match.isFull) {
                return res.json({ success: false, message: "Match is full" });
            }
            if (match.isCancelled) {
                return res.json({ success: false, message: "Match has been cancelled" });
            }
            if (match.status === "completed") {
                return res.json({ success: false, message: "Match has already been completed" });
            }
            if (match.joinedPlayers && match.joinedPlayers.includes(userId)) {
                return res.json({ success: false, message: "You have already joined this match" });
            }
            if (match.joinedPlayers && match.totalSlots && match.joinedPlayers.length >= match.totalSlots) {
                return res.json({ success: false, message: "Match is now full" });
            }
            // Generic fallback
            return res.json({ success: false, message: "Unable to join match (may be full, cancelled, or already joined)" });
        }

        // If match is now full, set isFull flag
        if (updated.joinedPlayers.length === updated.totalSlots) {
            updated.isFull = true;
            await updated.save();
        }

        res.json({ success: true, message: "Slot reserved (payment pending)", match: updated });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// FIX #2: PAYMENT CONFIRMATION
// After successful payment, confirm the reservation
const confirmPaymentForMatch = async (req, res) => {
    try {
        const { userId, matchId } = req.body;

        if (!userId || !matchId) {
            return res.json({ success: false, message: "Missing userId or matchId" });
        }

        // Find the match and payment status entry
        const match = await matchModel.findById(matchId);
        if (!match) {
            return res.json({ success: false, message: "Match not found" });
        }

        // Check if user's slot is still reserved
        const paymentStatus = match.playerPaymentStatus.find(p => p.userId === userId);
        if (!paymentStatus) {
            return res.json({ success: false, message: "User not found in match reservation" });
        }

        if (paymentStatus.confirmed) {
            return res.json({ success: false, message: "Payment already confirmed" });
        }

        // Check if reservation has expired (5 mins by default)
        const now = new Date();
        const reservationAge = now - new Date(paymentStatus.reservedAt);
        if (reservationAge > match.paymentLockDuration) {
            // Auto-release: Remove reservation and player
            await matchModel.findByIdAndUpdate(matchId, {
                $pull: {
                    joinedPlayers: userId,
                    playerPaymentStatus: { userId }
                }
            });
            return res.json({ success: false, message: "Reservation expired. Please rejoin the match." });
        }

        // Confirm payment
        const updatedMatch = await matchModel.findByIdAndUpdate(
            matchId,
            {
                $set: {
                    "playerPaymentStatus.$[elem].confirmed": true,
                    "playerPaymentStatus.$[elem].confirmedAt": new Date()
                }
            },
            {
                arrayFilters: [{ "elem.userId": userId }],
                new: true
            }
        );

        res.json({ success: true, message: "Payment confirmed! You are successfully joined.", match: updatedMatch });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// FIX #4: LEAVE MATCH WITH CANCELLATION DEADLINE & PENALTY TRACKING
// Handles both regular players and match creators
const leaveMatch = async (req, res) => {
    try {
        const { userId, matchId } = req.body;

        if (!userId || !matchId) {
            return res.json({ success: false, message: "Missing userId or matchId" });
        }

        const match = await matchModel.findById(matchId);
        if (!match) {
            return res.json({ success: false, message: "Match not found" });
        }

        // Check if user is in the match
        const isCreator = match.creatorId === userId;
        const isJoined = match.joinedPlayers.includes(userId);

        if (!isCreator && !isJoined) {
            return res.json({ success: false, message: "User not in this match" });
        }

        // Parse match datetime - handle both DD_MM_YYYY and YYYY-MM-DD formats
        let day, month, year;
        if (match.date.includes('_')) {
            [day, month, year] = match.date.split('_').map(Number);
        } else if (match.date.includes('-')) {
            [year, month, day] = match.date.split('-').map(Number);
        } else {
            return res.json({ success: false, message: "Invalid date format" });
        }

        const matchDateTime = new Date(year, month - 1, day);
        const [hours, minutes] = match.time.split(':').map(Number);
        matchDateTime.setHours(hours);
        matchDateTime.setMinutes(minutes);

        const now = new Date();
        const hoursUntilMatch = (matchDateTime - now) / (1000 * 60 * 60);

        // Validate hoursUntilMatch is a valid number
        if (!Number.isFinite(hoursUntilMatch)) {
            return res.json({ success: false, message: "Error calculating match time. Please try again." });
        }

        const cancellationDeadline = match.cancellationDeadlineHours || 2;

        let penaltyApplied = false;

        // If cancelling too close to match, apply penalty
        if (hoursUntilMatch < cancellationDeadline && hoursUntilMatch > 0) {
            penaltyApplied = true;
        }

        // If match already happened, can't cancel
        if (hoursUntilMatch < 0) {
            return res.json({ success: false, message: "Match has already happened" });
        }

        const validHours = Number.isFinite(hoursUntilMatch) ? Math.round(hoursUntilMatch * 100) / 100 : 0;

        // CREATOR SCENARIO
        if (isCreator) {
            // If no other players, cancel entire match
            if (match.joinedPlayers.length === 0) {
                const updatedMatch = await matchModel.findByIdAndUpdate(
                    matchId,
                    {
                        $set: { isCancelled: true, status: 'cancelled' },
                        $push: {
                            playerCancellations: {
                                userId,
                                cancelledAt: new Date(),
                                hoursBeforeMatch: validHours,
                                penaltyApplied: false,
                                reason: 'Creator cancelled match (no participants)'
                            }
                        }
                    },
                    { new: true }
                );

                return res.json({
                    success: true,
                    message: 'Match cancelled successfully',
                    isCreatorAction: true,
                    isFullCancellation: true,
                    match: updatedMatch
                });
            } else {
                // Transfer leadership to first joined player
                const newCreator = match.joinedPlayers[0];
                const updatedMatch = await matchModel.findByIdAndUpdate(
                    matchId,
                    {
                        $set: { creatorId: newCreator },
                        $pull: {
                            joinedPlayers: userId,
                            playerPaymentStatus: { userId }
                        },
                        $push: {
                            playerCancellations: {
                                userId,
                                cancelledAt: new Date(),
                                hoursBeforeMatch: validHours,
                                penaltyApplied,
                                reason: 'Creator left match (transferred to first joiner)'
                            }
                        }
                    },
                    { new: true }
                );

                // Reset isFull flag if needed
                if (updatedMatch.isFull && updatedMatch.joinedPlayers.length < updatedMatch.totalSlots) {
                    updatedMatch.isFull = false;
                    await updatedMatch.save();
                }

                const message = penaltyApplied
                    ? `Match leadership transferred. ⚠️ Penalty applied (left ${Math.round(hoursUntilMatch)}h before match)`
                    : `Match leadership transferred to first joiner`;

                return res.json({
                    success: true,
                    message,
                    penaltyApplied,
                    isCreatorAction: true,
                    isFullCancellation: false,
                    newCreatorId: newCreator,
                    match: updatedMatch
                });
            }
        }

        // REGULAR PLAYER SCENARIO
        const updatedMatch = await matchModel.findByIdAndUpdate(
            matchId,
            {
                $pull: {
                    joinedPlayers: userId,
                    playerPaymentStatus: { userId }
                },
                $push: {
                    playerCancellations: {
                        userId,
                        cancelledAt: new Date(),
                        hoursBeforeMatch: validHours,
                        penaltyApplied
                    }
                }
            },
            { new: true }
        );

        // Reset isFull flag if it was full
        if (updatedMatch.isFull && updatedMatch.joinedPlayers.length < updatedMatch.totalSlots) {
            updatedMatch.isFull = false;
            await updatedMatch.save();
        }

        const message = penaltyApplied
            ? `Left match. ⚠️ Penalty applied (cancelled ${Math.round(hoursUntilMatch)}h before match)`
            : `Successfully left match`;

        res.json({ success: true, message, penaltyApplied, match: updatedMatch });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Rate another player after a match is complete
const ratePlayer = async (req, res) => {
    try {
        const { raterId, ratedUserId, rating } = req.body;
        if (!raterId || !ratedUserId || typeof rating !== 'number') {
            return res.json({ success: false, message: "Missing rate information" });
        }
        const user = await userModel.findById(ratedUserId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        user.ratings.push({ raterId, rating });
        user.totalRatings = user.ratings.length;
        user.averageRating = user.ratings.reduce((acc, r) => acc + r.rating, 0) / user.totalRatings;
        await user.save();
        res.json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// FIX #3: List all matches with automatic expiry status update
const listMatches = async (req, res) => {
    try {
        const filters = {};
        if (req.query.sportType) filters.sportType = req.query.sportType;
        if (req.query.isFull) filters.isFull = req.query.isFull === 'true';

        let matches = await matchModel.find(filters);

        // FIX #3: Update status for any matches past their date/time
        matches = await Promise.all(matches.map(match => updateMatchStatus(match)));

        // Filter only upcoming/ongoing matches for user view
        if (req.query.activeOnly === 'true') {
            matches = matches.filter(m => m.status === 'upcoming' || m.status === 'ongoing');
        }

        res.json({ success: true, matches });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// List matches joined or created by a user
const listUserMatches = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.json({ success: false, message: "Missing userId" });
        }
        let created = await matchModel.find({ creatorId: userId });
        let joined = await matchModel.find({ joinedPlayers: userId });

        // FIX #3: Update status for all user matches
        created = await Promise.all(created.map(match => updateMatchStatus(match)));
        joined = await Promise.all(joined.map(match => updateMatchStatus(match)));

        res.json({ success: true, created, joined });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    createMatch,
    joinMatch,
    confirmPaymentForMatch,
    leaveMatch,
    ratePlayer,
    listMatches,
    listUserMatches,
};
