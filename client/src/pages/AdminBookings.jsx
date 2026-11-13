
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";

function AdminBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!sessionStorage.getItem("adminToken")) {
      navigate("/admin/login");
      return;
    }

    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await API.get("/bookings");
      setBookings(response.data.bookings || []);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const filteredBookings = bookings.filter((booking) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      String(booking.id).includes(searchText) ||
      booking.name?.toLowerCase().includes(searchText) ||
      booking.email?.toLowerCase().includes(searchText) ||
      booking.event_title?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "all" ||
      booking.status?.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = bookings
    .filter((booking) => booking.status === "confirmed")
    .reduce(
      (sum, booking) => sum + Number(booking.total_amount || 0),
      0
    );

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed"
  ).length;

  const totalTickets = bookings
    .filter((booking) => booking.status === "confirmed")
    .reduce((sum, booking) => sum + Number(booking.quantity || 0), 0);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#101015] text-white">
      <header className="bg-[#191920] border-b border-white/10 px-5 md:px-10 py-5 flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">
          Event<span className="text-orange-500">Flow.</span>
          <span className="text-gray-500 text-sm ml-3 font-normal">
            Admin
          </span>
        </h1>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="text-gray-300 hover:text-white px-3 py-2"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/events")}
            className="text-gray-300 hover:text-white px-3 py-2"
          >
            Manage Events
          </button>

          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 px-3 py-2"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 md:px-10 py-10">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <p className="text-orange-400 uppercase tracking-widest text-sm">
              Booking Management
            </p>
            <h2 className="text-3xl font-bold mt-2">
              Customer Bookings
            </h2>
            <p className="text-gray-400 mt-2">
              Monitor all reservations and ticket sales.
            </p>
          </div>

          <button
            onClick={fetchBookings}
            className="bg-orange-500 hover:bg-orange-600 px-5 py-3 rounded-xl font-semibold transition"
          >
            ↻ Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {[
            {
              title: "Total Bookings",
              value: bookings.length,
              icon: "📋",
            },
            {
              title: "Confirmed Bookings",
              value: confirmedBookings,
              icon: "✅",
            },
            {
              title: "Confirmed Revenue",
              value: `₹${totalRevenue.toLocaleString("en-IN")}`,
              icon: "💰",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#191920] border border-white/10 rounded-2xl p-6"
            >
              <div className="flex justify-between items-center">
                <p className="text-gray-400 text-sm">{item.title}</p>
                <span className="text-2xl">{item.icon}</span>
              </div>

              <h3 className="text-3xl font-bold text-orange-400 mt-5">
                {loading ? "..." : item.value}
              </h3>
            </motion.div>
          ))}
        </section>

        <div className="bg-[#191920] border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-xl font-bold">All Reservations</h3>
            <p className="text-sm text-gray-500 mt-1">
              {filteredBookings.length} bookings displayed · {totalTickets} confirmed tickets
            </p>

            <div className="flex flex-col md:flex-row gap-3 mt-5">
              <input
                type="text"
                placeholder="Search by customer, email, event or booking ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-[#101015] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#101015] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p className="p-8 text-gray-400">Loading bookings...</p>
          ) : filteredBookings.length === 0 ? (
            <p className="p-8 text-gray-400">
              No bookings found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left">
                <thead className="bg-white/[0.02] text-gray-500 text-sm">
                  <tr>
                    <th className="p-5">Booking ID</th>
                    <th className="p-5">Customer</th>
                    <th className="p-5">Event</th>
                    <th className="p-5">Tickets</th>
                    <th className="p-5">Amount</th>
                    <th className="p-5">Booking Date</th>
                    <th className="p-5">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-t border-white/5 hover:bg-white/[0.02]"
                    >
                      <td className="p-5 text-orange-400 font-semibold">
                        #{booking.id}
                      </td>

                      <td className="p-5">
                        <p className="font-medium">{booking.name}</p>
                        <p className="text-gray-500 text-sm">
                          {booking.email}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {booking.mobile}
                        </p>
                      </td>

                      <td className="p-5">
                        <p className="font-medium">
                          {booking.event_title}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {booking.event_location}
                        </p>
                      </td>

                      <td className="p-5">{booking.quantity}</td>

                      <td className="p-5 font-medium">
                        ₹{Number(booking.total_amount).toLocaleString("en-IN")}
                      </td>

                      <td className="p-5 text-gray-400 text-sm">
                        {formatDate(booking.booking_date)}
                      </td>

                      <td className="p-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === "confirmed"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminBookings;