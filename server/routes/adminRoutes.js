
const express = require("express");
const router = express.Router();

const db = require("../config/db");
const adminAuth = require("../middleware/adminAuth");

// Admin Login
router.post("/login", (req, res) => {
  const { adminKey } = req.body;

  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({
      success: false,
      message: "Invalid admin credentials.",
    });
  }

  return res.json({
    success: true,
    message: "Admin login successful!",
    token: adminKey,
  });
});

// Dashboard Analytics
router.get("/stats", adminAuth, async (req, res) => {
  try {
    const [eventStats] = await db.query(`
      SELECT COUNT(*) AS totalEvents
      FROM events
    `);

    const [bookingStats] = await db.query(`
      SELECT
        COUNT(*) AS totalBookings,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) AS confirmedBookings,
        SUM(CASE WHEN status = 'confirmed' THEN quantity ELSE 0 END) AS ticketsSold,
        SUM(CASE WHEN status = 'confirmed' THEN total_amount ELSE 0 END) AS revenue
      FROM bookings
    `);

    res.json({
      success: true,
      stats: {
        totalEvents: Number(eventStats[0].totalEvents || 0),
        totalBookings: Number(bookingStats[0].totalBookings || 0),
        confirmedBookings: Number(bookingStats[0].confirmedBookings || 0),
        ticketsSold: Number(bookingStats[0].ticketsSold || 0),
        revenue: Number(bookingStats[0].revenue || 0),
      },
    });
  } catch (error) {
    console.error("Dashboard analytics error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch dashboard analytics.",
    });
  }
});

module.exports = router;
