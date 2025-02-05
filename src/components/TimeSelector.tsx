import React, { useState, useEffect } from "react";

const TimeSelector = ({ date }) => {
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    const slots = [
      "16:00", "16:30", "17:00", "17:30",
      "18:00", "18:30", "19:00", "19:30",
      "20:00", "20:30", "21:00"
    ];
    setTimeSlots(slots);
  }, [date]);

  return (
    <div>
      <label>Select Time:</label>
      <select>
        {timeSlots.map((time, index) => (
          <option key={index} value={time}>{time}</option>
        ))}
      </select>
    </div>
  );
};

export default TimeSelector;