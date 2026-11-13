
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  ArrowUpRight,
  Menu,
  X,
  MapPin,
  CalendarDays,
  Clock,
  Check,
  Plus,
  Ticket,
  Users,
  Sparkles,
} from "lucide-react";

import { getEvents } from "./services/api";

import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEvents from "./pages/AdminEvents";
import AdminBookings from "./pages/AdminBookings";

// NAVBAR
function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    ["About", "#about"],
    ["Events", "#events"],
    ["Speakers", "#speakers"],
    ["Schedule", "#schedule"],
    ["Tickets", "#tickets"],
  ];

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#101015]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="text-2xl font-black text-white">
          event<span className="text-orange-400">flow.</span>
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {links.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="text-sm text-gray-300 hover:text-orange-400"
            >
              {label}
            </a>
          ))}
        </div>

        <Link
          to="/events"
          className="hidden rounded-full bg-orange-500 px-7 py-3 font-bold text-white transition hover:bg-orange-400 md:inline-flex"
        >
          Explore Events <ArrowUpRight className="ml-2" size={18} />
        </Link>

        <button
          className="text-white md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-5 border-t border-white/10 bg-[#101015] px-6 py-7 md:hidden">
          {links.map(([label, href]) => (
            <a
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="text-gray-300"
            >
              {label}
            </a>
          ))}

          <Link
            to="/events"
            onClick={() => setOpen(false)}
            className="rounded-full bg-orange-500 px-6 py-3 text-center font-bold"
          >
            Explore Events
          </Link>
        </div>
      )}
    </nav>
  );
}

// SECTION HEADING
function SectionHeading({ label, title, description }) {
  return (
    <div className="mb-14 max-w-2xl">
      <p className="mb-4 text-xs font-bold tracking-[0.25em] text-orange-400">
        {label}
      </p>

      <h2 className="text-4xl font-black leading-tight text-white md:text-5xl">
        {title}
      </h2>

      <p className="mt-5 leading-8 text-gray-400">
        {description}
      </p>
    </div>
  );
}

