import React, { useState } from "react";
import "./style.css"; // Import your CSS file
import axios from "axios";

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: 1,
    agreeToPDPA: false, // PDPA consent state
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value, // Handle checkbox for PDPA
    });
  };

  const handleChangeDate = (e) => {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    const day = selectedDate.getDay();

    // Validation: Check PDPA consent
    if (!formData.agreeToPDPA) {
      alert(
        "You must agree to the Privacy Policy before submitting your reservation."
      );
      return;
    }

    // Validation: Check date
    if (selectedDate < today) {
      alert(
        "You cannot select a past date. Please choose today's date or later."
      );
      return;
    }
    if (day === 0 || day === 1) {
      alert(
        "We are closed on Sundays and Mondays. Please choose another date."
      );
      return;
    }

    // API Call
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

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      guests: 1,
      agreeToPDPA: false, // Reset PDPA checkbox
    });
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
          min={new Date().toISOString().split("T")[0]}
        />

        <div className="form-group">
          <label htmlFor="time">Time (16:00 - 21:00):</label>
          <select
            id="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="form-input"
          >
            <option value="">--:--</option>
            <option value="16:00">16:00</option>
            <option value="16:30">16:30</option>
            <option value="17:00">17:00</option>
            <option value="17:30">17:30</option>
            <option value="18:00">18:00</option>
            <option value="18:30">18:30</option>
            <option value="19:00">19:00</option>
            <option value="19:30">19:30</option>
            <option value="20:00">20:00</option>
            <option value="20:30">20:30</option>
            <option value="21:00">21:00</option>
          </select>
        </div>

        <label htmlFor="guests">Number of Guests (Max: 8):</label>
        <input
          type="number"
          id="guests"
          value={formData.guests}
          onChange={handleChange}
          required
          min="1"
          max="8"
        />

        {/* PDPA Consent */}
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
            I agree to the{" "}
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>{" "}
            and terms of data usage.
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
