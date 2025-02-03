import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ReservationDetail.css";

const ReservationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [expired, setExpired] = useState(false);
  const [availableTableTime, setAvailableTableTime] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: 1,
  });
  const [reservationData, setReservationData] = useState(null);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        console.log("Fetching reservation data...");
        const response = await axios.get(
          `http://localhost:5050/reservations/${id}`
        );
        console.log("Data received:", response.data);

        if (response.data && response.data.reservation) {
          const reservation = response.data.reservation;
          setReservationData(reservation);
          const reservationDateUTC = new Date(reservation.date);

          // Convert UTC to Bangkok time (GMT+7)
          const reservationDateLocal = new Date(
            reservationDateUTC.getTime() + 7 * 60 * 60 * 1000
          );

          // Format the date correctly as YYYY-MM-DD (Bangkok Time)
          const formattedDate = reservationDateLocal
            .toISOString()
            .split("T")[0];

          if (reservationDateLocal < new Date()) {
            setExpired(true);
            alert("⏳ This reservation has expired.");
          }
          setFormData({
            name: reservation.name,
            email: reservation.email,
            phone: reservation.phone,
            date: formattedDate,
            time: reservation.time,
            guests: reservation.number_of_guests,
          });

          // โหลดโต๊ะว่างสำหรับวันที่จอง
          handleGetAvailabilityTableOnDate(formattedDate);

          setLoading(false);
        } else {
          throw new Error("No reservation data received");
        }
      } catch (error) {
        setNotFound(true);
        console.error("Error fetching reservation:", error);
        alert("Booking information not found.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchReservation();
  }, [id, navigate]);

  // ดึงข้อมูลโต๊ะว่างตามวันที่
  const handleGetAvailabilityTableOnDate = async (date) => {
    try {
      const response = await axios.get(
        `http://localhost:5050/table-availability/${date}`
      );
      setAvailableTableTime(response.data["table-availability"]);
    } catch (error) {
      console.error("Error fetching table availability:", error);
      setAvailableTableTime({
        "16:00": 0,
        "17:00": 0,
        "18:00": 0,
        "19:00": 0,
        "20:00": 0,
        "21:00": 0,
      });
    }
  };

  // ตรวจสอบวันที่
  const handleChangeDate = (e) => {
    const selectedDate = e.target.value;
    if (!selectedDate) return;

    const dayOfWeek = new Date(selectedDate).getDay();
    const today = new Date().toISOString().split("T")[0];

    if (selectedDate < today) {
      alert("ไม่สามารถเลือกวันที่ผ่านมาแล้ว กรุณาเลือกวันอื่น");
      return;
    }

    if (dayOfWeek === 0 || dayOfWeek === 1) {
      alert("ร้านปิดทำการทุกวันอาทิตย์และวันจันทร์ กรุณาเลือกวันอื่น");
      return;
    }

    setFormData({ ...formData, date: selectedDate });
    handleGetAvailabilityTableOnDate(selectedDate);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleUpdate = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        console.log("Updating reservation...");
        await axios.patch(`http://localhost:5050/reservations/${id}`, {
          reservation: {
            date: formData.date,
            time: formData.time,
            number_of_guests: formData.guests,
          },
        });
        alert("Your booking information has been successfully updated!");

        window.location.reload();
        return;
      } catch (error) {
        console.error("Error updating reservation:", error);
        alert("An error occurred. Unable to update your booking information.");
      }
    },
    [id, formData.date, formData.time, formData.guests, navigate]
  );

  const handleDelete = useCallback(async () => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        console.log("Deleting reservation...");
        await axios.delete(`http://localhost:5050/reservations/${id}`);
        alert("Your booking has been successfully canceled.");

        window.location.reload();
        return;
      } catch (error) {
        console.error("Error deleting reservation:", error);
        alert("An error occurred. Unable to cancel your booking.");
      }
    }
  }, [id, navigate]);

  if (loading) {
    return <div className="loading">Loading reservation details...</div>;
  }

  if (notFound) {
    return <div className="not-found">❌ Booking information not found.</div>;
  }

  if (expired) {
    return <div className="expired">⏳ This reservation has expired.</div>;
  }

  return (
    <div id="reservation-detail1">
      <form id="reservation-form1" onSubmit={handleUpdate}>
        <h2>RESERVATIONS</h2>
        <br />

        {/* ❌ ปิดการแก้ไข name, email, phone */}
        <label htmlFor="name">Full Name:</label>
        <input type="text" id="name" value={formData.name} readOnly />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={formData.email} readOnly />

        <label htmlFor="phone">Phone:</label>
        <input type="text" id="phone" value={formData.phone} readOnly />

        {/* ✅ ป้องกันการเลือกวันอาทิตย์ & จันทร์ + วันที่ผ่านมา */}
        <label htmlFor="date">Date (Tue-Sat):</label>
        <input
          type="date"
          id="date"
          value={formData.date}
          onChange={handleChangeDate}
          required
          min={new Date().toISOString().split("T")[0]} // ป้องกันการเลือกวันที่ผ่านมาแล้ว
        />

        {/* ✅ ให้เลือกเฉพาะเวลาที่มีโต๊ะว่าง */}
        <label htmlFor="time">Time (16:00 - 21:00):</label>
        <select
          id="time"
          value={formData.time}
          onChange={handleChange}
          required
        >
          <option value="">--:--</option>
          {Object.entries(availableTableTime)?.map(
            ([time, remaining]) =>
              remaining > 0 && (
                <option key={time} value={time}>
                  {time} ({remaining} table{remaining > 1 ? "s" : ""} available)
                </option>
              )
          )}
        </select>

        <label htmlFor="guests">Number of Guests (Max: 8):</label>
        <input
          type="number"
          id="guests"
          value={formData.guests}
          onChange={handleChange}
          min="1"
          max="8"
          required
        />

        <button type="submit" id="update-button">
          Update Reservation
        </button>
        <button type="button" id="delete-button" onClick={handleDelete}>
          Cancel Reservation
        </button>
      </form>
    </div>
  );
};

export default ReservationDetail;
