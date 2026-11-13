
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Ticket, User, Mail, Phone, Loader2 } from "lucide-react";
import API from "../services/api";

function BookingModal({ event, quantity, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const price = Number(event.price);
  const total = price * quantity;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const response = await API.post("/bookings", {
        event_id: Number(event.id),
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        quantity,
      });

      onSuccess(response.data.booking);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Booking failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name", label: "Full Name", icon: User, type: "text", placeholder: "Enter your full name" },
    { name: "email", label: "Email Address", icon: Mail, type: "email", placeholder: "you@example.com" },
    { name: "mobile", label: "Mobile Number", icon: Phone, type: "tel", placeholder: "10-digit mobile number" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 px-4 py-8 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative my-auto w-full max-w-lg rounded-3xl border border-white/10 bg-[#1b1b23] p-6 text-white shadow-2xl sm:p-8"
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="absolute right-5 top-5 rounded-full p-2 text-gray-400 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
            aria-label="Close booking form"
          >
            <X size={20} />
          </button>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400">
            <Ticket size={23} />
          </div>

          <h2 className="mt-5 text-2xl font-black sm:text-3xl">
            Complete Your Booking
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            Enter your details to reserve your tickets for {event.title}.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            {fields.map((field) => {
              const Icon = field.icon;

              return (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="mb-2 block text-sm font-semibold text-gray-300"
                  >
                    {field.label}
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#101015] px-4 transition focus-within:border-orange-500">
                    <Icon size={18} className="shrink-0 text-gray-500" />

                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      maxLength={field.name === "mobile" ? 15 : 100}
                      className="min-w-0 w-full bg-transparent py-4 text-sm text-white outline-none placeholder:text-gray-600"
                    />
                  </div>
                </div>
              );
            })}

            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Tickets × {quantity}</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="font-bold">Total Amount</span>
                <span className="text-2xl font-black text-orange-400">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-4 font-bold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Booking"
              )}
            </button>

            <p className="text-center text-xs text-gray-500">
              Your booking will be confirmed once successfully saved.
            </p>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default BookingModal;
