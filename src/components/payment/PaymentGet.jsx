import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentHistory = ({ userId }) => {
  const [payments, setPayments] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [error, setError] = useState("");
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [paymentToEdit, setPaymentToEdit] = useState(null);
  const [newPayment, setNewPayment] = useState({
    amount: '',
    effective: '',
    end: '',
    balance: 0,
    type: '',
  });

  const fetchPaymentDetails = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const paymentDetailsResponse = await axios.get(
        `http://54.175.94.211:8080/admin/payment/${userId}`,
        { headers }
      );
      setPaymentDetails(paymentDetailsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchPaymentDetails();
    }
  }, [userId]);

  const handleEditPayment = (payment) => {
    console.log(payment)
    setIsEditingPayment(true);
    setPaymentToEdit({
      paymentId: payment?.PAYMENT_ID ,
      amount: payment.PAYMENT_AMOUNT,
      end: payment.END_DATE,
      balance: payment.PAYMENT_BALANCE,
    });
   
  };

  const handleDeletePayment = async (paymentId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.delete(
        `http://54.175.94.211:8080/admin/payment/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Payment deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        fetchPaymentDetails();
      } else {
        console.error("Error deleting payment:", response.statusText);
        toast.error("Error deleting payment. Please try again!", {
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
      console.error("Error deleting payment:", error);
      toast.error("Error deleting payment. Please try again!", {
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

  const handleSavePaymentEdit = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const { paymentId, amount, end, balance } = paymentToEdit;

      // Ensure the end date is in the correct format
      const formattedEnd = new Date(end).toISOString().split("T")[0];
      const requestData = { paymentId, amount, end: formattedEnd, balance };

      const response = await axios.patch(
        `http://54.175.94.211:8080/admin/payment/${userId}`,
        {
          paymentId, 
          amount, 
          end: formattedEnd, 
          balance
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        fetchPaymentDetails();
        setIsEditingPayment(false);
        setPaymentToEdit(null);
        toast.success("Payment updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } 
      else {
        console.error("Error updating payment:", response.statusText);
        toast.error("Error updating payment. Please try again!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } 
    catch (error) {
      console.error("Error updating payment:", error);
      toast.error("Error updating payment. Please try again!", {
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

  const handleCancelEditPayment = () => {
    setIsEditingPayment(false);
    setPaymentToEdit(null);
  };

  const handleAddPayment = () => {
    setIsAddingPayment(true);
  };

  const handleSaveNewPayment = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const { amount, effective, end, balance, type } = newPayment;

      // Ensure the dates are in the correct format
      const formattedEffective = new Date(effective).toISOString().split("T")[0];
      const formattedEnd = new Date(end).toISOString().split("T")[0];

      const response = await axios.post(
        `http://54.175.94.211:8080/admin/payment`,
        { userId, amount, effective: formattedEffective, end: formattedEnd, balance, type },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        fetchPaymentDetails();
        setIsAddingPayment(false);
        setNewPayment({ amount: '', effective: '', end: '', balance: '', type: '' });
        toast.success("Payment added successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        console.error("Error adding payment:", response.statusText);
        toast.error("Error adding payment. Please try again!", {
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
      console.error("Error adding payment:", error);
      toast.error("Error adding payment. Please try again!", {
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

  const handleCancelAddPayment = () => {
    setIsAddingPayment(false);
    setNewPayment({ amount: '', effective: '', end: '', balance: '', type: '' });
  };

  return (
    <div>
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Payment History</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Amount</th>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Effective Date</th>
            <th className="py-2 px-4 border-b">End Date</th>
            <th className="py-2 px-4 border-b">Balance</th>
            <th className="py-2 px-4 border-b">Type</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isAddingPayment && (
            <tr>
              <td colSpan="7">
                <div className="p-4 rounded shadow-md mb-4" style={{ backgroundColor: '#70AB0E' }}>
                  <h3 className="text-xl font-bold mb-4">Add Payment</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-2">Payment Amount:</label>
                      <input
                        type="text"
                        value={newPayment.amount}
                        onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2">NextDue Date:</label>
                      <input
                        type="date"
                        value={newPayment.effective}
                        onChange={(e) => setNewPayment({ ...newPayment, effective: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2">End Date:</label>
                      <input
                        type="date"
                        value={newPayment.end}
                        onChange={(e) => setNewPayment({ ...newPayment, end: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2">Balance:</label>
                      <input
                        type="text"

                        value={newPayment.balance}
                        onChange={(e) => setNewPayment({ ...newPayment, balance: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2">Type:</label>
                      <input
                        type="text"
                        value={newPayment.type}
                        onChange={(e) => setNewPayment({ ...newPayment, type: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSaveNewPayment}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                    style={{ backgroundColor: '#79BA0F' }}
                  >
                    Save Payment
                  </button>
                  <button
                    onClick={handleCancelAddPayment}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 ml-2"
                  >
                    Cancel
                  </button>
                </div>
              </td>
            </tr>
          )}

          {isEditingPayment && paymentToEdit && (
            <tr>
              <td colSpan="7">
                <div className="p-4 rounded shadow-md mb-4" style={{ backgroundColor: '#70AB0E' }}>
                  <h3 className="text-xl font-bold mb-4">Edit Payment</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-2">Payment Amount:</label>
                      <input
                        type="text"
                        value={paymentToEdit.amount}
                        onChange={(e) => setPaymentToEdit({ ...paymentToEdit, amount: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2">End Date:</label>
                      <input
                        type="date"
                        value={paymentToEdit.end ? paymentToEdit.end.split("T")[0] : ""}
                        onChange={(e) => setPaymentToEdit({ ...paymentToEdit, end: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2">Balance:</label>
                      <input
                        type="text"
                        value={paymentToEdit.balance}
                        onChange={(e) => setPaymentToEdit({ ...paymentToEdit, balance: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSavePaymentEdit}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                    style={{ backgroundColor: '#79BA0F' }}
                  >
                    Save Payment
                  </button>
                  <button
                    onClick={handleCancelEditPayment}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 ml-2"
                  >
                    Cancel
                  </button>
                </div>
              </td>
            </tr>
          )}

          {/* Existing payment details */}
          {paymentDetails?.USER?.PAYMENT_HISTORY &&
            paymentDetails?.USER?.PAYMENT_HISTORY?.sort((a, b) => new Date(b.PAYMENT_DATE) - new Date(a.PAYMENT_DATE))?.map((payment) => (
              <tr key={payment._id}>
                <td className="border px-4 py-2">{payment.PAYMENT_AMOUNT}</td>
                <td className="border px-4 py-2">{new Date(payment.PAYMENT_DATE).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{new Date(payment.EFFECTIVE_DATE).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{new Date(payment.END_DATE).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{payment.PAYMENT_BALANCE}</td>
                <td className="border px-4 py-2">{payment.PAYMENT_TYPE}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEditPayment(payment)}
                    className="bg-custom-green -500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePayment(payment.PAYMENT_ID)}
                    className="bg-custom-green -500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
