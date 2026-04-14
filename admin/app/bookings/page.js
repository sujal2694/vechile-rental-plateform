"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { adminAuthService, bookingService } from "../lib/apiService.js";
import AdminSidebar from "../components/AdminSidebar";

const Bookings = () => {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Check auth
  useEffect(() => {
    const token = adminAuthService.getToken();

    console.log("TOKEN:", token); // DEBUG

    if (!token) {
      router.push("/");
      return;
    }

    setIsAuthenticated(true);
  }, [router]);

  // ✅ Fetch bookings
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await bookingService.getAllBookings();

      console.log("BOOKINGS RESPONSE:", res); // DEBUG

      if (res.success) {
        const data = res.data || [];
        setBookings(data);

        setFilteredBookings(
          statusFilter === "all"
            ? data
            : data.filter((b) => b.status === statusFilter)
        );
      } else {
        setError(res.message || "Failed to fetch bookings");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Error loading bookings.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  // ✅ Fetch after auth
  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated, fetchBookings]);

  // ✅ Filter
  const filterBookings = (status) => {
    setStatusFilter(status);

    if (status === "all") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(
        bookings.filter((b) => b.status === status)
      );
    }
  };

  // ✅ Update status
  const handleStatusChange = async (id, status) => {
    try {
      const res = await bookingService.updateBookingStatus(id, status);

      if (res.success) {
        const updated = bookings.map((b) =>
          b._id === id ? { ...b, status } : b
        );

        setBookings(updated);
        filterBookings(statusFilter);
      } else {
        setError("Failed to update booking status");
      }
    } catch (err) {
      setError("Error updating booking status");
    }
  };

  const handleLogout = () => {
    adminAuthService.logout();
    router.push("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar currentPage="bookings" onLogout={handleLogout} />

      <main className="flex-1 overflow-auto">
        <div className="bg-white shadow-sm p-6">
          <h1 className="text-3xl font-bold">Bookings</h1>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700">
              {error}
              <button onClick={fetchBookings} className="ml-3">
                Retry
              </button>
            </div>
          )}

          {/* Filters */}
          <div className="mb-4 flex gap-2">
            {["all", "pending", "confirmed", "completed", "cancelled"].map(
              (s) => (
                <button
                  key={s}
                  onClick={() => filterBookings(s)}
                  className={`px-3 py-1 rounded ${
                    statusFilter === s
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {s}
                </button>
              )
            )}
          </div>

          {/* Loader */}
          {loading ? (
            <p>Loading...</p>
          ) : filteredBookings.length > 0 ? (
            <table className="w-full bg-white">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Vehicle</th>
                  <th>Dates</th>
                  <th>Cost</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((b) => (
                  <tr key={b._id}>
                    <td>{b._id?.slice(0, 6)}</td>
                    <td>{b.userId?.fullName}</td>
                    <td>{b.vehicleId?.name}</td>
                    <td>
                      {new Date(b.startDate).toLocaleDateString()} -{" "}
                      {new Date(b.endDate).toLocaleDateString()}
                    </td>
                    <td>${b.totalCost}</td>
                    <td>{b.status}</td>
                    <td>
                      <select
                        value={b.status}
                        onChange={(e) =>
                          handleStatusChange(b._id, e.target.value)
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No bookings found</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Bookings;