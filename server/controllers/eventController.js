
const db = require("../config/db");

// GET all events
exports.getEvents = async (req, res) => {
  try {
    const [events] = await db.query(
      "SELECT * FROM events ORDER BY date ASC"
    );

    res.json({ success: true, events });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
    });
  }
};

// GET single event
exports.getEventById = async (req, res) => {
  try {
    const [events] = await db.query(
      "SELECT * FROM events WHERE id = ?",
      [req.params.id]
    );

    if (events.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({ success: true, event: events[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch event",
    });
  }
};

// CREATE event
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      date,
      total_seats,
      price,
      img,
    } = req.body;

    if (
      !title ||
      !location ||
      !date ||
      !Number.isInteger(Number(total_seats)) ||
      Number(total_seats) <= 0 ||
      price === undefined ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid event details",
      });
    }

    const [result] = await db.query(
      `INSERT INTO events
       (title, description, location, date, total_seats, available_seats, price, img)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || "",
        location,
        date,
        Number(total_seats),
        Number(total_seats),
        Number(price),
        img || "",
      ]
    );

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      eventId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create event",
    });
  }
};

// UPDATE event
exports.updateEvent = async (req, res) => {
  let connection;

  try {
    const {
      title,
      description,
      location,
      date,
      total_seats,
      price,
      img,
    } = req.body;

    const eventId = req.params.id;
    const newTotalSeats = Number(total_seats);

    if (
      !title ||
      !location ||
      !date ||
      !Number.isInteger(newTotalSeats) ||
      newTotalSeats <= 0 ||
      price === undefined ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid event details",
      });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    // Lock event row to prevent simultaneous booking/update conflicts
    const [events] = await connection.query(
      "SELECT id FROM events WHERE id = ? FOR UPDATE",
      [eventId]
    );

    if (events.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Count tickets from confirmed bookings
    const [bookingStats] = await connection.query(
      `SELECT COALESCE(SUM(quantity), 0) AS bookedSeats
       FROM bookings
       WHERE event_id = ? AND status = 'confirmed'`,
      [eventId]
    );

    const bookedSeats = Number(bookingStats[0].bookedSeats);

    // Prevent capacity from going below tickets already sold
    if (newTotalSeats < bookedSeats) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: `Cannot set total seats below ${bookedSeats}. Tickets already booked.`,
      });
    }

    // Calculate remaining seats correctly
    const availableSeats = newTotalSeats - bookedSeats;

    await connection.query(
      `UPDATE events
       SET title = ?, description = ?, location = ?, date = ?,
           total_seats = ?, available_seats = ?, price = ?, img = ?
       WHERE id = ?`,
      [
        title,
        description || "",
        location,
        date,
        newTotalSeats,
        availableSeats,
        Number(price),
        img || "",
        eventId,
      ]
    );

    await connection.commit();

    res.json({
      success: true,
      message: "Event updated successfully",
      available_seats: availableSeats,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update event",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// DELETE event
exports.deleteEvent = async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM events WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error(error);

    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        success: false,
        message: "This event has bookings and cannot be deleted.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete event",
    });
  }
};
