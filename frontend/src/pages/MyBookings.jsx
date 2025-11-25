// src/pages/MyBookings.jsx
import React, { useEffect, useState, useContext } from "react";
import { Container } from "reactstrap";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";
import MyBookingCard from "../components/Booking/MyBookingCard";

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/booking/user`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // important to send cookie with token
        });

        const text = await res.text();
        let data = null;
        try { data = JSON.parse(text); } catch (e) { data = null; }

        if (!res.ok) {
          const msg = data?.message || text || `Status ${res.status}`;
          throw new Error(msg);
        }

        setBookings(data?.data || []);
      } catch (err) {
        console.error("MyBookings fetch error:", err);
        setError(err.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  return (
    <Container style={{ padding: "24px 0" }}>
      <h2>My Bookings</h2>
      {loading && <p>Loading your bookings...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && bookings.length === 0 && <p>You have no bookings yet.</p>}
      {!loading && bookings.length > 0 && (
        <div style={{ marginTop: 12 }}>
          {bookings.map((b) => (
            <MyBookingCard key={b._id} booking={b} />
          ))}
        </div>
      )}
    </Container>
  );
};

export default MyBookings;
