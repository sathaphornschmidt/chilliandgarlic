import React, { useState } from "react";
import "./style.css"; // Import your CSS file

const ReservationForm = () => {
  // State Variables
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: 1,
  });

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // Handle Input Changes
  const handleChange = (e) => {
    const { id, value } = e.target; 
    
    setFormData({ ...formData, [id]: value });
  };

  const handleChangeDate = (e) => {
    const { id, value } = e.target; 

    if (id === "date") {
      const selectedDate = value;
      if (!selectedDate) return; // ถ้ายังไม่ได้เลือกวันที่ไม่ต้องทำอะไร

      const selectedDay = new Date(selectedDate).getDay(); // 0 = Sunday, 1 = Monday, 2-6 = Tuesday to Saturday
      if (selectedDay === 0 || selectedDay === 1) {
          alert("Chilli and Garlic is Close on Sunday - Monday Please choose another day");
          dateInput.value = ""; // เคลียร์วันที่ที่เลือก
      }
    }

    setFormData({ ...formData, "date": value });
  }

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    const day = selectedDate.getDay();

    // Validation
    if (selectedDate < today) {
      setAlertMessage("You cannot select a past date. Please choose today's date or later.");
      setShowAlert(true);
      return;
    }
    if (day === 0 || day === 1) {
      setAlertMessage("We are closed on Sundays and Mondays. Please choose another date.");
      setShowAlert(true);
      return;
    }

    // Success
    setAlertMessage("Your reservation has been submitted successfully!");
    setShowAlert(true);

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      guests: 1,
    });
  };

  return (
    <div id="reservation">
      {/* Reservation Form */}
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
          min={new Date().toISOString().split("T")[0]} // Prevent past dates
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
            <option value="16:00">16:30</option>
            <option value="17:00">17:00</option>
            <option value="16:00">17:30</option>
            <option value="18:00">18:00</option>
            <option value="16:00">18:30</option>
            <option value="19:00">19:00</option>
            <option value="16:00">19:30</option>
            <option value="20:00">20:00</option>
            <option value="16:00">20:30</option>
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

        <button type="submit" id="submit-button">Book Now</button>
      </form>

      {/* Alert Box */}
      {showAlert && (
        <div id="alert-box" className="alert-box">
          <p>{alertMessage}</p>
          <button onClick={() => setShowAlert(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ReservationForm;