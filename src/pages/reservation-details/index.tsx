import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/layout/nav/Navbar";
import axios from "axios";
import "./style.css";
import {
  IReservation,
  ReservationStatus,
} from "../../abstractions/IReservation";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ReservationDetail = () => {
  const { id, token } = useParams();
  const reservationKey = token || id;

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
  const [originalData, setOriginalData] = useState<any>(null);
  const [currentReservation, setCurrentReservation] = useState<IReservation>();

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const url = token
          ? `${API_BASE_URL}/reservations/token/${token}`
          : `${API_BASE_URL}/reservations/${id}`;

        const response = await axios.get(url);

        if (response.data && response.data.reservation) {
          const reservation = response.data.reservation;
          setOriginalData({
            name: reservation.name,
            email: reservation.email,
            phone: reservation.phone,
            date: new Date(reservation.date).toLocaleDateString("en-CA"),
            time: reservation.time,
            guests: reservation.number_of_guests,
          });

          const formattedDate = new Date(reservation.date).toLocaleDateString(
            "en-CA"
          );

          setFormData({
            name: reservation.name,
            email: reservation.email,
            phone: reservation.phone,
            date: formattedDate,
            time: reservation.time,
            guests: reservation.number_of_guests,
          });

          setCurrentReservation(reservation);

          await handleGetAvailabilityTableOnDate(formattedDate);
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

    if (reservationKey) fetchReservation();
  }, [id, token, reservationKey]);

  const handleGetAvailabilityTableOnDate = async (date: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/table-availability/${date}`
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

  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === "date") {
      const selectedDate = value;
      if (!selectedDate) return;

      const selectedDay = new Date(selectedDate).getDay();
      if (selectedDay === 0 || selectedDay === 1) {
        alert(
          "Chilli and Garlic is closed on Sundays and Mondays. Please choose another day."
        );
        return;
      }
    }

    setFormData({ ...formData, date: value });
    handleGetAvailabilityTableOnDate(value);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: id === "guests" ? Number(value) : value,
    }));
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  const handleUpdate = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const isAdmin = !!localStorage.getItem("isAuthenticated");

      if (!hasChanges) return;

      if (!isAdmin && formData.guests > 8) {
        const cateringConfirm = window.confirm(
          "Sorry, we have a limited number of guests. Are you interesting in trying our catering service?"
        );
        if (cateringConfirm) {
          window.location.href = "https://rostock.catering/";
          return;
        } else {
          return;
        }
      }

      const confirmation = window.confirm(
        `Please confirm the updated reservation details:\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nDate: ${formData.date}\nTime: ${formData.time}\nGuests: ${formData.guests}`
      );

      if (!confirmation) return;

      try {
        if (!currentReservation?.id) {
          alert("Reservation not found.");
          return;
        }

        await axios.patch(`${API_BASE_URL}/reservations/${currentReservation.id}`, {
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
    [currentReservation?.id, formData, hasChanges]
  );

  const isReservationCanceled = (): boolean =>
    currentReservation?.status === ReservationStatus.CANCELLED;

  const handleCancel = useCallback(async () => {
    const confirmation = window.confirm(
      `Are you sure you want to cancel this booking?\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nDate: ${formData.date}\nTime: ${formData.time}\nGuests: ${formData.guests}`
    );

    if (!confirmation) return;

    try {
      if (!currentReservation?.id) {
        alert("Reservation not found.");
        return;
      }

      await axios.put(
        `${API_BASE_URL}/reservations/${currentReservation.id}/cancel`,
        undefined,
        { withCredentials: true }
      );
      alert("Your booking has been successfully canceled.");
      window.location.assign("/");
    } catch (error) {
      console.error("Error deleting reservation:", error);
      alert("An error occurred. Unable to cancel your booking.");
    }
  }, [currentReservation?.id, formData]);

  if (loading)
    return <div className="loading">Loading reservation details...</div>;
  if (notFound)
    return <div className="not-found">❌ Booking information not found.</div>;
  if (expired)
    return <div className="expired">⏳ This reservation has expired.</div>;

  const todayString = new Date().toLocaleDateString("en-CA");

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
            onChange={handleChangeDate}
            required
            min={todayString}
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
            {Object.entries(availableTableTime)?.map(([time, remaining]) => {
              if (remaining > 0) {
                let isDisabled = false;

                if (formData.date === todayString) {
                  const optionDateTime = new Date(`${formData.date}T${time}`);
                  const fourHoursLater = new Date(
                    Date.now() + 4 * 60 * 60 * 1000
                  );
                  if (optionDateTime < fourHoursLater) {
                    isDisabled = true;
                  }
                }

                return (
                  <option key={time} value={time} disabled={isDisabled}>
                    {time} ({remaining} table{remaining > 1 ? "s" : ""}{" "}
                    available)
                  </option>
                );
              }
              return null;
            })}
          </select>

          <label htmlFor="guests">Number of Guests (Max: 8):</label>
          <input
            readOnly={isReservationCanceled()}
            type="number"
            id="guests"
            value={formData.guests}
            onChange={handleChange}
            min="1"
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