
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const eventRoutes = require("./routes/eventRoutes");

const app = express();
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");


app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("EventFlow API is running!");
});

app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");

    res.json({
      success: true,
      message: "Backend and MySQL connected successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});
console.log("Booking routes are being registered...");
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`EventFlow server running on port ${PORT}`);
});
