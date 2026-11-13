
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboardStats, setDashboardStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    ticketsSold: 0,
    revenue: 0,
  });

  const adminToken = sessionStorage.getItem("adminToken");

  useEffect(() => {
    if (!adminToken) {
      navigate("/admin/login");
      return;
    }

    fetchEvents();
    fetchDashboardStats();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await API.get("/events");
      setEvents(response.data.events || []);
    } catch (err) {
      console.error("Events error:", err);
      setError("Unable to load events. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);

      const response = await API.get("/admin/stats");

      setDashboardStats(response.data.stats);
    } catch (err) {
      console.error("Dashboard stats error:", err);
      setError(
        err.response?.data?.message ||
        "Unable to load dashboard analytics."
      );
    } finally {
      setStatsLoading(false);
    }
  };

  const handleRefresh = () => {
    setError("");
    fetchEvents();
    fetchDashboardStats();
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const stats = [
    {
      title: "Total Events",
      value: dashboardStats.totalEvents,
      icon: "🎫",
      color: "text-orange-400",
    },
    {
      title: "Total Bookings",
      value: dashboardStats.totalBookings,
      icon: "📋",
      color: "text-blue-400",
    },
    {
      title: "Confirmed Bookings",
      value: dashboardStats.confirmedBookings,
      icon: "✅",
      color: "text-green-400",
    },
    {
      title: "Tickets Sold",
      value: dashboardStats.ticketsSold,
      icon: "🎟️",
      color: "text-purple-400",
    },
    {
      title: "Total Revenue",
      value: `₹${dashboardStats.revenue.toLocaleString("en-IN")}`,
      icon: "💰",
      color: "text-green-400",
    },
  ];

  return (
    <div className="min-h-screen bg-[#101015] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#191920] border-r border-white/10 p-6 hidden md:flex flex-col">
        <h1 className="text-2xl font-bold mb-12">
          Event<span className="text-orange-500">Flow.</span>
        </h1>

        <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">
          Main Menu
        </p>

        <nav className="space-y-3">
          <button className="w-full text-left px-4 py-3 rounded-xl bg-orange-500/10 text-orange-400">
            <span className="mr-3">▦</span>
            Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/events")}
            className="w-full text-left px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition"
          >
            <span className="mr-3">🎫</span>
            Manage Events
          </button>

          <button
            onClick={() => navigate("/admin/bookings")}
            className="w-full text-left px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition"
          >
            <span className="mr-3">📋</span>
            Bookings
          </button>
        </nav>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition"
          >
            ↪ Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5 md:p-10 min-w-0">
        <header className="flex flex-wrap justify-between items-center gap-4 mb-10">
          <div>
            <p className="text-gray-500 text-sm">
              EventFlow Administration
            </p>
            <h2 className="text-3xl font-bold mt-1">Dashboard</h2>
            <p className="text-gray-400 mt-2">
              Welcome back! Here's your event overview.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#191920] border border-white/10 rounded-xl px-4 py-2">
              <p className="text-xs text-gray-500">Account</p>
              <p className="text-sm font-semibold">Administrator</p>
            </div>

            <button
              onClick={handleRefresh}
              className="bg-orange-500 hover:bg-orange-600 px-4 py-3 rounded-xl font-semibold transition"
            >
              ↻ Refresh
            </button>
          </div>
        </header>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Analytics Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#191920] border border-white/10 rounded-2xl p-6"
            >
              <div className="flex justify-between items-center mb-5">
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <span className="text-2xl">{stat.icon}</span>
              </div>

              <h3 className={`text-3xl font-bold ${stat.color}`}>
                {statsLoading
                  ? "..."
                  : typeof stat.value === "number"
                  ? stat.value.toLocaleString("en-IN")
                  : stat.value}
              </h3>
            </motion.div>
          ))}
        </section>

        {/* Events Table */}
        <section className="bg-[#191920] border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 flex flex-wrap justify-between items-center gap-4 border-b border-white/10">
            <div>
              <h3 className="text-xl font-bold">Recent Events</h3>
              <p className="text-sm text-gray-500 mt-1">
                Events currently available on EventFlow
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/events")}
              className="bg-orange-500 hover:bg-orange-600 px-5 py-3 rounded-xl text-sm font-semibold transition"
            >
              + Create Event
            </button>
          </div>

          {loading ? (
            <p className="text-gray-400 p-8">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-gray-400 p-8">No events found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[650px]">
                <thead className="text-gray-500 text-sm bg-white/[0.02]">
                  <tr>
                    <th className="px-6 py-4 font-medium">Event</th>
                    <th className="px-6 py-4 font-medium">Location</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium">Seats Left</th>
                  </tr>
                </thead>

                <tbody>
                  {events.slice(0, 5).map((event) => (
                    <tr
                      key={event.id}
                      className="border-t border-white/5 hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-4 font-medium">
                        {event.title}
                      </td>

                      <td className="px-6 py-4 text-gray-400">
                        {event.location}
                      </td>

                      <td className="px-6 py-4 text-gray-400">
                        {new Date(event.date).toLocaleDateString("en-IN")}
                      </td>

                      <td className="px-6 py-4">
                        ₹{Number(event.price).toLocaleString("en-IN")}
                      </td>

                      <td className="px-6 py-4 text-green-400">
                        {event.available_seats}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="text-center text-gray-600 text-xs mt-8">
          © 2026 EventFlow Admin Panel
        </p>
      </main>
    </div>
  );
}

export default AdminDashboard;
