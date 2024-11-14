import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faWallet } from "@fortawesome/free-solid-svg-icons";
import logo from "../../img/logo-1.png";
import defaultImg from "../../img/image.png";
import "./user.css";

const UserDashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [imagePath, setImagePath] = useState("");
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [punchData, setPunchData] = useState([]);
  const token = sessionStorage.getItem("token");
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: "10px", // Adjust the gap as needed
  };

  const labelStyle = {
    fontWeight: "bold",
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `http://54.175.94.211:8080/admin/user/${userInfo.ID}`
      );
      const data = await response.json();
      setImagePath(data.IMAGE_PATH || defaultImg);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setImagePath(defaultImg);
    }
  };

  useEffect(() => {
    const fetchUserDashboardData = async () => {
      try {
        const response = await axios.get(
          `http://54.175.94.211:8080/customer/dashboard`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserInfo(response.data.info);
        setPaymentDetails(response.data.payment);
      } catch (error) {
        console.error("Error fetching user dashboard data:", error);
      }
    };

    fetchUserDashboardData();
  }, [token]);

  useEffect(() => {
    const fetchPunchData = async () => {
      try {
        const response = await axios.get(
          `http://54.175.94.211:8080/customer/punch`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPunchData(response.data.punch);
      } catch (error) {
        console.error("Error fetching punch data:", error);
      }
    };

    fetchPunchData();
  }, [token]);

  const handleSignOut = () => {
    sessionStorage.removeItem("token");
    window.location.href = "/";
  };

  // Helper function to format time in 12-hour format (e.g., "8:30 AM")
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Helper function to format date in d/m/y format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  // Helper function to calculate duration in minutes
  const calculateDuration = (inTime, outTime) => {
    if (!inTime || !outTime) return "N/A";
    const duration = (new Date(outTime) - new Date(inTime)) / 60000; // duration in minutes
    return `${Math.floor(duration)} minutes`;
  };

  // Function to determine the payment status based on the latest payment
  const getPaymentStatus = () => {
    if (paymentDetails.length === 0) return "No payments";

    // Sort the payments by PAYMENT_DATE in descending order (latest first)
    const sortedPayments = [...paymentDetails].sort(
      (a, b) => new Date(b.PAYMENT_DATE) - new Date(a.PAYMENT_DATE)
    );

    const lastPayment = sortedPayments[0]; // The most recent payment
    return lastPayment.PAYMENT_BALANCE === 0 ? "Paid" : "Unpaid";
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative">
      <div className="absolute inset-0 flex items-center justify-center opacity-50 z-0">
        <img
          src={logo}
          alt="Logo"
          className="sm:w-2/3 sm:h-2/3 w-1/2 h-1/2 object-contain"
          style={{ opacity: 0.3 }}
        />
      </div>
      <header className="py-4 px-5 flex flex-wrap w-full items-center justify-between bg-white shadow relative z-10">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-40 h-10 mr-2" />
          <div className="mx-5">
            <FontAwesomeIcon icon={faWallet} className="text-green-600 mr-2" />
            <span className="text-green-600 font-semibold text-lg flex">
              Punch IN/OUT
            </span>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="bg-custom-green text-white py-2 px-4 rounded"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          Sign Out
        </button>
      </header>
      <div className="p-5 relative z-10">
        {userInfo && (
          <div className="bg-white p-4 rounded-lg shadow-lg mb-6 flex flex-col items-center border-2">
            <div className="flex flex-col items-center mb-4">
              <label className="block font-bold mb-2">Profile Picture:</label>
              <img
                src={imagePath}
                alt="User"
                className="w-32 h-32 rounded-full object-cover"
                onError={(e) => (e.target.src = defaultImg)} // Fallback in case image fails to load
              />
            </div>
            <div style={gridStyle}>
              <div style={labelStyle}>Name:</div>
              <div>{userInfo.NAME}</div>
              <div style={labelStyle}>User ID:</div>
              <div>{userInfo.ID}</div>
              <div style={labelStyle}>Phone:</div>
              <div>{userInfo.PHONE}</div>
              <div style={labelStyle}>Address:</div>
              <div>{userInfo.ADDRESS}</div>
            </div>
            <div
              className={`px-4 py-1 rounded mt-4 ${
                getPaymentStatus() === "Paid" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              <p className="font-sans text-sm text-white">{getPaymentStatus()}</p>
            </div>
          </div>
        )}
        {paymentDetails.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6 overflow-x-auto">
            <h2 className="text-xl font-bold mb-3">Payment Status</h2>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-3 px-6 text-left bg-gray-200">
                    Payment Amount
                  </th>
                  <th className="py-3 px-6 text-left bg-gray-200">
                    Payment Date
                  </th>
                  <th className="py-3 px-6 text-left bg-gray-200">
                    Effective Date
                  </th>
                  <th className="py-3 px-6 text-left bg-gray-200">End Date</th>
                  <th className="py-3 px-6 text-left bg-gray-200">Balance</th>
                </tr>
              </thead>
              <tbody>
                {paymentDetails.map((payment, index) => (
                  <tr key={index}>
                    <td className="py-3 px-6">{payment.PAYMENT_AMOUNT}</td>
                    <td className="py-3 px-6">
                      {new Date(payment.PAYMENT_DATE).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6">
                      {new Date(payment.EFFECTIVE_DATE).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6">
                      {new Date(payment.END_DATE).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6">{payment.PAYMENT_BALANCE}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {punchData.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6 overflow-x-auto">
            <h2 className="text-xl font-bold mb-3">Activity Log</h2>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-3 px-6 text-left bg-gray-200">Date</th>
                  <th className="py-3 px-6 text-left bg-gray-200">Punch In</th>
                  <th className="py-3 px-6 text-left bg-gray-200">Punch Out</th>
                  <th className="py-3 px-6 text-left bg-gray-200">Duration</th>
                </tr>
              </thead>
              <tbody>
                {punchData.map((punch, index) => (
                  <tr key={index}>
                    <td className="py-3 px-6">{formatDate(punch.IN_TIME)}</td>
                    <td className="py-3 px-6">{formatTime(punch.IN_TIME)}</td>
                    <td className="py-3 px-6">
                      {formatTime(punch.OUT_TIME)}
                    </td>
                    <td className="py-3 px-6">
                      {calculateDuration(punch.IN_TIME, punch.OUT_TIME)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
