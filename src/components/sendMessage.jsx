import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import defaultImg from "./Home/img/logo2.jpg";
import "react-toastify/dist/ReactToastify.css";
import logo from "./Home/img/logo-1.png";
import com from "./Home/img/cd.jpg";
import "../components/scroll.css";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC9IN0ODnCWp7z50unVyXlq3Kzo4qMJfg4",
  authDomain: "passwordmanager-48233.firebaseapp.com",
  projectId: "passwordmanager-48233",
  storageBucket: "passwordmanager-48233.appspot.com",
  messagingSenderId: "677479898991",
  appId: "1:677479898991:web:66cb791eb558308666529a",
  measurementId: "G-ZZEGEQKSW3"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const SendMessage = () => {
  const [message, setMessage] = useState({});
  const [imageUrl, setImageUrl] = useState("");

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        setImageUrl(url);
        setMessage({ ...message, image: url });
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading image");
      }
    }
  };

  const handleSendMessage = async () => {
    const token = sessionStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
   if(imageUrl) {
    await axios
    .post("http://54.175.94.211:8080/send-images", {
      ...message,
      image: imageUrl
    }, {headers})
    .then((res) => toast.success("Message Sent"));
   }
   else {
    await axios
    .post("http://54.175.94.211:8080/send-sms", {
      ...message,
    }, {headers})
    .then((res) => toast.success("Message Sent"));
   }
  };

  const handleSignOut = () => {
    sessionStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <ToastContainer />
      <div className="absolute inset-0 flex items-center justify-center z-0 opacity-50">
        <img
          src={logo}
          alt="Logo"
          className="w-full h-full object-contain"
          style={{ opacity: 0.15 }}
        />
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 z-10">
        <h1 className="text-center text-2xl font-bold text-gray-800 mb-6">
          Send a Message
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            name="message"
            placeholder="Enter your message"
            className="w-full p-3 border rounded-lg focus:outline-none focus:border-green-500"
            onChange={(e) =>
              setMessage({ ...message, message: e.target.value })
            }
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full border rounded-lg p-3 cursor-pointer"
          />

          {message.image && (
            <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden mt-2">
              <img
                src={message.image}
                alt="Selected"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <button
            type="button"
            className="w-full mt-4 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
            onClick={handleSendMessage}
          >
            Send Message
          </button>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-10">
        <button
          className="flex items-center text-gray-600 hover:text-green-600"
          onClick={handleSignOut}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>

      <div className="fixed bottom-4 left-4 flex flex-col items-center z-10 text-gray-500 text-xs">
        <div>Powered by</div>
        <img src={com} alt="Codebuilders Logo" className="w-28 mt-1" />
        <div className="mt-1 text-center">Vps Codebuilders Pvt Ltd</div>
      </div>
    </div>
  );
};

export default SendMessage;
