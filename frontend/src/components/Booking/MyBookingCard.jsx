// src/components/Booking/MyBookingCard.jsx
import React from "react";

const MyBookingCard = ({ booking }) => {
  // booking fields based on your Booking model:
  // { userId, userEmail, tourName, fullName, phone, guestSize, bookAt, createdAt, ... }
  const { tourName, fullName, phone, guestSize, bookAt, createdAt } = booking;

  return (
    <div style={{
      border: "1px solid #e6e6e6",
      padding: "16px",
      marginBottom: "12px",
      borderRadius: "8px",
      background: "#fff",
      boxShadow: "0 1px 4px rgba(0,0,0,0.03)"
    }}>
      <h5 style={{ margin: 0 }}>{tourName}</h5>
      <div style={{ fontSize: 13, color: "#666", marginTop: 6 }}>
        Booked by: <strong>{fullName}</strong> • Phone: {phone}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
        <div>
          <div style={{ fontSize: 13, color: "#666" }}>Guests</div>
          <div style={{ fontWeight: 600 }}>{guestSize}</div>
        </div>
        <div>
          <div style={{ fontSize: 13, color: "#666" }}>Travel date</div>
          <div style={{ fontWeight: 600 }}>{bookAt ? new Date(bookAt).toLocaleDateString() : "-"}</div>
        </div>
        <div>
          <div style={{ fontSize: 13, color: "#666" }}>Booked on</div>
          <div style={{ fontWeight: 600 }}>{createdAt ? new Date(createdAt).toLocaleString() : "-"}</div>
        </div>
      </div>
    </div>
  );
};

export default MyBookingCard;
