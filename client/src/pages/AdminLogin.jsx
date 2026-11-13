
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AdminLogin() {
  const navigate = useNavigate();

  const [adminKey, setAdminKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/admin/login", { adminKey });

      sessionStorage.setItem("adminToken", response.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101015] flex items-center justify-center px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white">
            Event<span className="text-orange-500">Flow.</span>
          </h1>
          <p className="text-gray-400 mt-3">Administration Portal</p>
        </div>

        <div className="bg-[#191920] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="mb-8">
            <p className="text-orange-500 text-sm font-semibold uppercase tracking-widest">
              Welcome Back
            </p>
            <h2 className="text-2xl font-bold text-white mt-2">
              Admin Login
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              Sign in to manage your events and bookings.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Admin Password
              </label>

              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter your admin password"
                required
                className="w-full bg-[#101015] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition"
            >
              {loading ? "Signing in..." : "Sign In to Dashboard"}
            </button>
          </form>

          <p className="text-gray-500 text-xs text-center mt-8">
            Restricted access · EventFlow Administration
          </p>
        </div>

        <p className="text-gray-600 text-xs text-center mt-6">
          © 2026 EventFlow. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}

export default AdminLogin;
