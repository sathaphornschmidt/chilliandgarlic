import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css";
import { formatDateTime } from "../../utils/formatTime";

interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  number_of_guests: number;
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
      setReservations(response.data.reservations || response.data);
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

  const isPastReservation = (date: string, time: string) => {
    const reservationDateTime = new Date(`${date}T${time}`);
    return reservationDateTime < new Date();
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
    } catch (error) {}
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
                const confirmed = isPastReservation(res.date, res.time);
                return (
                  <tr key={res.id}>
                    <td>{res.name}</td>
                    <td>{res.email}</td>
                    <td>{res.phone}</td>
                    <td>{formatDateTime(res.date)}</td>
                    <td>{res.time}</td>
                    <td>{res.number_of_guests}</td>
                    <td>{confirmed ? "Confirmed" : res.status || "Active"}</td>
                    <td className="action-buttons">
                      {!confirmed && (
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(res.id)}
                        >
                          Edit
                        </button>
                      )}
                      {!confirmed && (
                        <button
                          className="cancel-button"
                          onClick={() => handleCancel(res.id)}
                        >
                          Cancel
                        </button>
                      )}
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
