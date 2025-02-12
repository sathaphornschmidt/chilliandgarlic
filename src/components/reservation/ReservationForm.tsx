import React, { useState } from "react";
import "./style.css";
import axios from "axios";

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    confirmEmail: "",
    phone: "",
    date: "",
    time: "",
    guests: 1,
    agreeToPDPA: false,
  });

  const [availableTableTime, setAvailableTableTime] = useState({
    "16:00": 0,
    "17:00": 0,
    "18:00": 0,
    "19:00": 0,
    "20:00": 0,
    "21:00": 0,
  });

  const handleChange = (e: any) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value,
    });
  };

  const handleChangeDate = (e: any) => {
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (formData.guests > 8) {
      const cateringConfirm = window.confirm(
        "Sorry, we have a limited number of guests. Are you interested in trying our catering service?"
      );
      if (cateringConfirm) {
        window.location.href = "https://rostock.catering/";
        return;
      } else {
        return;
      }
    }

    if (formData.email !== formData.confirmEmail) {
      alert("Email and Confirm Email do not match!");
      return;
    }

    const confirmation = window.confirm(
      `Please confirm your reservation details:\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nDate: ${formData.date}\nTime: ${formData.time}\nGuests: ${formData.guests}`
    );

    if (!confirmation) return;

    try {
      const response = await axios.post("http://localhost:5050/reservations", {
        reservation: {
          name: formData.name,
          email: formData.email,
          country_code: "66",
          phone: formData.phone,
          date: formData.date,
          time: formData.time,
          number_of_guests: formData.guests,
        },
      });

      alert("Your reservation has been submitted successfully!");
      console.log(response.data);
    } catch (error) {
      alert("Failed to submit your reservation. Please try again.");
      console.error(error);
    }

    setFormData({
      name: "",
      email: "",
      confirmEmail: "",
      phone: "",
      date: "",
      time: "",
      guests: 1,
      agreeToPDPA: false,
    });
  };

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

  return (
    <div id="reservation">
      <form id="reservation-form" onSubmit={handleSubmit}>
        <h2>RESERVATIONS</h2>
        <br />

        <label htmlFor="name">Full Name:</label>
        <input
          type="text"
          id="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="confirmEmail">Confirm Email:</label>
        <input
          type="email"
          id="confirmEmail"
          placeholder="Confirm Your Email"
          value={formData.confirmEmail}
          onChange={handleChange}
          required
        />

        <label htmlFor="phone">Phone:</label>
        <input
          type="text"
          id="phone"
          placeholder="Your Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <label htmlFor="date">Date (Tue-Sat):</label>
        <input
          type="date"
          id="date"
          value={formData.date}
          onChange={handleChangeDate}
          required
          min={
            new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
              .toISOString()
              .split("T")[0]
          }
        />

        <div className="form-group">
          <label htmlFor="time">Time (16:00 - 21:00):</label>
          <select
            id="time"
            value={formData.time}
            onChange={handleChange}
            disabled={!formData.date}
            required
            className="form-input"
          >
            <option value="">--:--</option>
            {Object.entries(availableTableTime)?.map(
              ([time, remaining]) =>
                remaining > 0 && (
                  <option key={time} value={time}>
                    {time} ({remaining} table{remaining > 1 ? "s" : ""}{" "}
                    available)
                  </option>
                )
            )}
          </select>
        </div>

        <label htmlFor="guests">Number of Guests (max.8):</label>
        <input
          type="number"
          id="guests"
          value={formData.guests}
          onChange={handleChange}
          required
          min="1"
        />

        <div className="form-group checkbox-inline">
          <input
            type="checkbox"
            id="agreeToPDPA"
            checked={formData.agreeToPDPA}
            onChange={handleChange}
            style={{
              width: "fit-content",
              paddingBottom: "0px",
              margin: "0px",
            }}
          />
          <label htmlFor="agreeToPDPA">
            I agree to the &nbsp;
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
            &nbsp; and terms of data usage.
          </label>
        </div>

        <button type="submit" id="submit-button">
          Book Now
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;
