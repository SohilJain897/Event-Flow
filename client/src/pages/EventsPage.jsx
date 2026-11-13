
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  CalendarDays,
  ArrowUpRight,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

import { getEvents } from "../services/api";

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      console.error("Events API error:", err);
      setError(
        "Unable to load events. Please check your backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const locations = [
    ...new Set(events.map((event) => event.location)),
  ];

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const category = event.category || "EVENT";
      const eventDate = String(event.date).slice(0, 10);

      const matchesSearch =
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        category.toLowerCase().includes(search.toLowerCase());

      const matchesLocation =
        !location || event.location === location;

      const matchesDate =
        !date || eventDate === date;

      return matchesSearch && matchesLocation && matchesDate;
    });
  }, [events, search, location, date]);

  return (
    <div className="min-h-screen bg-[#101015] text-white">

      <header className="border-b border-white/10 px-6 pb-16 pt-36">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold tracking-[0.25em] text-orange-400">
            EXPLORE EXPERIENCES
          </p>

          <h1 className="text-5xl font-black md:text-6xl">
            Discover Events<span className="text-orange-400">.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-400">
            Find exciting events, discover new experiences and book
            your next unforgettable moment.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-16">

        {/* Search and Filters */}

        <div className="mb-12 grid gap-4 rounded-2xl border border-white/10 bg-[#1b1b23] p-5 md:grid-cols-3">

          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#101015] px-4">
            <Search className="text-orange-400" size={20} />

            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent py-4 text-white outline-none placeholder:text-gray-500"
            />
          </div>

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#101015] px-4 py-4 text-white outline-none"
          >
            <option value="">All Locations</option>

            {locations.map((place) => (
              <option key={place} value={place}>
                {place}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#101015] px-4 py-4 text-white outline-none"
          />

        </div>

        {/* Loading State */}

        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-4 text-gray-400">
            <LoaderCircle className="animate-spin text-orange-400" size={38} />
            <p>Loading events...</p>
          </div>
        ) : error ? (

          /* Error State */

          <div className="rounded-3xl border border-red-500/20 bg-[#1b1b23] py-16 text-center">
            <h3 className="text-2xl font-bold">Something went wrong</h3>

            <p className="mt-3 text-gray-400">{error}</p>

            <button
              onClick={fetchEvents}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-orange-500 px-7 py-3 font-bold hover:bg-orange-400"
            >
              <RefreshCw size={17} />
              Try Again
            </button>
          </div>

        ) : (

          <>
            {/* Results */}

            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">
                Upcoming Events
              </h2>

              <p className="text-sm text-gray-400">
                {filteredEvents.length} events found
              </p>
            </div>

            {filteredEvents.length > 0 ? (

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

                {filteredEvents.map((event) => (
                  <article
                    key={event.id}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-[#1b1b23] transition hover:-translate-y-2"
                  >

                    <div className="relative h-64 overflow-hidden">

                      <img
                        src={event.img}
                        alt={event.title}
                        className="h-full w-full object-cover transition duration-500 hover:scale-110"
                      />

                      <span className="absolute left-5 top-5 rounded-full bg-orange-500 px-4 py-2 text-xs font-bold">
                        {event.category || "EVENT"}
                      </span>

                    </div>

                    <div className="p-7">

                      <h3 className="min-h-16 text-2xl font-bold">
                        {event.title}
                      </h3>

                      <div className="mt-5 space-y-3 text-sm text-gray-400">

                        <p className="flex items-center gap-3">
                          <CalendarDays size={18} className="text-orange-400" />
                          {String(event.date).slice(0, 10)}
                        </p>

                        <p className="flex items-center gap-3">
                          <MapPin size={18} className="text-orange-400" />
                          {event.location}
                        </p>

                      </div>

                      <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-6">

                        <div>
                          <p className="text-xs text-gray-500">
                            Starting from
                          </p>

                          <p className="text-2xl font-black">
                            ₹{Number(event.price).toLocaleString("en-IN")}
                          </p>
                        </div>

                        <Link
                          to={`/events/${event.id}`}
                          className="rounded-full bg-orange-500 px-5 py-3 font-bold text-white hover:bg-orange-400"
                        >
                          View Event
                          <ArrowUpRight className="ml-1 inline" size={17} />
                        </Link>

                      </div>

                    </div>
                  </article>
                ))}

              </div>

            ) : (

              <div className="rounded-3xl border border-white/10 py-20 text-center">
                <h3 className="text-2xl font-bold">
                  No events found
                </h3>

                <p className="mt-3 text-gray-400">
                  Try changing your search or filters.
                </p>

                <button
                  onClick={() => {
                    setSearch("");
                    setLocation("");
                    setDate("");
                  }}
                  className="mt-6 rounded-full bg-orange-500 px-7 py-3 font-bold"
                >
                  Clear Filters
                </button>
              </div>

            )}
          </>
        )}

      </main>
    </div>
  );
}

export default EventsPage;
