
import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  Minus,
  Plus,
  Ticket,
  ShieldCheck,
  CheckCircle2,
  Download,
} from "lucide-react";

import confetti from "canvas-confetti";
import { QRCodeSVG } from "qrcode.react";

import { getEventById } from "../services/api";
import BookingModal from "../components/BookingModal";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

function EventDetailsPage() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getEventById(id);

        if (!data) {
          setError("Event not found");
          return;
        }

        setEvent(data);
        setQuantity(1);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Unable to load event. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#101015] text-white">
        Loading event details...
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#101015] px-6 text-center text-white">
        <h1 className="text-4xl font-black">Event not found</h1>
        <p className="mt-3 text-gray-400">
          {error || "The event you're looking for doesn't exist."}
        </p>
        <Link
          to="/events"
          className="mt-7 rounded-full bg-orange-500 px-8 py-3 font-bold transition hover:bg-orange-400"
        >
          Browse Events
        </Link>
      </div>
    );
  }

  const availableSeats = Number(event.available_seats);
  const price = Number(event.price);
  const maxTickets = Math.min(10, availableSeats);
  const total = price * quantity;

  const eventDate = String(event.date).slice(0, 10);

  const formattedDate = new Date(
    `${eventDate}T00:00:00`
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const updateQuantity = (value) => {
    setQuantity(Math.max(1, Math.min(value, maxTickets)));
  };

  const handleBookingSuccess = (bookingData) => {
    setBooking(bookingData);
    setShowBookingModal(false);

    setEvent((previous) => ({
      ...previous,
      available_seats:
        Number(previous.available_seats) -
        Number(bookingData.quantity),
    }));

    setQuantity(1);

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
    });
  };

  const downloadTicket = async () => {
    const ticketElement = document.getElementById("eventflow-ticket");

    if (!ticketElement || !booking) {
      alert("Ticket could not be found. Please try again.");
      return;
    }

    try {
      const canvas = await html2canvas(ticketElement, {
        scale: 2,
        backgroundColor: "#1b1b23",
        useCORS: true,
        logging: false,
      });

      const imageData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 12;
      const maxWidth = pageWidth - margin * 2;
      const maxHeight = pageHeight - margin * 2;

      const scale = Math.min(
        maxWidth / canvas.width,
        maxHeight / canvas.height
      );

      const imageWidth = canvas.width * scale;
      const imageHeight = canvas.height * scale;
      const x = (pageWidth - imageWidth) / 2;
      const y = Math.max(margin, (pageHeight - imageHeight) / 2);

      pdf.addImage(imageData, "PNG", x, y, imageWidth, imageHeight);
      pdf.save(`EventFlow-Ticket-${booking.id}.pdf`);
    } catch (error) {
      console.error("Ticket PDF download failed:", error);
      alert("Unable to download your PDF ticket. Please try again.");
    }
  };

  const details = [
    {
      icon: CalendarDays,
      label: "Event Date",
      value: formattedDate,
    },
    {
      icon: Clock,
      label: "Event Time",
      value: "To be announced",
    },
    {
      icon: MapPin,
      label: "Location",
      value: event.location,
    },
    {
      icon: Users,
      label: "Available Seats",
      value: availableSeats,
    },
  ];

  return (
    <main className="min-h-screen bg-[#101015] text-white">
      <div className="mx-auto w-full max-w-[1400px] px-5 pb-24 pt-32 sm:px-8 lg:px-10">

        <Link
          to="/events"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-orange-400"
        >
          <ArrowLeft size={18} />
          Back to events
        </Link>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1.65fr)_minmax(350px,0.85fr)] xl:gap-14">

          <section className="min-w-0">

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#1b1b23]">
              <img
                src={event.img}
                alt={event.title}
                className="aspect-[16/9] w-full object-cover"
              />
            </div>

            <div className="mt-8">
              <span className="inline-flex rounded-full bg-orange-500/15 px-4 py-2 text-xs font-bold uppercase tracking-widest text-orange-400">
                EVENT
              </span>

              <h1 className="mt-5 max-w-4xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {event.title}
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-gray-400 sm:text-lg">
                {event.description}
              </p>
            </div>

            <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {details.map((detail) => {
                const Icon = detail.icon;

                return (
                  <div
                    key={detail.label}
                    className="rounded-2xl border border-white/10 bg-[#1b1b23] p-5 transition hover:border-orange-500/40"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                      <Icon size={21} />
                    </div>

                    <p className="mt-4 text-sm text-gray-500">
                      {detail.label}
                    </p>

                    <p className="mt-1 break-words text-base font-bold text-white">
                      {detail.value}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 border-t border-white/10 pt-9">
              <h2 className="text-2xl font-bold">About this event</h2>
              <p className="mt-4 max-w-3xl leading-8 text-gray-400">
                {event.description}
              </p>
            </div>
          </section>

          <aside className="min-w-0 lg:sticky lg:top-28">
            <div className="rounded-3xl border border-white/10 bg-[#1b1b23] p-6 shadow-2xl sm:p-8">

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Ticket size={17} className="text-orange-400" />
                Ticket price per person
              </div>

              <h2 className="mt-3 text-4xl font-black tracking-tight">
                ₹{price.toLocaleString("en-IN")}
              </h2>

              <div className="my-7 border-t border-white/10" />

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold">Select Tickets</p>
                  <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                    Maximum available: {availableSeats}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <button
                    type="button"
                    disabled={quantity <= 1}
                    onClick={() => updateQuantity(quantity - 1)}
                    aria-label="Decrease ticket quantity"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-gray-300 transition hover:border-orange-400 hover:text-orange-400 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="min-w-5 text-center text-lg font-bold">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    disabled={quantity >= maxTickets}
                    onClick={() => updateQuantity(quantity + 1)}
                    aria-label="Increase ticket quantity"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Plus size={17} />
                  </button>
                </div>
              </div>

              <div className="my-7 border-t border-white/10" />

              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Ticket price</span>
                  <span>₹{price.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>Quantity</span>
                  <span>{quantity}</span>
                </div>
              </div>

              <div className="my-6 border-t border-white/10" />

              <div className="flex items-center justify-between gap-3">
                <span className="text-base font-bold sm:text-lg">
                  Total Amount
                </span>

                <span className="text-2xl font-black text-orange-400">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowBookingModal(true)}
                disabled={availableSeats === 0}
                className="mt-7 w-full rounded-full bg-orange-500 px-5 py-4 font-bold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {availableSeats === 0 ? "Sold Out" : "Proceed to Book"}
              </button>

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500">
                <ShieldCheck size={15} className="text-green-400" />
                Secure booking · Instant confirmation
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-gray-600">
              Book your tickets before they sell out.
            </p>
          </aside>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          event={event}
          quantity={quantity}
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {booking && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-black/85 px-4 py-8 backdrop-blur-sm">
          <div
            id="eventflow-ticket"
            className="my-auto w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#1b1b23] text-white shadow-2xl"
          >

            <div className="bg-gradient-to-r from-orange-600 to-orange-400 px-6 py-7 text-center">
              <CheckCircle2 size={48} className="mx-auto text-white" />

              <h2 className="mt-3 text-2xl font-black">
                Booking Confirmed!
              </h2>

              <p className="mt-2 text-sm text-white/80">
                Your event ticket is ready.
              </p>
            </div>

            <div className="p-7">

              <div className="text-center">
                <p className="text-xs uppercase tracking-widest text-gray-500">
                  Booking ID
                </p>

                <p className="mt-1 text-2xl font-black text-orange-400">
                  #{booking.id}
                </p>
              </div>

              <div className="my-6 flex justify-center rounded-2xl bg-white p-5">
                <QRCodeSVG
                  value={JSON.stringify({
                    bookingId: booking.id,
                    eventId: booking.event_id,
                    event: booking.event_title,
                    name: booking.name,
                    email: booking.email,
                    quantity: booking.quantity,
                    status: booking.status,
                  })}
                  size={170}
                  level="H"
                  includeMargin
                />
              </div>

              <p className="mb-5 text-center text-xs text-gray-500">
                Scan this QR code to view your booking information.
              </p>

              <div className="space-y-4 rounded-2xl bg-[#101015] p-5">
                <div>
                  <p className="text-xs text-gray-500">Event</p>
                  <p className="mt-1 font-bold">{booking.event_title || event.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Event Date</p>
                    <p className="mt-1 font-bold">{formattedDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="mt-1 font-bold">{event.location}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Customer</p>
                  <p className="mt-1 font-bold">{booking.name}</p>
                </div>

                <div className="flex justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Tickets</p>
                    <p className="mt-1 font-bold">{booking.quantity}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500">Total Amount</p>
                    <p className="mt-1 font-bold text-orange-400">
                      ₹{Number(booking.total_amount).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-3">
                  <p className="text-xs text-gray-500">Booking Status</p>
                  <p className="mt-1 font-bold text-green-400">
                    Confirmed
                  </p>
                </div>
              </div>

              <button
                type="button"
                data-html2canvas-ignore="true"
                onClick={downloadTicket}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-orange-500 py-3 font-bold text-orange-400 transition hover:bg-orange-500 hover:text-white"
              >
                <Download size={18} />
                Download Complete Ticket (PDF)
              </button>

              <button
                type="button"
                data-html2canvas-ignore="true"
                onClick={() => setBooking(null)}
                className="mt-3 w-full rounded-full bg-orange-500 py-4 font-bold transition hover:bg-orange-400"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default EventDetailsPage;
