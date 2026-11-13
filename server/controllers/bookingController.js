
const db = require("../config/db");

const createBooking = async (req, res) => {
  const { event_id, name, email, mobile, quantity } = req.body;

  // Validate input
  if (!event_id || !name || !email || !mobile || !quantity) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  const ticketQuantity = Number(quantity);
  const eventId = Number(event_id);

  if (
    !Number.isInteger(eventId) ||
    eventId <= 0 ||
    !Number.isInteger(ticketQuantity) ||
    ticketQuantity < 1 ||
    ticketQuantity > 10
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid event ID or ticket quantity. Maximum 10 tickets allowed.",
    });
  }

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof mobile !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    mobile.trim().length < 10
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid name, email and mobile details.",
    });
  }

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Lock event row to prevent simultaneous overbooking
    const [events] = await connection.execute(
      "SELECT id, title, price, available_seats FROM events WHERE id = ? FOR UPDATE",
      [eventId]
    );

    if (events.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    const event = events[0];
    const availableSeats = Number(event.available_seats);

    if (availableSeats < ticketQuantity) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: `Only ${availableSeats} seats are available.`,
      });
    }

    const totalAmount = Number(event.price) * ticketQuantity;

    // Save booking
    const [bookingResult] = await connection.execute(
      `INSERT INTO bookings
       (event_id, name, email, mobile, quantity, total_amount, booking_date, status)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), 'confirmed')`,
      [
        eventId,
        name.trim(),
        email.trim(),
        mobile.trim(),
        ticketQuantity,
        totalAmount,
      ]
    );

    // Reduce available seats
    await connection.execute(
      "UPDATE events SET available_seats = available_seats - ? WHERE id = ?",
      [ticketQuantity, eventId]
    );

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: "Booking confirmed successfully!",
      booking: {
        id: bookingResult.insertId,
        event_id: eventId,
        event_title: event.title,
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        quantity: ticketQuantity,
        total_amount: totalAmount,
        status: "confirmed",
      },
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("Booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Booking failed. Please try again.",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
const getBookings = async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT
        b.id,
        b.event_id,
        b.name,
        b.email,
        b.mobile,
        b.quantity,
        b.total_amount,
        b.booking_date,
        b.status,
        e.title AS event_title,
        e.location AS event_location
      FROM bookings b
      INNER JOIN events e ON b.event_id = e.id
      ORDER BY b.booking_date DESC
    `);

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch bookings.",
    });
  }
};

module.exports = { createBooking, getBookings };