// HERO
function Hero() {
  return (
    <section className="relative flex min-h-[780px] items-center overflow-hidden bg-[#101015] px-6 pt-32">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1800"
          alt="Conference"
          className="h-full w-full object-cover opacity-30"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-[#101015] via-[#101015]/90 to-[#101015]/40" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/40 bg-orange-400/10 px-5 py-3 text-xs font-bold tracking-widest text-orange-300">
            <Sparkles size={15} />
            IDEAS THAT MOVE THE WORLD
          </span>

          <h1 className="mt-9 text-6xl font-black leading-[1.08] tracking-tight text-white md:text-7xl lg:text-8xl">
            Connect.
            <br />
            Discover.
            <br />
            <span className="text-orange-400">Experience.</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-9 text-gray-300">
            Discover extraordinary events, meet inspiring people
            and create experiences that stay with you forever.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/events"
              className="inline-flex min-h-14 items-center rounded-full bg-orange-500 px-8 py-4 font-bold text-white transition hover:bg-orange-400"
            >
              Book Your Tickets <ArrowUpRight className="ml-2" />
            </Link>

            <a
              href="#about"
              className="inline-flex min-h-14 items-center rounded-full border border-white/30 px-8 py-4 font-semibold text-white hover:bg-white/10"
            >
              Discover More
            </a>
          </div>

          <div className="mt-16 flex flex-wrap gap-12">
            <div>
              <h3 className="text-3xl font-black text-white">50+</h3>
              <p className="text-sm text-gray-400">Amazing events</p>
            </div>

            <div>
              <h3 className="text-3xl font-black text-white">10K+</h3>
              <p className="text-sm text-gray-400">Happy attendees</p>
            </div>

            <div>
              <h3 className="text-3xl font-black text-white">25+</h3>
              <p className="text-sm text-gray-400">Expert speakers</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative hidden lg:block"
        >
          <img
            src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1000"
            alt="Conference audience"
            className="h-[540px] w-full rounded-[35px] object-cover"
          />

          <div className="absolute -bottom-7 -left-8 rounded-2xl border border-white/10 bg-[#202027] p-7 shadow-2xl">
            <p className="text-sm text-gray-400">Your next experience</p>

            <h3 className="mt-2 text-2xl font-bold text-white">
              Starts right here.
            </h3>

            <Link
              to="/events"
              className="mt-4 inline-flex items-center gap-2 text-orange-400"
            >
              Explore events <ArrowUpRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ABOUT
function About() {
  return (
    <section id="about" className="bg-[#17171e] px-6 py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        <div>
          <SectionHeading
            label="ABOUT EVENTFLOW"
            title="Where experiences become memories."
            description="EventFlow brings people together through technology, creativity and unforgettable experiences. Discover events that inspire you and connect with people who share your interests."
          />

          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/10 p-7">
              <Users className="mb-5 text-orange-400" size={28} />
              <h3 className="font-bold text-white">Community</h3>
              <p className="mt-3 text-sm text-gray-400">
                Meet people and build connections.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 p-7">
              <Ticket className="mb-5 text-orange-400" size={28} />
              <h3 className="font-bold text-white">Easy Booking</h3>
              <p className="mt-3 text-sm text-gray-400">
                Book your next experience with ease.
              </p>
            </div>
          </div>
        </div>

        <img
          src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1000"
          alt="Event speaker"
          className="h-[480px] w-full rounded-[30px] object-cover"
        />
      </div>
    </section>
  );
}

// FEATURED EVENTS - MYSQL API
function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data || []);
      } catch (err) {
        console.error("Failed to fetch homepage events:", err);
        setError("Unable to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section id="events" className="bg-[#101015] px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          label="UPCOMING EXPERIENCES"
          title="Find your next event."
          description="From technology conferences to creative gatherings, find an experience worth attending."
        />

        {loading ? (
          <p className="py-10 text-center text-gray-400">
            Loading events...
          </p>
        ) : error ? (
          <p className="py-10 text-center text-red-400">{error}</p>
        ) : events.length === 0 ? (
          <p className="py-10 text-center text-gray-400">
            No events available right now.
          </p>
        ) : (
          <div className="grid gap-9 md:grid-cols-2 lg:grid-cols-3">
            {events.slice(0, 3).map((event, index) => (
              <motion.article
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
                className="overflow-hidden rounded-3xl border border-white/10 bg-[#1b1b23] transition hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={event.img}
                    alt={event.title}
                    className="h-full w-full object-cover transition duration-700 hover:scale-110"
                  />

                  <span className="absolute left-5 top-5 rounded-full bg-orange-500 px-4 py-2 text-xs font-bold">
                    EVENT
                  </span>
                </div>

                <div className="p-7">
                  <h3 className="min-h-16 text-2xl font-bold text-white">
                    {event.title}
                  </h3>

                  <div className="mt-5 space-y-4 text-sm text-gray-400">
                    <p className="flex items-center gap-3">
                      <CalendarDays className="text-orange-400" size={18} />
                      {new Date(event.date).toLocaleDateString("en-IN")}
                    </p>

                    <p className="flex items-center gap-3">
                      <MapPin className="text-orange-400" size={18} />
                      {event.location}
                    </p>
                  </div>

                  <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-6">
                    <div>
                      <p className="text-xs text-gray-500">Starting from</p>
                      <p className="text-2xl font-black text-white">
                        ₹{Number(event.price).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <Link
                      to={`/events/${event.id}`}
                      className="rounded-full bg-orange-500 px-5 py-3 font-bold text-white hover:bg-orange-400"
                    >
                      Book Now <ArrowUpRight className="ml-1 inline" size={16} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        <div className="mt-14 text-center">
          <Link
            to="/events"
            className="inline-flex min-h-14 items-center rounded-full border border-white/20 px-9 py-4 font-bold text-white transition hover:border-orange-400 hover:text-orange-400"
          >
            View All Events <ArrowUpRight className="ml-2" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// SPEAKERS
function Speakers() {
  const speakers = [
    { name: "Marcus Elwood", role: "AI Research Scientist", initials: "ME" },
    { name: "Jonathan Reyes", role: "Cloud Engineering Lead", initials: "JR" },
    { name: "Daniel Kim", role: "Founder & CTO", initials: "DK" },
    { name: "Ahmed Faizal", role: "Cybersecurity Architect", initials: "AF" },
  ];

  return (
    <section id="speakers" className="bg-[#17171e] px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          label="MEET THE EXPERTS"
          title="Learn from inspiring minds."
          description="Connect with experts, creators and innovators sharing their knowledge and experience."
        />

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {speakers.map((speaker) => (
            <motion.div
              key={speaker.name}
              whileHover={{ y: -7 }}
              className="rounded-3xl border border-white/10 bg-[#202027] p-8 text-center"
            >
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-purple-700 text-2xl font-black">
                {speaker.initials}
              </div>

              <h3 className="mt-6 font-bold text-white">{speaker.name}</h3>
              <p className="mt-3 text-sm text-gray-400">{speaker.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// SCHEDULE
function Schedule() {
  const schedule = [
    ["09:00 AM", "Opening & Welcome", "Meet the community and discover the day ahead."],
    ["10:00 AM", "The Future of AI", "Explore the next generation of intelligent technology."],
    ["12:00 PM", "Innovation Showcase", "Discover ideas and products shaping tomorrow."],
    ["02:00 PM", "Building Scalable Products", "Learn from founders and industry leaders."],
    ["04:00 PM", "Networking & Closing", "Connect, collaborate and build new opportunities."],
  ];

  return (
    <section id="schedule" className="bg-[#101015] px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          label="EVENT AGENDA"
          title="A day full of inspiration."
          description="Explore a sample conference schedule and the experiences waiting for you."
        />

        <div className="space-y-5">
          {schedule.map(([time, title, description]) => (
            <div
              key={time}
              className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-[#1b1b23] p-7 md:flex-row md:items-center"
            >
              <div className="flex min-w-36 items-center gap-3 font-bold text-orange-400">
                <Clock size={18} /> {time}
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm text-gray-400">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// TICKETS
function Tickets() {
  const plans = [
    {
      name: "Basic",
      price: "₹799",
      features: ["Event entry", "Main sessions", "Networking access"],
    },
    {
      name: "Premium",
      price: "₹1,499",
      features: [
        "Everything in Basic",
        "Priority seating",
        "Conference kit",
        "Exclusive networking",
      ],
      popular: true,
    },
  ];

  return (
    <section id="tickets" className="bg-[#17171e] px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="TICKET OPTIONS"
          title="Choose your experience."
          description="Select the ticket that works best for you."
        />

        <div className="grid gap-9 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl border p-10 ${
                plan.popular
                  ? "border-orange-500 bg-[#24212a]"
                  : "border-white/10 bg-[#202027]"
              }`}
            >
              {plan.popular && (
                <span className="rounded-full bg-orange-500 px-4 py-2 text-xs font-bold">
                  MOST POPULAR
                </span>
              )}

              <h3 className="mt-7 text-3xl font-bold text-white">
                {plan.name}
              </h3>

              <p className="mt-5 text-5xl font-black text-white">
                {plan.price}
              </p>

              <p className="mt-2 text-sm text-gray-400">Per person</p>

              <div className="my-9 space-y-5">
                {plan.features.map((feature) => (
                  <p
                    key={feature}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <Check size={19} className="text-orange-400" />
                    {feature}
                  </p>
                ))}
              </div>

              <Link
                to="/events"
                className="flex min-h-14 items-center justify-center rounded-full bg-orange-500 py-4 font-bold text-white hover:bg-orange-400"
              >
                Get Your Ticket <ArrowUpRight className="ml-2" size={18} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// FAQ
function FAQ() {
  const [active, setActive] = useState(0);

  const faqs = [
    ["How can I book tickets?", "Choose an event, select your ticket quantity and complete the booking form."],
    ["Can I cancel my booking?", "Bookings can be cancelled subject to the event's cancellation policy."],
    ["Will I receive a ticket?", "Yes. After successful booking, you will receive a confirmation and downloadable QR ticket."],
    ["Can I book multiple tickets?", "Yes. You can select multiple tickets, subject to available seat capacity."],
  ];

  return (
    <section className="bg-[#101015] px-6 py-28">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2">
        <SectionHeading
          label="HAVE QUESTIONS?"
          title="Everything you need to know."
          description="Here are answers to some frequently asked questions about EventFlow and ticket bookings."
        />

        <div className="space-y-4">
          {faqs.map(([question, answer], index) => (
            <div
              key={question}
              className="rounded-2xl border border-white/10 bg-[#1b1b23] p-7"
            >
              <button
                onClick={() => setActive(active === index ? -1 : index)}
                className="flex min-h-10 w-full items-center justify-between gap-4 text-left font-bold text-white"
              >
                {question}

                {active === index ? (
                  <X className="shrink-0 text-orange-400" />
                ) : (
                  <Plus className="shrink-0 text-orange-400" />
                )}
              </button>

              {active === index && (
                <p className="mt-5 leading-8 text-gray-400">{answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// FOOTER
function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#101015] px-6 py-16">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 md:flex-row">
        <div>
          <Link to="/" className="text-3xl font-black text-white">
            event<span className="text-orange-400">flow.</span>
          </Link>

          <p className="mt-5 max-w-sm text-sm leading-7 text-gray-400">
            Discover events. Connect with people. Create unforgettable memories.
          </p>
        </div>

        <div className="flex flex-wrap gap-8 text-sm text-gray-400">
          <a href="#about" className="hover:text-orange-400">About</a>
          <Link to="/events" className="hover:text-orange-400">Events</Link>
          <a href="#schedule" className="hover:text-orange-400">Schedule</a>
          <a href="#tickets" className="hover:text-orange-400">Tickets</a>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-7xl border-t border-white/10 pt-8 text-sm text-gray-500">
        © 2026 EventFlow. All rights reserved.
      </div>
    </footer>
  );
}

// HOMEPAGE
function HomePage() {
  return (
    <div className="min-h-screen bg-[#101015]">
      <Navbar />

      <main>
        <Hero />
        <About />
        <Events />
        <Speakers />
        <Schedule />
        <Tickets />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}

// APP ROUTES
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
