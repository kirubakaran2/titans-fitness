import React, { useState, useEffect } from "react";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faSearch, faUndo, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import Sidebar from "./side";
import SearchForm from "./SearchForm";
import Tablegym from "./tables/Table";
import logo from "../img/logo-1.png";
import logo2 from "./Home/img/logo2.jpg";
import { useLocation } from "react-router-dom";

const SearchExistingCustomer = () => {
  const [user, setUser] = useState([]);
  const [filteredUser, setFilteredUser] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await Axios.get("https://titan-api-v2uu.onrender.com/admin/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.users);
        setFilteredUser(response.data.users);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  const handleFilter = ({ memberID, name, phone, dob }) => {
    const filtered = user.filter(u =>
      (memberID ? u.ID.toString().includes(memberID) : true) &&
      (name ? u.NAME.toLowerCase().includes(name.toLowerCase()) : true) &&
      (phone ? u.PHONE.includes(phone) : true) &&
      (dob ? new Date(u.DOB).toLocaleDateString().includes(dob) : true)
    );
    setFilteredUser(filtered);
  };

  const handleSignOut = () => {
    sessionStorage.removeItem("token");
    window.location.href = "/";
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const location = useLocation();

  const isAdmin = false;
  const toggleButton = (
    <button className="md:hidden" onClick={toggleSidebar}>
      {sidebarOpen ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      )}
    </button>
  );

  const userInfo = isAdmin ? (
    <>
      {/* Admin info */}
    </>
  ) : (
    <>
      {/* Regular user info */}
    </>
  );

  return (
    <div>
      <header className="py-4 px-5 md:flex md:items-center md:justify-between">
        <div className="flex items-center">
          {toggleButton}
          <img src={logo} alt="Logo" className="w-50 h-10 mr-2" />
          <div className="mx-5">
            <FontAwesomeIcon icon={faSearch} className="text-70AB0E-800 mr-2" />
            <span className="text-70AB0E-800"> Search Existing Customer</span>
          </div>
        </div>
          <div className="flex justify-center ">
            <img src={logo} alt="Logo" className="w-64 h-10" />
          </div>
        <div className="fixed bottom-5 left-0 mb-3 ml-2 z-10">
          <ul className="flex">
            <li className="hover:text-70AB0E-800 px-1">
              <a href="/" className="block flex items-center" onClick={handleSignOut}>
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-lg" />
                <span className="text-sm">Sign Out</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="fixed top-0 right-0 mb-3 pr-4">
          <img
            srcSet={logo2}
            alt="avatar"
            className="relative inline-block object-cover object-center w-12 h-12 rounded-lg"
          />
          <div>
            <h6 className="bg-transparent block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-inherit">
              admin
            </h6>
            {/* <p className="bg-transparent block font-sans text-sm antialiased font-normal leading-normal text-gray-700">
              admin
            </p> */}
          </div>
        </div>
        <div className="fixed bottom-0 left-0 mb-3 pr-4">
          <ul className="flex">
            <span className="text-sm">The Titans Fitness Studio - UniSex</span>
          </ul>
        </div>
        <div className="md:flex items-center">
          {userInfo}
        </div>
      </header>
      <div className="flex">
        <div>
          <Sidebar toggleSidebar={toggleSidebar} pathname={location.pathname} id="default-sidebar" />
        </div>
        <div className="flex flex-grow flex-col -mt-20">
          <div className="flex justify-center mt-20">
            <Tablegym user={filteredUser} />
          </div>
          <div className="flex justify-end mt-5 px-20">
            <button className="btn">
              <FontAwesomeIcon icon={faUndo} className="mr-1" />
              Reset
            </button>
            <button className="btn">
              <FontAwesomeIcon icon={faFileExcel} className="mr-1" />
              Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchExistingCustomer;
