import express from 'express';
import { loginUser, registerUser, getProfile, updateProfile, getPlayerProfile } from '../controllers/userController.js';
import { createMatch, joinMatch, confirmPaymentForMatch, leaveMatch, listMatches, listUserMatches, ratePlayer } from '../controllers/matchController.js';
import upload from '../middleware/multer.js';
import authUser from '../middleware/authUser.js';
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/get-profile", authUser, getProfile);
userRouter.get("/profile/:playerId", authUser, getPlayerProfile);
userRouter.post("/update-profile", upload.single('image'), authUser, updateProfile);

// Match endpoints
userRouter.post("/matches/create", authUser, createMatch);
userRouter.post("/matches/join", authUser, joinMatch);
userRouter.post("/matches/confirm-payment", authUser, confirmPaymentForMatch); // FIX #2: Payment confirmation
userRouter.post("/matches/leave", authUser, leaveMatch); // FIX #4: Leave with cancellation policy
userRouter.get("/matches", authUser, listMatches);
userRouter.get("/matches/user", authUser, listUserMatches);
userRouter.post("/matches/rate", authUser, ratePlayer);

export default userRouter;