import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Card, Input, Typography } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faTimesCircle,
  faCalendarAlt,
  faCheckCircle,
  faMapMarkerAlt,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/preview.css";
import DietPlans from "./Dietplan";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "./Home/img/logo-1.png";

const UserInformationForm = styled.form`
  position: relative;
  height: 100%;
`;

const UserInformation = () => {
  const [name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  const [password, setPassword] = useState("");
  const [mobile, setMobileNumber] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [selectedDietPlan, setSelectedDietPlan] = useState("");
  const notify = () => toast("Form Submitted");
  const [previewData, setPreviewData] = useState({
    name: "",
    email: "",
    mobile: "",
    dob: "",
    address: "",
  });

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
    setPreviewData({ ...previewData, address: event.target.value });
  };

  const handleNameChange = (event) => {
    setFullName(event.target.value);
    setPreviewData({ ...previewData, fullName: event.target.value });
  };

  const handleDietPlanChange = (event) => {
    setSelectedDietPlan(event.target.value);
    setPreviewData({ ...previewData, diet: event.target.value });
  };

  const handleMobileNumberChange = (event) => {
    const input = event.target.value;
    const validatedInput = input.replace(/\D/g, "");
    setMobileNumber(validatedInput);
    setPreviewData({ ...previewData, mobileNumber: validatedInput });
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPreviewData({ ...previewData, password: event.target.value });
  };

  const handleDobChange = (event) => {
    setDob(event.target.value);
    setPreviewData({ ...previewData, dob: event.target.value });
  };

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);
    setValidEmail(isValid);
    setPreviewData({ ...previewData, email: newEmail });
  };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setImageFile(file);
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImagePreview(reader.result);
  //       setImageUploaded(true);
  //       setPreviewData({ ...previewData, imageUrl: reader.result });
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate required fields
    if (!name || !email || !mobile || !dob || !address) {
      toast.error("Please fill out all required fields.");
      return;
    }
  
    notify();
  
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("mobile", mobile);
      formData.append("email", email);
      formData.append("diet", selectedDietPlan);
      formData.append("dob", dob);
      formData.append("address", address);
      if (imageFile) {
        formData.append("image", imageFile);
      }
  
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        "https://titan-api-v2uu.onrender.com/admin/user/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
  
      if (response.ok) {
        window.location.reload();
        // Handle successful submission
      } else {
        console.error("Error submitting form data:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };
  

  const handleSignOut = () => {
    sessionStorage.removeItem("token");
    window.location.href = "/";
  };
  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageUploaded(false);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageUploaded(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <UserInformationForm
      className="flex flex-col justify-between"
      onSubmit={handleSubmit}
    >
      <Card color="transparent" shadow={false}>
        <div className="mt-2 mb-2 h-full form max-w-screen-lg sm:w-96">
          <h2 className="font-bold mb-3">Customer ID</h2>
          <h4 className="mb-3">User INFORMATION</h4>
          <div className="fixed bottom-0 left-0 mb-3 ml-4 z-10">
            <ul className="flex">
              <li className="hover:text-70AB0E-800 px-1">
                <a
                  href="/"
                  className="block flex items-center"
                  onClick={handleSignOut}
                >
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    className="mr-2 text-lg"
                  />
                  <span className="text-sm">Sign Out</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="fixed bottom-0 right-0 mb-3 pr-4">
            <div className="flex flex-col items-center mt-2">
              <ul className="flex">
                <span className="text-sm">
                  The Titans Fitness Studio -UniSex
                </span>
              </ul>
            </div>
          </div>
          <div className="gap-5 flex flex-col overflow-auto">
          <div className="flex items-center justify-center w-32 h-32 mb-5 relative">
      {imagePreview ? (
        <div className="w-full h-full relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-full rounded-lg object-cover"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-0 right-0 bg-red-500 rounded-full text-white p-1"
          >
            <FontAwesomeIcon icon={faTimesCircle} />
          </button>
        </div>
      ) : (
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 dark:hover:border-gray-500"
        >
          <div className="flex flex-col items-center justify-center">
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">+</span>
            </p>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-green-600">Add Image</span>
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      )}
      {imageUploaded && (
        <FontAwesomeIcon
          // icon={faCheckCircle}
          className="absolute top-0 right-0 text-green-500"
        />
      )}
    </div>

            <Input
              size="md"
              outline={false.toString()}
              placeholder="Full name"
              value={name}
              onChange={handleNameChange}
              className="font-bold"
              label="Name"
            />

            <Input
              size="regular"
              color="lightBlue"
              outline={false}
              placeholder="00000123"
              value={mobile}
              onChange={handleMobileNumberChange}
              className="font-bold"
              label="Mobile Number"
              maxLength={10}
            />

            <Input
              size="regular"
              color="lightBlue"
              outline={false}
              placeholder="xyz@gmail.com"
              value={email}
              onChange={handleEmailChange}
              className={`font-bold ${!validEmail ? "border-red-500" : ""}`}
              label="Email"
            />
            {!validEmail && (
              <Typography color="red" className="text-sm">
                Please enter a valid email address.
              </Typography>
            )}

            {/* <Input
              size="regular"
              color="lightBlue"
              outline={false}
              placeholder="***********"
              value={password}
              onChange={handlePasswordChange}
              className="font-bold"
              label="Password"
            /> */}

            <div className="mb-4">
              <Input
                type="date"
                size="regular"
                color="lightBlue"
                outline={false}
                value={dob}
                onChange={handleDobChange}
                className="font-bold"
                label="DOB"
              />
            </div>
            <DietPlans
              selectedDietPlan={selectedDietPlan}
              handleDietPlanChange={(e) => setSelectedDietPlan(e.target.value)}
            />
            <div className="col-span-full mb-5">
              <label
                htmlFor="about"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Address
              </label>
              <div className="mt-2">
                <textarea
                  id="about"
                  name="about"
                  rows="3"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-transparent"
                  onChange={handleAddressChange}
                />
              </div>
            </div>
            {previewData && (
              <div className="preview-section mb-5">
                <div className="container">
                  <div className="icon">
                    <FontAwesomeIcon icon={faPhone} className="fa-fw" />
                  </div>
                  <div className="inside flex justify-center items-center">
                    <h1>{previewData.mobileNumber}</h1>
                  </div>
                </div>

                <div className="container">
                  <div className="icon">
                    <FontAwesomeIcon icon={faEnvelope} className="fa-fw" />
                  </div>
                  <div className="inside flex justify-center items-center">
                    <h1>{previewData.email}</h1>
                  </div>
                </div>

                <div className="container">
                  <div className="icon">
                    <FontAwesomeIcon icon={faCalendarAlt} className="fa-fw" />
                  </div>
                  <div className="inside flex justify-center items-center">
                    <h1>{previewData.dob}</h1>
                  </div>
                </div>

                <div className="container">
                  <div className="icon">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="fa-fw" />
                  </div>
                  <div className="inside flex justify-center items-center">
                    <h1>{previewData.address}</h1>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="sticky bottom-5 bg-custom-green hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
            <ToastContainer />
          </div>
        </div>
      </Card>
    </UserInformationForm>
  );
};

export default UserInformation;
