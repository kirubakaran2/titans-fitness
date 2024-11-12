import React, { useState, useEffect } from "react";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import logo from "../img/brand.png";
import defaultImg from "./Home/img/logo2.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PaymentHistory from "./payment/PaymentGet";

const HOSTURL = `https://titan-api-v2uu.onrender.com`
// https://titan-api-v2uu.onrender.com
// https://titan-api-v2uu.onrender.com
// https://titan-api-v2uu.onrender.com
// https://titan-api-v2uu.onrender.com
// https://titan-api-v2uu.onrender.com
// https://titan-api-v2uu.onrender.com
// https://titan-api-v2uu.onrender.com
// https://titan-api-v2uu.onrender.com

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [nextDue, setNextDue] = useState("");
  const [newPayment, setNewPayment] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [balance, setBalance] = useState("0");
  const [type, setType] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [error, setError] = useState(null);
  const [isActivated, setIsActivated] = useState(false);
  const notify = () => {
    toast.success("Payment Added", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: "bounce",
    });
  };
  const [isEditing, setIsEditing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");
  const [editedInfo, setEditedInfo] = useState({
    name: "",
    dob: "",
    address: "",
    email: "",
    phone: "",
    referenceNumber: "",
    image: "",
  });
  const [recentPayments, setRecentPayments] = useState([]);
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [paymentToEdit, setPaymentToEdit] = useState(null);
  const [payments, setPayments] = useState([]);
  const userId = sessionStorage.getItem("CUSTOMER_PROFILE_ID");
  const token = sessionStorage.getItem("token");
  const [measurements, setMeasurements] = useState({
    userID: "",
    height: "",
    chest: "",
    weight: "",
    waist: "",
    bodyfat: "",
    hip: ""
  })
  const [attendenceHistory, setAttendenceHistory] = useState([])

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await Axios.get(
          `${HOSTURL}/admin/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // sessionStorage(response);

        if (response.data && response.data.user) {
          const userData = response.data.user;
          setUser(userData);
          setPaymentStatus(userData.PAYMENTSTATUS);
          setNextDue(userData.NEXTDUE);
          setIsActivated(userData.ACTIVE);
          setRecentPayments(userData.recentPayments || []);
          setImagePath(
            userData.IMAGE_PATH
              ? `${HOSTURL}/${userData.IMAGE_PATH}`
              : defaultImg
          );
        } else {
          setError("User data not found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setImagePath(defaultImg);
        setError("Error fetching user details");
      }
    };

    fetchUserDetails();
  }, [id]);

  const activateUser = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await Axios.post(
        `${HOSTURL}/admin/user/active`,
        {
          userID: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPaymentStatus(response.data.paymentStatus);
      setNextDue(response.data.nextDue);
      setRecentPayments([...recentPayments, response.data.payment]);
      setNewPayment("");
      setEffectiveDate("");
      setEndDate("");
      setBalance("0");
      setType("");
      toast.success("ativated successfully!");
    } catch (error) {
      console.error("Error while activating:", error);

      if (error.response && error.response.headers) {
      }

      setError("Error while activating");
      toast.error("Error while activating");
    }
  };

  const deactivateUser = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await Axios.post(
        `${HOSTURL}/admin/user/non-active`,
        {
          userID: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPaymentStatus(response.data.paymentStatus);
      setNextDue(response.data.nextDue);
      setRecentPayments([...recentPayments, response.data.payment]);
      setNewPayment("");
      setEffectiveDate("");
      setEndDate("");
      setBalance("");
      setType("");
      toast.success("Deativated successfully!");
    } catch (error) {
      console.error("Error while Deactivating:", error);

      if (error.response && error.response.headers) {
      }

      setError("Error while Deactivating");
      toast.error("Error while Deactivating");
    }
  };
  const handleEdit = () => {
    setIsEditing(true);
    setEditedInfo({
      name: user.NAME,
      dob: user.DOB.slice(0, 10),
      address: user.ADDRESS,
      email: user.EMAIL,
      mobile: user.PHONE,
      image: user.IMAGE,
    });
  };

  useEffect(() => {
    if (user) {
      setEditedInfo({
        name: user.name || "",
        email: user.email || "",
        mobile: user.phone || "",
        dob: user.DOB ? user.DOB.slice(0, 10) : "",
        address: user.ADDRESS || "",
      });
    }
  }, [user]);

  const reverseDateFormat = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  };

  const handleSaveEdit = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", editedInfo.name);
      formData.append("mobile", editedInfo.mobile);
      formData.append("email", editedInfo.email);
      formData.append("dob", reverseDateFormat(editedInfo.dob));
      formData.append("address", editedInfo.address);
      formData.append("referencenum", editedInfo.referenceNumber);

      // Check if the image is an object (file) and not a URL or string
      if (editedInfo.image && typeof editedInfo.image === "object") {
        formData.append("image", editedInfo.image);
      } else {
        formData.append("image", ""); // Ensure an empty string is sent if no image
      }

      const requestOptions = {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          // Note: Do not set 'Content-Type' header to 'multipart/form-data' manually
          // When using FormData, the browser sets it for you, including the correct boundary
        },
        body: formData,
      };

      const response = await fetch(
        `${HOSTURL}/admin/user/edit/${id}`,
        requestOptions
      );

      if (response.ok) {
        const responseData = await response.json(); // Parse the JSON response body

        toast.success("User details updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        window.location.reload();
      } else {
        const errorText = await response.text();
        console.error("Error updating user details:", errorText);
        setError("Error updating user details");
        toast.error("Error updating user details. Please try again!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error updating user details:", error);
      setError("Error updating user details");
      toast.error("Error updating user details. Please try again!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const updateUserDetails = async (formData) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await Axios.patch(
        `${HOSTURL}/admin/user/edit/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsEditing(false);
      setUser(response.data.user);
      toast.success("User details updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error updating user details:", error);
      setError("Error updating user details");
      toast.error("Failed to update user details. Please try again!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  const handleAddPayment = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await Axios.post(
        `${HOSTURL}/admin/payment/add`,
        {
          id: user.ID,
          type,
          amount: newPayment,
          effective: effectiveDate,
          end: endDate,
          balance,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPaymentStatus(response.data.paymentStatus);
      setNextDue(response.data.nextDue);
      setRecentPayments([...recentPayments, response.data.payment]);
      setNewPayment("");
      setEffectiveDate("");
      setEndDate("");
      setBalance("");
      setType("");
      toast.success("Payment added successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error adding payment:", error);

      if (error.response && error.response.headers) {
      }

      setError("Error adding payment");
      toast.error("Error adding payment");
    }
  };
  const handleCancelEdit = () => {
    setIsEditingPayment(false);
    setIsEditing(false);
    setPaymentToEdit(null);
  };

  const handleDownload = async () => {
    try {
      // Fetch the payment history for the specific user
      const response = await Axios.get(
        `${HOSTURL}/admin/payment/${user.ID}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      // Log the full response and the extracted payment history
      console.log("Full Response:", response);
      console.log("Response Data:", response.data);
      console.log("Extracted Payment History:", response.data.payment);

      // Extract the payment array
      const paymentHistory = response.data.payment;

      // Convert the payment history to Excel sheet
      const ws = XLSX.utils.json_to_sheet(paymentHistory);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Payments");

      // Generate and download the Excel file
      XLSX.writeFile(wb, "payments.xlsx");
    } catch (error) {
      console.error("Error fetching payment history:", error);
    }
  };

  const handleSignOut = () => {
    sessionStorage.removeItem("token");
    window.location.href = "/";
  };

  const saveMeasurements = async () => {
      const response = await Axios.post(
        `${HOSTURL}/measurement`, {...measurements, userID: id},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Measurements saved successfully!");
        getMeasurements()
      } else {
        toast.error("Failed to save measurements. Please try again!");
      }
  }

  const getMeasurements = async () => {
    const response = await Axios.get(
      `${HOSTURL}/measurement/${id}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    setMeasurements({...response.data.data[response.data.data.length-1]});
  }

  useEffect(() => {
    getMeasurements()
  }, [id])

  useEffect(() => {
    async function call() {
      const res = await Axios.get(`${HOSTURL}/admin/attendance/${id}`,  {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      const data = await res.data;
      setAttendenceHistory(data.attendance);
    }
    call()
  }, [id])


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
      <div className="fixed bottom-0 left-0 mb-3 ml-4 z-10">
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

      <div className="fixed bottom-0 right-0 mb-3 pr-4">
        <ul className="flex">
          <span className="text-sm">The Titans Fitness Studio -UniSex</span>
        </ul>
      </div>

      <div className="relative z-10">
        <header
          className="py-4 px-5 flex items-center justify-between"
        >
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="w-50 h-10 mr-2" />
          </div>
          <span className="text-green-500 text-2xl font-semibold">
            Customer Info
          </span>
          <div className="flex flex-row gap-2 items-center p-2">
            <button
              onClick={activateUser}
              className="text-white bg-[#2F2F2F] py-2 px-4 rounded mt-2 mr-2"
            >
              Activate User
            </button>
            <button
              onClick={deactivateUser}
              className="bg-[#2F2F2F] text-white py-2 px-4 rounded mt-2 mr-2"
            >
              Deactivate User
            </button>
          </div>

        </header>
        <div className="container mx-auto p-4">
          {user ? (
           <div className="flex flex-row items-start gap-10 w-full">
            <div className="flex flex-col items-center gap-2">
              <img
                src={imagePath}
                alt="User"
                className="w-[150px] h-[250px] rounded"
                onError={(e) => (e.target.src = defaultImg)}
              />
              <div className="border border-black p-4 rounded mt-2 w-[150px] text-sm">
                 Customer ID: {user.ID}
              </div>

              <div className="flex flex-row items-center gap-2">
                <button
                  onClick={handleEdit}
                  className=" text-black border hover:bg-black hover:text-white border-black py-2 px-4 rounded mt-2 mr-2"
                >
                  <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
                </button>
                {/* <button
                  onClick={handleDownload}
                  className="text-black border-2 border-black py-2 px-4 rounded mt-2 mr-2"
                >
                  <FontAwesomeIcon icon="fa-solid fa-download" />
                </button> */}
              </div>

            </div>
            <div className="flex flex-col w-full items-start">
            <div className="bg-white p-4 rounded-xl shadow-md w-full">
              <h1 className="text-green-400 text-2xl mb-5">Basic Info</h1>
              <div className="grid grid-cols-2 gap-4 w-full">
                <>
                  <div>
                    <label className="text-xl  mb-2">Name:</label>
                    <input
                      type="text"
                      value={user.NAME}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xl  mb-2">Email:</label>
                    <input
                      type="text"
                      value={user.EMAIL}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xl  mb-2">Phone:</label>
                    <input
                      type="text"
                      value={user.PHONE}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xl  mb-2">DOB:</label>
                    <input
                      type="date"
                      value={user.DOB && user.DOB.slice(0, 10)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xl  mb-2">
                      Address:
                    </label>
                    <input
                      type="text"
                      value={user.ADDRESS}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  {/* <div>
                  {/* <label className="text-xl  mb-2">Reference Number:</label>
                  <input
                    type="text"
                    value={user.referenceNumber}
                    className="w-full p-2 border rounded"
                  /> */}
                  {/* </div> */}
                  <div>
                    <label className="text-xl  mb-2">
                      Next Due:
                    </label>
                    <input
                      type="text"
                      value={user.endDate}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                 
                </>
              </div>
              <h1 className="mt-4 text-2xl text-green-400 mb-4">Measurements</h1>
              <div className="grid grid-cols-2 gap-4 w-full mt-2">
                <>
                  <div>
                    <label className="text-xl  mb-2">Height:</label>
                    <input
                      type="text"
                      value={measurements.height}
                      placeholder="Height"
                      onChange={e => setMeasurements({...measurements, height: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xl  mb-2">Chest</label>
                    <input
                      type="text"
                      value={measurements.chest}
                      placeholder="Chest/Bust Size"
                      onChange={e => setMeasurements({...measurements, chest: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xl  mb-2">Wight:</label>
                    <input
                      type="text"
                      value={measurements.weight}
                      placeholder="Weight"
                      onChange={e => setMeasurements({...measurements, weight: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xl  mb-2">Shoulder:</label>
                    <input
                      type="text"
                      value={measurements.shoulder}
                      placeholder="Shoulder"
                      onChange={e => setMeasurements({...measurements, shoulder: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xl  mb-2">Biceps:</label>
                    <input
                      type="text"
                      value={measurements.biceps}
                      placeholder="biceps"
                      onChange={e => setMeasurements({...measurements, biceps: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xl  mb-2">Hip:</label>
                    <input
                      type="text"
                      value={measurements.hip}
                      placeholder="Hip"
                      onChange={e => setMeasurements({...measurements, hip: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xl  mb-2">Leg:</label>
                    <input
                      type="text"
                      value={measurements.leg}
                      placeholder="Leg"
                      onChange={e => setMeasurements({...measurements, leg: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </>
              </div>
              <button className="text-white bg-[#2F2F2F] py-2 px-4 rounded mt-2 mr-2" onClick={saveMeasurements}>Save Measurements</button>
              </div>
              <div className="mt-5 p-4 rounded-xl shadow bg-white w-full">
              {isEditing && (
                <div className="bg-gray-100 p-4 rounded shadow-md mb-4 mt-4">
                  <h3 className="text-xl font-bold mb-4">Edit Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-2">Name:</label>
                      <input
                        type="text"
                        value={editedInfo.name}
                        onChange={(e) =>
                          setEditedInfo({ ...editedInfo, name: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2">Email:</label>
                      <input
                        type="email"
                        value={editedInfo.email}
                        onChange={(e) =>
                          setEditedInfo({
                            ...editedInfo,
                            email: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2">Phone:</label>
                      <input
                        type="text"
                        value={editedInfo.mobile}
                        onChange={(e) =>
                          setEditedInfo({
                            ...editedInfo,
                            mobile: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label htmlFor="dob">Date of Birth:</label>
                      <DatePicker
                        selected={
                          editedInfo.dob ? new Date(editedInfo.dob) : null
                        }
                        onChange={(date) =>
                          setEditedInfo({
                            ...editedInfo,
                            dob: date.toISOString().split("T")[0],
                          })
                        }
                        dateFormat="yyyy-MM-dd"
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2">
                        Address:
                      </label>
                      <input
                        type="text"
                        value={editedInfo.address}
                        onChange={(e) =>
                          setEditedInfo({
                            ...editedInfo,
                            address: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    {/* <div>
                  <label className="block font-semibold mb-2">Reference Number:</label>
                  <input
                    type="text"
                    value={editedInfo.referenceNumber}
                    onChange={(e) => setEditedInfo({ ...editedInfo, referenceNumber: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div> */}
                    <div>
                      <label className="block font-semibold mb-2">Image:</label>
                      <input
                        type="file"
                        onChange={(e) =>
                          setEditedInfo({
                            ...editedInfo,
                            image: e.target.files[0],
                          })
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSaveEdit}
                    className=" hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                    style={{ backgroundColor: "#79BA0F" }}
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 ml-4"
                  >
                    Cancel
                  </button>
                </div>
              )}
              <div className="bg-gray-100 p-4 rounded shadow-md mb-4 mt-4">
                <h3 className="text-xl font-bold mb-4">Add Payment</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">
                      Payment Amount:
                    </label>
                    <input
                      type="text"
                      value={newPayment}
                      onChange={(e) => setNewPayment(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">
                      Effective Date:
                    </label>
                    <input
                      type="date"
                      value={effectiveDate}
                      onChange={(e) => setEffectiveDate(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">
                      End Date:
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Balance:</label>
                    <input
                      type="text"
                      value={balance}
                      onChange={(e) => setBalance(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Type:</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select payment type</option>
                      <option value="upi">UPI</option>
                      <option value="cards">Cards</option>
                      <option value="cash">Cash</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleAddPayment}
                  className="bg-custom-green hover:bg-custom-green text-white font-bold py-2 px-4 rounded mt-4"
                  style={{ backgroundColor: "#79BA0F" }}
                >
                  Add Payment
                </button>

                <ToastContainer />
              </div>

              <PaymentHistory userId={user.ID} />

              </div>
              <div className="mt-2 rounded bg-white drop-shadow p-2 w-full">
                <p className="text-green-500 text-xl mb-2">Attendence History</p>
                <table className="w-full table-auto bg-white shadow-md rounded-lg overflow-hidden ">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="px-4 py-2 text-left">In Time</th>
                      <th className="px-4 py-2 text-left">Out Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendenceHistory?.length > 0 ? (
                      attendenceHistory?.sort((a, b) => new Date(b.IN_TIME) - new Date(a.IN_TIME))?.map((att, index) => (
                        <tr key={index} className="border-b last:border-none hover:bg-gray-100">
                          <td className="px-4 py-2">{att?.IN_TIME && new Date(att?.IN_TIME)?.toLocaleString()}</td>
                          <td className="px-4 py-2">{att?.OUT_TIME ? new Date(att?.OUT_TIME)?.toLocaleString() : ""}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-gray-500">No Attendence history available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>

              </div>
            </div>
           </div>
          ) : (
            <p className="text-xl font-semibold">Loading user data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
