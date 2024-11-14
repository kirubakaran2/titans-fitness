import React, { useState, useEffect } from "react";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import logo from "../img/brand.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PaymentHistory from "./payment/PaymentGet";
const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [nextDue, setNextDue] = useState("");
  const [newPayment, setNewPayment] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [balance, setBalance] = useState("");
  const [type, setType] = useState("");
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
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await Axios.get(
          `https://titan-api-v2uu.onrender.com/admin/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data && response.data.user) {
          const userData = response.data.user;
          setUser(userData);
          setPaymentStatus(userData.PAYMENTSTATUS);
          setNextDue(userData.NEXTDUE);
          setIsActivated(userData.ACTIVE);
          setRecentPayments(userData.recentPayments || []);
        } else {
          setError("User data not found");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Error fetching user details");
      }
    };

    fetchUserDetails();
  }, [id]);

  const activateUser = async () => {
    try {
      const response = await Axios.post(
        "https://titan-api-v2uu.onrender.com/admin/user/active",
        { userID: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("User activated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

    } catch (error) {
      console.error("Error activating user:", error);
      setError("Error activating user");
      toast.error("Failed to activate user. Please try again!", {
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

  const deactivateUser = async () => {
    try {
      const response = await Axios.post(
        "https://titan-api-v2uu.onrender.com/admin/user/non-active",
        { userID: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("User deactivated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

    } catch (error) {
      console.error("Error deactivating user:", error);
      setError("Error deactivating user");
      toast.error("Failed to deactivate user. Please try again!", {
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
  const handleEdit = () => {
    setIsEditing(true);
    setEditedInfo({
      name: user.NAME,
      dob: user.DOB.slice(0, 10),
      address: user.ADDRESS,
      email: user.EMAIL,
      mobile: user.PHONE,
      referenceNumber: user.REFERENCE_NUMBER,
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

      const convertImageToBase64 = (imageFile) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(imageFile);
          reader.onloadend = () => resolve(reader.result.split(",")[1]);
          reader.onerror = (error) => reject(error);
        });
      };

      let base64Image = "";
      if (editedInfo.image) {
        base64Image = await convertImageToBase64(editedInfo.image);
      }

      const jsonData = {
        name: editedInfo.name,
        dob: reverseDateFormat(editedInfo.dob),
        address: editedInfo.address,
        email: editedInfo.email,
        mobile: editedInfo.phone,
        image: base64Image,
      };
      

      updateUserDetails(jsonData);
    } catch (error) {
      console.error("Error updating user details:", error);
      setError("Error updating user details");
    }
  };

  const updateUserDetails = async (formData) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await Axios.patch(
        `https://titan-api-v2uu.onrender.com/admin/user/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
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
        "https://titan-api-v2uu.onrender.com/admin/payment/add",
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
    setPaymentToEdit(null);
  };

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(recentPayments);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payments");
    XLSX.writeFile(wb, "payments.xlsx");
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
          style={{ backgroundColor: "#70AB0E" }}
        >
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="w-50 h-10 mr-2" />
            <span className="text-white text-2xl font-semibold">
              Customer Details
            </span>
          </div>
        </header>
        <div className="container mx-auto p-4 bg-custom-green">
          {user ? (
            <div className="bg-white p-4 rounded shadow-md w-full">
              <h2 className="text-2xl font-bold mb-4 text-right">
                Customer ID: {user.ID}
              </h2>
              <div className="flex justify-end">
                <img
                  src={user.IMAGE_PATH}
                  alt="User"
                  className="max-w-full h-auto rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 w-full">
                <>
                  <div>
                    <label className="text-xl font-semibold mb-2">Name:</label>
                    <input
                      type="text"
                      value={user.NAME}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xl font-semibold mb-2">Email:</label>
                    <input
                      type="text"
                      value={user.EMAIL}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xl font-semibold mb-2">Phone:</label>
                    <input
                      type="text"
                      value={user.PHONE}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xl font-semibold mb-2">DOB:</label>
                    <input
                      type="date"
                      value={user.DOB && user.DOB.slice(0, 10)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xl font-semibold mb-2">
                      Address:
                    </label>
                    <input
                      type="text"
                      value={user.ADDRESS}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  {/* <div>
                  <label className="text-xl font-semibold mb-2">Reference Number:</label>
                  <input
                    type="text"
                    value={user.ADDRESS}
                    className="w-full p-2 border rounded"
                  />
            </div> */}
                  <div>
                    <label className="text-xl font-semibold mb-2">
                      Next Due:
                    </label>
                    <input
                      type="text"
                      value={user.nextDue}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <button
                    onClick={activateUser}
                    className="bg-custom-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 mr-2"
                    style={{ backgroundColor: "#79BA0F" }}
                  >
                    Activate User
                  </button>
                  <button
                    onClick={deactivateUser}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2 mr-2"
                    style={{ backgroundColor: "#79BA0F" }}
                  >
                    Deactivate User
                  </button>
                  <button
                    onClick={handleEdit}
                    className="bg-custom-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 mr-2"
                    style={{ backgroundColor: "#79BA0F" }}
                  >
                    Edit Info
                  </button>
                  <button
                    onClick={handleDownload}
                    className="bg-custom-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
                    style={{ backgroundColor: "#79BA0F" }}
                  >
                    Download Payments
                  </button>
                </>
              </div>
              {isEditing && (
                <div className="bg-gray-100 p-4 rounded shadow-md mb-4">
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
                        value={editedInfo.phone}
                        onChange={(e) =>
                          setEditedInfo({
                            ...editedInfo,
                            phone: e.target.value,
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
              <div className="bg-gray-100 p-4 rounded shadow-md mb-4">
                <h3 className="text-xl font-bold mb-4">Add Payment</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-2">
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
                    <label className="block font-semibold mb-2">
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
                    <label className="block font-semibold mb-2">
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
                    <label className="block font-semibold mb-2">Balance:</label>
                    <input
                      type="text"
                      value={balance}
                      onChange={(e) => setBalance(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Type:</label>
                    <input
                      type="text"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
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
          ) : (
            <p className="text-xl font-semibold">Loading user data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
