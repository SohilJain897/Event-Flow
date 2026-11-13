
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";

const emptyForm = {
  title: "",
  description: "",
  location: "",
  date: "",
  total_seats: "",
  price: "",
  img: "",
};

function AdminEvents() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionStorage.getItem("adminToken")) {
      navigate("/admin/login");
      return;
    }

    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await API.get("/events");
      setEvents(response.data.events || []);
      setError("");
    } catch (err) {
      setError("Unable to load events.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
    setShowForm(true);
  };

  const openEditForm = (event) => {
    setEditingId(event.id);
    setForm({
      title: event.title || "",
      description: event.description || "",
      location: event.location || "",
      date: event.date ? new Date(event.date).toLocaleDateString("en-CA") : "",
      total_seats: event.total_seats || "",
      price: event.price || "",
      img: event.img || "",
    });
    setMessage("");
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        ...form,
        total_seats: Number(form.total_seats),
        price: Number(form.price),
      };

      if (editingId) {
        await API.put(`/events/${editingId}`, payload);
        setMessage("Event updated successfully!");
      } else {
        await API.post("/events", payload);
        setMessage("Event created successfully!");
      }

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await fetchEvents();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to save event. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await API.delete(`/events/${id}`);
      setMessage("Event deleted successfully!");
      await fetchEvents();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to delete this event. Existing bookings may prevent deletion."
      );
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#101015] text-white">
      <header className="border-b border-white/10 bg-[#191920] px-5 md:px-10 py-5 flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">
          Event<span className="text-orange-500">Flow.</span>
          <span className="text-gray-500 text-sm ml-3 font-normal">
            Admin
          </span>
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="text-gray-300 hover:text-white px-3 py-2"
          >
            Dashboard
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
        <div className="flex flex-wrap justify-between items-center gap-5 mb-8">
          <div>
            <p className="text-orange-400 text-sm uppercase tracking-widest">
              Event Management
            </p>
            <h2 className="text-3xl font-bold mt-2">Manage Events</h2>
            <p className="text-gray-400 mt-2">
              Create, update and manage your events.
            </p>
          </div>

          <button
            onClick={openCreateForm}
            className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-semibold transition"
          >
            + Create New Event
          </button>
        </div>

        {message && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl p-4 mb-5">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 mb-5">
            {error}
          </div>
        )}

        {showForm && (
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#191920] border border-white/10 rounded-2xl p-6 md:p-8 mb-8"
          >
            <div className="flex justify-between items-center mb-7">
              <h3 className="text-xl font-bold">
                {editingId ? "Edit Event" : "Create New Event"}
              </h3>

              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Event Title *
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter event title"
                  className="w-full bg-[#101015] border border-white/10 rounded-xl p-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Location *
                </label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  placeholder="Enter location"
                  className="w-full bg-[#101015] border border-white/10 rounded-xl p-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Event Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#101015] border border-white/10 rounded-xl p-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Total Seats *
                </label>
                <input
                  type="number"
                  name="total_seats"
                  value={form.total_seats}
                  onChange={handleChange}
                  min="1"
                  required
                  placeholder="e.g. 200"
                  className="w-full bg-[#101015] border border-white/10 rounded-xl p-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Ticket Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  placeholder="e.g. 999"
                  className="w-full bg-[#101015] border border-white/10 rounded-xl p-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Image URL
                </label>
                <input
                  name="img"
                  value={form.img}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-[#101015] border border-white/10 rounded-xl p-3 outline-none focus:border-orange-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe your event..."
                  className="w-full bg-[#101015] border border-white/10 rounded-xl p-3 outline-none focus:border-orange-500 resize-y"
                />
              </div>

              <div className="md:col-span-2 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 px-7 py-3 rounded-xl font-semibold"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Event"
                    : "Create Event"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-white/10 hover:bg-white/15 px-7 py-3 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.section>
        )}

        <section className="bg-[#191920] border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-xl font-bold">All Events</h3>
            <p className="text-gray-500 text-sm mt-1">
              {events.length} events in your database
            </p>
          </div>

          {loading ? (
            <p className="p-8 text-gray-400">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="p-8 text-gray-400">No events available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-white/[0.02] text-gray-500 text-sm">
                  <tr>
                    <th className="p-5">Event</th>
                    <th className="p-5">Location</th>
                    <th className="p-5">Date</th>
                    <th className="p-5">Price</th>
                    <th className="p-5">Seats</th>
                    <th className="p-5">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      className="border-t border-white/5 hover:bg-white/[0.02]"
                    >
                      <td className="p-5 font-medium">{event.title}</td>
                      <td className="p-5 text-gray-400">{event.location}</td>
                      <td className="p-5 text-gray-400">
                        {new Date(event.date).toLocaleDateString("en-IN")}
                      </td>
                      <td className="p-5">
                        ₹{Number(event.price).toLocaleString("en-IN")}
                      </td>
                      <td className="p-5 text-green-400">
                        {event.available_seats}/{event.total_seats}
                      </td>
                      <td className="p-5">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditForm(event)}
                            className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 px-3 py-2 rounded-lg text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-2 rounded-lg text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminEvents;
