import React, { useState } from "react";

const DateSelector = ({ onDateChange }) => {
  const [date, setDate] = useState("");

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const day = new Date(selectedDate).getDay();
    if (day === 0 || day === 1) {
      alert("Restaurant is closed on Sundays and Mondays.");
      setDate("");
      return;
    }
    setDate(selectedDate);
    onDateChange(selectedDate);
  };

  return (
    <div>
      <label>Select Date:</label>
      <input
        type="date"
        value={date}
        onChange={handleDateChange}
        min={new Date().toISOString().split("T")[0]}
      />
    </div>
  );
};

export default DateSelector;