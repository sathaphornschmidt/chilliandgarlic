import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css";
import { formatDateTime } from "../../utils/formatTime";
import { ReservationStatus } from "../../abstractions/IReservation";

interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  number_of_guests: number;
  created_at: Date;
  updated_at: Date;
  canceled_at: Date;
  canceled_by: string;
  status: string;
}

const AdminDashboard: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchName, setSearchName] = useState<string>("");
  const [searchDate, setSearchDate] = useState<string>("");
  const [isSortedByTime, setIsSortedByTime] = useState<boolean>(false);
  const [isSortedByDate, setIsSortedByDate] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage] = useState<number>(5);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get("http://localhost:5050/reservations", {
        withCredentials: true,
      });
      // Sorting reservations ตาม created_at หรือ canceled_at ตามที่ต้องการ
      const sortedReservations = response.data.reservations || response.data;
      sortedReservations.sort((a: Reservation, b: Reservation) => {
        return (
          new Date(b.canceled_at).getTime() - new Date(a.created_at).getTime()
        );
      });
      setReservations(sortedReservations);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    const reservation = reservations.find((res) => res.id === id);
    if (reservation) {
      const confirmCancel = window.confirm(
        `Are you sure you want to cancel this reservation?\n\nName: ${
          reservation.name
        }\nEmail: ${reservation.email}\nPhone: ${
          reservation.phone
        }\nDate: ${formatDateTime(reservation.date)}\nTime: ${
          reservation.time
        }\nGuests: ${reservation.number_of_guests}`
      );
      if (confirmCancel) {
        try {
          await axios.put(
            `http://localhost:5050/reservations/${id}/cancel`,
            undefined,
            { withCredentials: true }
          );
          await fetchReservations();
        } catch (error) {
          console.error("Error canceling reservation:", error);
          alert("Unable to cancel the reservation.");
        }
      }
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/reservations/${id}`);
  };

  const handleSearchName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(e.target.value);
  };

  const handleSearchDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchDate(e.target.value);
  };

  const handleSortByTime = () => {
    setIsSortedByTime((prev) => !prev);
  };

  const handleSortByDate = () => {
    setIsSortedByDate((prev) => !prev);
  };

  // ถ้า time อยู่ในรูปแบบ "HH:mm" ให้เติม ":00" เพื่อให้เป็น "HH:mm:ss"
  const formatTime = (time: string) => {
    return time.split(":").length === 2 ? `${time}:00` : time;
  };

  // ฟังก์ชันตรวจสอบว่าเวลาการจองผ่านไปแล้วหรือไม่ (Expired)
  const isPastReservation = (date: string, time: string) => {
    const reservationTime = formatTime(time);
    const reservationDate = date.split("T")[0];
    const reservationDateTimeString = `${reservationDate}T${reservationTime}`;
    const reservationDateTime = new Date(reservationDateTimeString);
    const now = new Date();
    return reservationDateTime < now;
  };

  const filteredReservations = reservations
    .filter(
      (res) =>
        res.name.toLowerCase().includes(searchName.toLowerCase()) &&
        formatDateTime(res.date).includes(searchDate)
    )
    .sort((a, b) => {
      if (isSortedByDate) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (isSortedByTime && a.date === b.date) {
        return a.time.localeCompare(b.time);
      }
      return 0;
    });

  const indexOfLastReservation = currentPage * rowsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - rowsPerPage;
  const currentReservations = filteredReservations.slice(
    indexOfFirstReservation,
    indexOfLastReservation
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) return <div className="loading">Loading data...</div>;

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5050/auth/logout", undefined, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    navigate("/login");
  };

  return (
    <div id="admin-dashboard">
      <div id="dashboard-container">
        <div className="dashboard-header">
          <h2>📊 All Reservations</h2>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchName}
            onChange={handleSearchName}
            className="search-input"
          />
          <input
            type="date"
            placeholder="Search by Date"
            value={searchDate}
            onChange={handleSearchDate}
            className="search-input"
          />
          <button onClick={handleSortByTime} className="sort-button">
            {isSortedByTime ? "Unsort Time" : "Sort by Time"}
          </button>
          <button onClick={handleSortByDate} className="sort-button">
            {isSortedByDate ? "Unsort Date" : "Sort by Date"}
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Date</th>
              <th>Time</th>
              <th>Guests</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentReservations.length > 0 ? (
              currentReservations.map((res) => {
                // ตรวจสอบว่าการจองหมดอายุ (Expired) หรือไม่
                const isExpired = isPastReservation(res.date, res.time);
                // แปลงค่า canceled_by เป็นตัวพิมพ์เล็ก ถ้าเป็น null จะได้ ""
                const canceledByLower = res.canceled_by?.toLowerCase() || "";
                // ตรวจสอบว่าการจองถูก Cancel และถูกยกเลิกโดย customer หรือ satha
                const isCanceledNonEditable =
                  res.status === "canceled" &&
                  (canceledByLower === "customer" ||
                    canceledByLower === "satha");

                // กำหนดคลาสให้กับแถว:
                // ถ้า Cancelled ให้ใช้ "disabled-row" (สีแดง)
                // ถ้า Expired (แต่ไม่ Cancelled) ให้ใช้ "expired-row" (สีดำ)
                const rowClass = isCanceledNonEditable
                  ? "disabled-row"
                  : isExpired
                  ? "expired-row"
                  : "";

                return (
                  <tr key={res.id} className={rowClass}>
                    <td>{res.name}</td>
                    <td>{res.email}</td>
                    <td>{res.phone}</td>
                    <td>{formatDateTime(res.date)}</td>
                    <td>{res.time}</td>
                    <td>{res.number_of_guests}</td>
                    <td
                      title={
                        isCanceledNonEditable
                          ? `This order was canceled by ${
                              res.canceled_by
                            } at ${formatDateTime(res.canceled_at)}`
                          : ""
                      }
                    >
                      {isCanceledNonEditable
                        ? `Canceled by ${res.canceled_by}`
                        : isExpired
                        ? "Expired"
                        : res.status === "booked"
                        ? "Booked"
                        : res.status || "Active"}
                    </td>
                    <td className="action-buttons">
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(res.id)}
                        disabled={isExpired || isCanceledNonEditable}
                      >
                        Edit
                      </button>
                      <button
                        className="cancel-button"
                        onClick={() => handleCancel(res.id)}
                        disabled={isExpired || isCanceledNonEditable}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="no-data">
                  No reservation data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="pagination">
          {Array.from(
            { length: Math.ceil(filteredReservations.length / rowsPerPage) },
            (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className="pagination-button"
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
