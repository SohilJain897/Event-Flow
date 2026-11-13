
const express = require("express");
const router = express.Router();

const {
  createBooking,
  getBookings,
} = require("../controllers/bookingController");

const adminAuth = require("../middleware/adminAuth");

// Public booking endpoint
router.post("/", createBooking);

// Admin-only booking list
router.get("/", adminAuth, getBookings);

module.exports = router;
