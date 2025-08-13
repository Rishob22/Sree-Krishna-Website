// ProfileBookingsPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useStateContext } from "../context/StateContext";
import "./ProfileBookingsPage.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export default function ProfileBookingsPage() {
  const { user, setUser } = useStateContext();
  const navigate = useNavigate();

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const bookingsRef = useRef(null);

  // ----- Logout handler (provided) -----
  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;
    try {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/logout`, {
        method: "POST",
        credentials: "include",
      });
      // Attempt to delete client-side cookie (for good measure)
      document.cookie =
        "signedin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // -------- Fetch user’s slots --------
  useEffect(() => {
    let mounted = true;

    if (!user?._id) {
      setSlots([]);
      setLoading(false);
      return () => {
        mounted = false;
      };
    }

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/slot`, { credentials: "include" });
        const all = res.ok ? await res.json() : [];

        // support userId as string OR populated object
        const mine = all.filter((s) => {
          const sid = s?.userId && (s.userId._id || s.userId);
          return (
            sid &&
            String(sid) === String(user._id) &&
            (s.status === "booked" || s.status === "pending")
          );
        });

        if (!mounted) return;
        setSlots(mine);
      } catch (e) {
        console.error("Failed to load slots:", e);
        if (mounted) setSlots([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [user?._id]);

  // -------- Utilities --------
  const parseStartEnd = (dateStr, timeStr) => {
    // Accepts "5pm-7pm" or "5:30pm-7pm"
    const parseHour = (chunk) => {
      const m = String(chunk)
        .trim()
        .toLowerCase()
        .match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);
      if (!m) return null;
      let [, hh, mm, ap] = m;
      let h = parseInt(hh, 10);
      const minutes = mm ? parseInt(mm, 10) : 0;
      if (ap === "pm" && h < 12) h += 12;
      if (ap === "am" && h === 12) h = 0;
      return { h, minutes };
    };

    const [startRaw, endRaw] = String(timeStr).split("-");
    const s = parseHour(startRaw);
    const e = parseHour(endRaw);

    // Try full date string first
    let base = new Date(dateStr);
    if (isNaN(base.getTime())) {
      // Fallback: drop weekday if present ("Tuesday, Aug 19, 2025" -> "Aug 19, 2025")
      const parts = String(dateStr).split(", ");
      const fallback = parts.length > 1 ? parts.slice(1).join(", ") : dateStr;
      base = new Date(fallback);
    }
    if (isNaN(base.getTime())) return { start: null, end: null };

    if (s) base.setHours(s.h, s.minutes, 0, 0);
    const end = new Date(base);
    if (e) end.setHours(e.h, e.minutes, 0, 0);
    return { start: base, end };
  };

  const now = new Date();
  const bookings = useMemo(() => {
    return slots
      .map((s) => {
        const { start, end } = parseStartEnd(s.date, s.time);
        const isPast = end ? end < now : false;
        return { ...s, __start: start, __end: end, __isPast: isPast };
      })
      .sort((a, b) => (a.__start && b.__start ? a.__start - b.__start : 0));
  }, [slots]);

  const upcoming = bookings.filter((b) => !b.__isPast);
  const past = bookings.filter((b) => b.__isPast);

  const statusBadge = (status) => {
    const map = {
      booked: { label: "Confirmed", cls: "badge-violet" },
      pending: { label: "Pending", cls: "badge-rose" },
      available: { label: "Available", cls: "badge-lavender" },
    };
    const s = map[status] || { label: status, cls: "badge-lavender" };
    return (
      <span className={`badge rounded-pill px-3 py-2 ${s.cls}`}>{s.label}</span>
    );
  };

  const scrollToBookings = () =>
    bookingsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

  // -------- Components --------
  const BookingCard = ({ item }) => (
    <div className="card shadow-sm border-0 rounded-4 mb-3 card-glow">
      <div className="card-body">
        <div className="d-flex align-items-start justify-content-between gap-2">
          <div>
            <h6 className="mb-1 fw-semibold">{item.date}</h6>
            <div className="text-secondary small">{item.time} · IST</div>
          </div>
          {statusBadge(item.status)}
        </div>

        <div className="d-flex align-items-center justify-content-between mt-3">
          <div className="text-secondary small">Booking ID</div>
          <div
            className="text-truncate small fw-medium"
            style={{ maxWidth: 220 }}
          >
            {item._id}
          </div>
        </div>

        <div className="d-flex justify-content-center gap-2 mt-3">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => {
              setSelectedBooking(item);
              setDetailOpen(true);
            }}
          >
            View details
          </button>
        </div>
      </div>
    </div>
  );

  const EmptyState = ({ title, subtitle }) => (
    <div className="card border-0 rounded-4 text-center p-4 bg-soft-panel">
      <div className="card-body">
        <div className="fw-semibold">{title}</div>
        <div className="text-secondary small mt-1">{subtitle}</div>
        <button className="btn btn-primary mt-3">Book a session</button>
      </div>
    </div>
  );

  return (
    <div className="min-vh-100 theme-aurora">
      {/* Profile Header */}
      <section className="container px-3 py-4">
        <div className="mx-auto" style={{ maxWidth: 840 }}>
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center avatar-ring"
              style={{
                width: 64,
                height: 64,
                background:
                  "conic-gradient(from 180deg at 50% 50%, #ede9fe, #fae8ff, #fdf2f8, #ede9fe)",
                color: "var(--bs-primary)",
                fontWeight: 700,
              }}
            >
              {(user?.name || "U").slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-grow-1">
              <h5 className="mb-1 fw-semibold">
                {user?.name || "Your Profile"}
              </h5>
              <div className="text-secondary small">
                {user?.email ? <span>{user.email}</span> : <span>—</span>} · IST
                (GMT+5:30)
              </div>
            </div>

            {/* Desktop actions */}
            <div className="d-none d-sm-flex gap-2">
              <button
                className="btn btn-primary shadow-sm"
                onClick={scrollToBookings}
              >
                My Bookings
              </button>
              <button
                className="btn btn-outline-primary"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile actions */}
          <div className="mt-3 d-sm-none">
            <button
              className="btn btn-primary w-100 shadow-sm"
              onClick={scrollToBookings}
            >
              My Bookings
            </button>
            <button
              className="btn btn-outline-primary w-100 mt-2"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </section>

      {/* Bookings */}
      <section ref={bookingsRef} className="container px-3 pb-5">
        <div className="mx-auto" style={{ maxWidth: 840 }}>
          <div className="d-flex align-items-end justify-content-between mb-3">
            <div>
              <h6 className="fw-semibold mb-1 text-primary">My Bookings</h6>
              <div className="text-secondary small">
                Upcoming sessions and your booking history
              </div>
            </div>
            <button
              className="btn btn-link text-decoration-none"
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="py-4 text-center text-secondary">Loading…</div>
          ) : (
            <>
              {/* Tabs */}
              <ul className="nav nav-pills mb-3" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${
                      activeTab === "upcoming" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("upcoming")}
                    type="button"
                    role="tab"
                  >
                    Upcoming
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${
                      activeTab === "past" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("past")}
                    type="button"
                    role="tab"
                  >
                    Past
                  </button>
                </li>
              </ul>

              {/* Tab content */}
              <div>
                {activeTab === "upcoming" && (
                  <div>
                    {upcoming.length === 0 ? (
                      <EmptyState
                        title="No upcoming bookings"
                        subtitle="Book your next session and it will appear here."
                      />
                    ) : (
                      upcoming.map((b) => <BookingCard key={b._id} item={b} />)
                    )}
                  </div>
                )}
                {activeTab === "past" && (
                  <div>
                    {past.length === 0 ? (
                      <EmptyState
                        title="No past bookings"
                        subtitle="Completed sessions will show here."
                      />
                    ) : (
                      past.map((b) => <BookingCard key={b._id} item={b} />)
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Details Modal */}
      {detailOpen && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h6 className="modal-title fw-semibold text-primary">
                  Booking details
                </h6>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setDetailOpen(false)}
                />
              </div>
              <div className="modal-body">
                {selectedBooking ? (
                  <div className="vstack gap-2">
                    <div className="d-flex justify-content-between">
                      <div className="text-secondary small">Date</div>
                      <div className="fw-medium">{selectedBooking.date}</div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div className="text-secondary small">Time</div>
                      <div className="fw-medium">
                        {selectedBooking.time} · IST
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div className="text-secondary small">Status</div>
                      <div>{statusBadge(selectedBooking.status)}</div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div className="text-secondary small">Booking ID</div>
                      <div
                        className="text-truncate small"
                        style={{ maxWidth: 240 }}
                      >
                        {selectedBooking._id}
                      </div>
                    </div>
                    {selectedBooking.createdAt && (
                      <div className="d-flex justify-content-between">
                        <div className="text-secondary small">Created</div>
                        <div className="small">
                          {new Date(selectedBooking.createdAt).toLocaleString()}
                        </div>
                      </div>
                    )}
                    {selectedBooking.updatedAt && (
                      <div className="d-flex justify-content-between">
                        <div className="text-secondary small">Updated</div>
                        <div className="small">
                          {new Date(selectedBooking.updatedAt).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setDetailOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
