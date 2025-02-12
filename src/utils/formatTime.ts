export const formatDateTime = (dateTime: string) => {
  const reservationDateUTC = new Date(dateTime);
  const reservationDateLocal = new Date(
    reservationDateUTC.getTime() + 7 * 60 * 60 * 1000
  );
  const formattedDate = reservationDateLocal.toISOString().split("T")[0];

  return formattedDate;
};
