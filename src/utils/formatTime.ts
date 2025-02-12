export const formatDateTime = (dateTime: string | Date) => {
  let reservationDateUTC: Date;

  // If dateTime is a string, convert it to a Date object
  if (typeof dateTime === "string") {
    reservationDateUTC = new Date(dateTime);
  } else {
    reservationDateUTC = dateTime;
  }

  // Adjust for UTC to local time (assuming UTC+7)
  const reservationDateLocal = new Date(
    reservationDateUTC.getTime() + 7 * 60 * 60 * 1000
  );

  // Format date as YYYY-MM-DD
  const formattedDate = reservationDateLocal.toISOString().split("T")[0];

  return formattedDate;
};
