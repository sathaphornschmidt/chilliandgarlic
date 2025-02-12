import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/nav/Navbar";
import axios from "axios";
import "./style.css"; // Ensure the CSS file is imported
import { formatDateTime } from "../../utils/formatTime";
import {
  IReservation,
  ReservationStatus,
} from "../../abstractions/IReservation";

const ReservationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [expired, setExpired] = useState(false);
  const [availableTableTime, setAvailableTableTime] = useState({
    "16:00": 0,
    "17:00": 0,
    "18:00": 0,
    "19:00": 0,
    "20:00": 0,
    "21:00": 0,
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: 1,
  });
  const [originalData, setOriginalData] = useState(null);
  const [currentReservation, setCurrentReservation] = useState<IReservation>();

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5050/reservations/${id}`
        );

        if (response.data && response.data.reservation) {
          const reservation = response.data.reservation;
          setOriginalData(reservation);

          const formattedDate = formatDateTime(reservation.date);

          setFormData({
            name: reservation.name,
            email: reservation.email,
            phone: reservation.phone,
            date: formattedDate,
            time: reservation.time,
            guests: reservation.number_of_guests,
          });

          setCurrentReservation(reservation);

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

  const handleGetAvailabilityTableOnDate = async (date: string) => {
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

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  const handleUpdate = useCallback(
    async (e: any) => {
      e.preventDefault();
      if (!hasChanges) return;

      const confirmation = window.confirm(
        `Please confirm the updated reservation details:\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nDate: ${formData.date}\nTime: ${formData.time}\nGuests: ${formData.guests}`
      );

      if (!confirmation) return;

      try {
        await axios.patch(`http://localhost:5050/reservations/${id}`, {
          reservation: {
            date: formData.date,
            time: formData.time,
            number_of_guests: formData.guests,
          },
        });
        alert("Your booking information has been successfully updated!");
        window.location.reload();
      } catch (error) {
        console.error("Error updating reservation:", error);
        alert("An error occurred. Unable to update your booking information.");
      }
    },
    [id, formData, hasChanges]
  );

  const isReservationCanceled = (): boolean =>
    currentReservation?.status === ReservationStatus.CANCELLED;

  const handleCancel = useCallback(async () => {
    const confirmation = window.confirm(
      `Are you sure you want to cancel this booking?\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nDate: ${formData.date}\nTime: ${formData.time}\nGuests: ${formData.guests}`
    );

    if (!confirmation) return;

    try {
      await axios.put(
        `http://localhost:5050/reservations/${id}/cancel`,
        undefined,
        { withCredentials: true }
      );
      alert("Your booking has been successfully canceled.");
      window.location.assign("/");
    } catch (error) {
      console.error("Error deleting reservation:", error);
      alert("An error occurred. Unable to cancel your booking.");
    }
  }, [id, formData]);

  if (loading)
    return <div className="loading">Loading reservation details...</div>;
  if (notFound)
    return <div className="not-found">❌ Booking information not found.</div>;
  if (expired)
    return <div className="expired">⏳ This reservation has expired.</div>;

  return (
    <>
      <Navbar />
      <div id="reservation-detail1">
        <form id="reservation-form1" onSubmit={handleUpdate}>
          <h2>RESERVATIONS</h2>

          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            readOnly
            className="readonly-input"
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            readOnly
            className="readonly-input"
          />

          <label htmlFor="phone">Phone:</label>
          <input
            type="text"
            id="phone"
            disabled={isReservationCanceled()}
            value={formData.phone}
            readOnly
            className="readonly-input"
          />

          <label htmlFor="date">Date (Tue-Sat):</label>
          <input
            type="date"
            id="date"
            readOnly={isReservationCanceled()}
            value={formData.date}
            onChange={handleChange}
            required
          />

          <label htmlFor="time">Time (16:00 - 21:00):</label>
          <select
            id="time"
            disabled={isReservationCanceled()}
            value={formData.time}
            onChange={handleChange}
            required
          >
            <option value="">--:--</option>
            {Object.entries(availableTableTime)?.map(([time, remaining]) =>
              remaining > 0 ? (
                <option key={time} value={time}>
                  {time} ({remaining} table{remaining > 1 ? "s" : ""} available)
                </option>
              ) : null
            )}
          </select>

          <label htmlFor="guests">Number of Guests (Max: 8):</label>
          <input
            readOnly={isReservationCanceled()}
            type="number"
            id="guests"
            value={formData.guests}
            onChange={handleChange}
            min="1"
            max="8"
            required
          />

          <button
            type="submit"
            id="update-button"
            disabled={!hasChanges || isReservationCanceled()}
          >
            Update Reservation
          </button>
          <button
            type="button"
            disabled={isReservationCanceled()}
            id="delete-button"
            onClick={handleCancel}
          >
            Cancel Reservation
          </button>
        </form>
      </div>
    </>
  );
};

export default ReservationDetail;
