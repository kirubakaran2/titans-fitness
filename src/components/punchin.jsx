import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import defaultImg from "./Home/img/logo2.jpg";
import "react-toastify/dist/ReactToastify.css";
import logo from "./Home/img/logo-1.png";
import com from "./Home/img/cd.jpg";
import "../components/scroll.css";
const Punchin = () => {
  const [searchId, setSearchId] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [punchTimes, setPunchTimes] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [imagePath, setImagePath] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSearchChange = (event) => {
    setSearchId(event.target.value);
  };
  const scrollingTextStyle = {
    display: 'flex',
    whiteSpace: 'nowrap',
    animation: 'scroll 15s linear infinite',
  };
  const scrollAnimation = `
    @keyframes scroll {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }
  `;

  const handleSearchSubmit = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const headers = { Authorization: `Bearer ${token}` };

      const userDetailsResponse = await axios.get(
        `http://54.175.94.211:8080/admin/user/searching?name={{userName}}&dob={{dob}}&mobile={{mobile}}&userID=${searchId}`,
        { headers }
      );

      const userData = userDetailsResponse.data;

      setUserDetails(userData);

      if (userData.user && userData.user.IMAGE_PATH) {
        const imagePath = `http://54.175.94.211:8080/${userData.user.IMAGE_PATH}`;
        setImagePath(imagePath);
      } else {
        setImagePath(defaultImg);
      }

      const punchInTimesResponse = await axios.get(
        `http://54.175.94.211:8080/admin/punch/in?userId=${searchId}`,
        { headers }
      );
      const punchOutTimesResponse = await axios.get(
        `http://54.175.94.211:8080/admin/punch/out?userId=${searchId}`,
        { headers }
      );
      const punchTimesData = {
        IN_TIME: punchInTimesResponse.data.timing.IN_TIME,
        OUT_TIME: punchOutTimesResponse.data.timing.OUT_TIME,
      };
      setPunchTimes(punchTimesData);

      const paymentDetailsResponse = await axios.get(
        `http://54.175.94.211:8080/admin/payment/${searchId}`,
        { headers }
      );
      setPaymentDetails(paymentDetailsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("User doesn't exist");
    }
  };

  const handlePunchIn = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      await axios.post(
        `http://54.175.94.211:8080/admin/time/in`,
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
      const token = sessionStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      await axios.post(
        `http://54.175.94.211:8080/admin/time/out`,
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
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    } else if (event.key === "+") {
      event.preventDefault();
      handlePunchIn();
      setSearchId("");
    } else if (event.key === "-") {
      event.preventDefault();
      handlePunchOut();
      setSearchId("");
    }
  };
  const handleSignOut = () => {
    sessionStorage.removeItem("token");
    window.location.href = "/";
  };
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer />
      <div className="absolute inset-0 flex items-center justify-center opacity-50 z-0">
        <img
          src={logo}
          alt="Logo"
          className="w-[100vw] h-[100vh] object-contain"
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
      <div className="fixed bottom-20 right-0 mb-1 pr-4">
        <ul className="flex">
          <span className="text-lg font-bold">
            The Titans Fitness Studio - UniSex
          </span>
        </ul>
      </div>

      <div className="fixed bottom-2 right-0 mb-1 pr-4 flex flex-col items-center space-y-1">
        <div>Powered by</div>
        <div className="flex items-center space-x-2 text-xs text-gray-500 text-center">
          <img
            src={com}
            alt="Vps Codebuilders Pvt Ltd Logo"
            className="w-22 h-8"
          />
          <div className="flex flex-col items-start">
            {/* <div>Powered by</div> */}
            {/* <div className="text-sm mt-1">Vps Codebuilders Pvt Ltd 
      IT solution &ed tech</div> */}
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <header
          className="py-12 px-8 flex items-center justify-between"
          style={{ background: "linear-gradient(90deg, #02D097 0%, #0EA6C1 100%)" }}
        >
          <div className="flex items-center justify-start flex-1">
            <span className="text-white text-2xl font-semibold">
              Customer Time Punch IN/OUT
            </span>
          </div>
          <div className="flex justify-center flex-1">
            <img src={logo} alt="Logo" className="w-full h-full" />
          </div>
          <div className="flex-1"></div>
        </header>

        <div className="flex mt-10">
          <div className="w-1/2 bg-white p-6 rounded-lg shadow-lg mr-6">
            <div className="mb-4">
              <input
                type="text"
                ref={inputRef}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter Customer ID"
                value={searchId}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
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
                        <label className="block font-bold">Member ID</label>
                        <input
                          type="text"
                          value={userDetails.user.ID}
                          className="w-full border rounded px-2 py-1"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
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
                            ? (() => {
                                const diffInMs =
                                  new Date(punchTimes.OUT_TIME) -
                                  new Date(punchTimes.IN_TIME);
                                const diffInMinutes = Math.floor(
                                  diffInMs / (1000 * 60)
                                );
                                const hours = Math.floor(diffInMinutes / 60);
                                const minutes = diffInMinutes % 60;
                                return `${hours} hr ${minutes} min`;
                              })()
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
            {console.log(userDetails, paymentDetails)}
            {paymentDetails &&
              paymentDetails?.USER?.PAYMENT_HISTORY &&
              paymentDetails?.USER?.PAYMENT_HISTORY?.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-lg mb-5">
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
                          END Date
                        </th>
                        <th className="py-3 px-6 text-left bg-gray-200">
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentDetails.USER?.PAYMENT_HISTORY.sort((a, b) => new Date(b.PAYMENT_DATE) - new Date(a.PAYMENT_DATE)).map((payment, index) => (
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
                            {new Date(payment.END_DATE).toLocaleDateString()}
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
          </div>
          {/* Render payment details and punch times */}

          <div className="w-1/2"> 
            {/* Render payment details */}
            {userDetails &&
              userDetails.user && (
                <div className="bg-white p-4 rounded-lg shadow-lg mb-6 flex flex-col items-center border-2 w-11/12 md:w-2/3 mx-auto">
                  <div className="flex flex-col md:flex-row items-center md:items-start mb-4">
                    <div className="flex flex-col items-center md:items-start mr-4">
                      <label className="block font-bold mb-2">Profile:</label>
                      <img
                        src={imagePath}
                        alt="User"
                        className="w-32 h-32 rounded-full object-cover mb-4"
                        onError={(e) => (e.target.src = defaultImg)}
                      />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center mb-2">
                        <p className="font-bold mr-2">Name:</p>
                        <p>{userDetails.user.NAME}</p>
                      </div>
                      <div className="flex items-center mb-2">
                        <p className="font-bold mr-2">Customer ID:</p>
                        <p>{userDetails.user.ID}</p>
                      </div>
                    </div>
                  </div>
                  <style>{scrollAnimation}</style>
                  <div className="overflow-auto max-h-40 mb-4 relative">
            {/* Scrollable container */}
            <div className="whitespace-nowrap" style={scrollingTextStyle}>
              {/* <p className="text-red-900 font-bold text-lg mr-6">
                END DATE: {paymentDetails.payment[0].END_DATE.slice(0, 10)}
              </p> */}
              <p className={`${paymentDetails?.USER?.PAYMENT_STATUS === "Paid" ? "text-green-500": 'text-red-500'} font-bold text-lg`}>
              {paymentDetails.USER && paymentDetails.USER?.PAYMENT_HISTORY[0]?.END_DATE.slice(0, 10).split("-").reverse().join("-")} : NEXT DUE DATE
              </p>
            </div>
          </div>

                  <div
                    className={`px-10 py-2 rounded ${
                      paymentDetails?.USER?.PAYMENT_STATUS === "Paid"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    <p className="font-sans text-sm text-white">
                      {paymentDetails?.USER?.PAYMENT_STATUS}
                    </p>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Punchin;
