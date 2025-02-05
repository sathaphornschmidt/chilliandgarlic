import React from "react";

const AlertBox = ({ message, type }) => {
  if (!message) return null;
  return (
    <div className={`alert ${type}`}>
      {message}
    </div>
  );
};

export default AlertBox;