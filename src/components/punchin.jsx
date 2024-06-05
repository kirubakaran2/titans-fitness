import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "./Home/img/logo-1.png";
const Punchin = () => {
  const [searchId, setSearchId] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [punchTimes, setPunchTimes] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState([]);

  const handleSearchChange = (event) => {
    setSearchId(event.target.value);
  };

  const handleSearchSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const userDetailsResponse = await axios.get(
        `https://gym-backend-apis.onrender.com/admin/user/searching?name={{userName}}&dob={{dob}}&mobile={{mobile}}&userID=${searchId}`,
        { headers }
      );
      setUserDetails(userDetailsResponse.data);

      const punchInTimesResponse = await axios.get(
        `https://gym-backend-apis.onrender.com/admin/punch/in?userId=${searchId}`,
        { headers }
      );
      const punchOutTimesResponse = await axios.get(
        `https://gym-backend-apis.onrender.com/admin/punch/out?userId=${searchId}`,
        { headers }
      );
      const punchTimesData = {
        IN_TIME: punchInTimesResponse.data.timing.IN_TIME,
        OUT_TIME: punchOutTimesResponse.data.timing.OUT_TIME,
      };
      setPunchTimes(punchTimesData);

      const paymentDetailsResponse = await axios.get(
        `https://gym-backend-apis.onrender.com/admin/payment/${searchId}`,
        { headers }
      );
      setPaymentDetails(paymentDetailsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handlePunchIn = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      await axios.post(
        `https://gym-backend-apis.onrender.com/admin/time/in`,
        { id: searchId },
        { headers }
      );
      toast.success("Checked in successfully!");
      handleSearchSubmit();
    } catch (error) {
      toast.error("Error punching in");
      console.error("Error punching in:", error);
    }
  };

  const handlePunchOut = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      await axios.post(
        `https://gym-backend-apis.onrender.com/admin/time/out`,
        { id: searchId },
        { headers }
      );
      toast.success("Checked out successfully!");
      handleSearchSubmit();
    } catch (error) {
      toast.error("Error punching out");
      console.error("Error punching out:", error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "=") {
        handlePunchIn();
      } else if (event.ctrlKey && event.key === "-") {
        handlePunchOut();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer />
      <div className="absolute inset-0 flex items-center justify-center opacity-50 z-0">
        <img
          src={logo}
          alt="Logo"
          className="w-1/2 h-1/2 object-contain"
          style={{ opacity: 0.3 }}
        />
      </div>
      <div className="fixed bottom-0 left-0 mb-1 ml-4 z-10">
        <ul className="flex">
          <li className="hover:text-70AB0E-800 px-1">
            <a
              href="/"
              className="block flex items-center"
              onClick={handleSignOut}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-lg" />
              <span className="text-sm">Sign Out</span>
            </a>
          </li>
        </ul>
      </div>
      <div className="fixed bottom-0 right-0 mb-1 pr-4">
        <ul className="flex">
          <span className="text-sm">The Titans Fitness Studio -UniSex</span>
        </ul>
      </div>
      <div className="relative z-10">
        <header className="py-4 px-5 flex items-center justify-between bg-custom-green">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="w-50 h-10 mr-2" />
            <span className="text-white text-2xl font-semibold">
              Customer Time Punch IN/OUT
            </span>
          </div>
        </header>
        <div className="flex mt-10">
          <div className="w-1/2 bg-white p-6 rounded-lg shadow-lg mr-6">
            <div className="mb-4">
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter Customer ID"
                value={searchId}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex justify-between">
              <button
                className="bg-custom-green text-white px-4 py-2 rounded-lg"
                onClick={handleSearchSubmit}
              >
                Search
              </button>
              <button
                className="bg-custom-green text-white px-4 py-2 rounded-lg"
                onClick={handlePunchIn}
              >
                Check-In
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={handlePunchOut}
              >
                Check-Out
              </button>
            </div>
            {/* Render user details */}
            {userDetails && (
              <div className="mt-6 mb-3">
                <h2 className="text-xl font-bold">User Information</h2>
                <div className="flex flex-col items-start">
                  <div className="w-full mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                      <div>
                        <label className="block font-bold">Name</label>
                        <input
                          type="text"
                          value={userDetails.user.NAME}
                          className="w-full border rounded px-2 py-1"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block font-bold">Mobile Number</label>
                        <input
                          type="text"
                          value={userDetails.user.PHONE}
                          className="w-full border rounded px-2 py-1"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block font-bold">Email</label>
                        <input
                          type="text"
                          value={userDetails.user.EMAIL}
                          className="w-full border rounded px-2 py-1"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block font-bold">DOB</label>
                        <input
                          type="text"
                          value={
                            userDetails.user.DOB &&
                            userDetails.user.DOB.slice(0, 10)
                          }
                          className="w-full border rounded px-2 py-1"
                          readOnly
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block font-bold">Address</label>
                        <input
                          type="text"
                          value={userDetails.user.ADDRESS}
                          className="w-full border rounded px-2 py-1"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Render payment details and punch times */}

          <div className="w-1/2">
            {/* Render payment details */}
            {userDetails &&
              userDetails.user &&
              paymentDetails.payment &&
              paymentDetails.payment.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow-lg mb-6 flex items-center justify-between border-2">
                  <div className="flex items-center">
                    <div className="mr-4">
                      <label className="block font-bold">
                        Profile Picture:
                      </label>
                      <img
                        src={userDetails.user.IMAGE_PATH}
                        alt="Profile"
                        className="w-32 h-32"
                      />
                    </div>
                    <div>
                      <p className="font-bold">Name:</p>
                      <p>{userDetails.user.NAME}</p>
                      <p className="font-bold">User ID:</p>
                      <p>{userDetails.user.ID}</p>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-1 rounded ${
                      paymentDetails.payment[0].PAYMENT_BALANCE === 0
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    <p className="font-sans text-sm text-white">
                      {paymentDetails.payment.every(
                        (payment) => payment.PAYMENT_BALANCE === 0
                      )
                        ? "Paid"
                        : "Unpaid"}{" "}
                    </p>
                  </div>
                </div>
              )}

            {paymentDetails &&
              paymentDetails.payment &&
              paymentDetails.payment.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
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
                        <th className="py-3 px-6 text-left bg-gray-200">
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentDetails.payment.map((payment, index) => (
                        <tr key={index}>
                          <td className="py-3 px-6">
                            {payment.PAYMENT_AMOUNT}
                          </td>
                          <td className="py-3 px-6">
                            {new Date(
                              payment.PAYMENT_DATE
                            ).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-6">
                            {new Date(
                              payment.EFFECTIVE_DATE
                            ).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-6">
                            {payment.PAYMENT_BALANCE}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            {userDetails && (
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-3">Today's Activities</h2>
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-3 px-6 text-left bg-gray-200">
                        In Time
                      </th>
                      <th className="py-3 px-6 text-left bg-gray-200">
                        Out Time
                      </th>
                      <th className="py-3 px-6 text-left bg-gray-200">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {punchTimes && punchTimes.IN_TIME ? (
                      <tr>
                        <td className="py-3 px-6">
                          {new Date(punchTimes.IN_TIME).toLocaleTimeString()}
                        </td>
                        <td className="py-3 px-6">
                          {punchTimes.OUT_TIME
                            ? new Date(punchTimes.OUT_TIME).toLocaleTimeString()
                            : "N/A"}
                        </td>
                        <td className="py-3 px-6">
                          {punchTimes.OUT_TIME
                            ? `${Math.floor(
                                (new Date(punchTimes.OUT_TIME) -
                                  new Date(punchTimes.IN_TIME)) /
                                  (1000 * 60)
                              )} minutes`
                            : "N/A"}
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td className="py-3 px-6" colSpan="3">
                          No punch times available for today.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Punchin;
