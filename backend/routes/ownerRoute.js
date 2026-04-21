import express from 'express'
import { createTurf, getTurfsByOwner, getTurfDetails, updateTurf, deleteTurf, getAllTurfs, rateTurf, approveOwnerPayment, ownerRemoveTurf } from '../controllers/turfController.js'
import authUser from '../middleware/authUser.js'

const ownerRouter = express.Router()

// Owner login (reuse admin login endpoint or create separate one)
// For now, we'll assume owner uses email/password similar to admin

// Turf management routes
ownerRouter.post('/create-turf', createTurf)           // Create new turf
ownerRouter.post('/get-turfs', getTurfsByOwner)        // Get owner's turfs
ownerRouter.post('/get-turf-details', getTurfDetails)  // Get specific turf details
ownerRouter.post('/update-turf', updateTurf)           // Update turf
ownerRouter.post('/delete-turf', deleteTurf)           // Delete turf
ownerRouter.get('/all-turfs', getAllTurfs)             // Get all turfs (public)
ownerRouter.post('/rate-turf', rateTurf)               // Rate a turf

// Owner approval routes - for turf after admin verification
ownerRouter.post('/approve-turf', approveOwnerPayment) // Owner approves and activates turf
ownerRouter.post('/remove-turf', ownerRemoveTurf)      // Owner removes turf

export default ownerRouter
