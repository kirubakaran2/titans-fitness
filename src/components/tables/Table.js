import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faPhone,
  faCalendarAlt,
  faCheckCircle,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { Chip } from "@material-tailwind/react";
import Axios from "axios";
import "../../styles/sty.css";
import Loading from "../loading";
import "../../styles/Tabstlye.css";

const Tablegym = () => {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [filterID, setFilterID] = useState("");
  const [filterPhone, setFilterPhone] = useState("");
  const [filterDOB, setFilterDOB] = useState("");

  const navigate = useNavigate();

  const TABLE_HEAD = [
    { label: "Customer ID", icon: faUserCircle },
    { label: "Name", icon: faUserCircle },
    { label: "Mobile No", icon: faPhone },
    { label: "Date of Birth", icon: faCalendarAlt },
    { label: "Status", icon: faCheckCircle },
    { label: "Action", icon: faEdit },
  ];

  const handleScroll = (e) => {
    const rows = e.target.getElementsByTagName("tr");
    const scrollOffset = e.target.scrollTop;
    const windowHeight = e.target.clientHeight;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowTop = row.offsetTop;
      const rowHeight = row.clientHeight;
      const rowBottom = rowTop + rowHeight;

      if (rowTop >= scrollOffset && rowBottom <= scrollOffset + windowHeight) {
        row.classList.add("row-overlay");
      } else {
        row.classList.remove("row-overlay");
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(
          "https://titan-api-v2uu.onrender.com/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );

        const data = response.data.users;
        const uniqueDataMap = new Map();

        data.forEach((entry) => {
          if (
            !uniqueDataMap.has(entry.ID) ||
            new Date(entry.updatedAt) >
              new Date(uniqueDataMap.get(entry.ID).updatedAt)
          ) {
            uniqueDataMap.set(entry.ID, entry);
          }
        });
        const uniqueData = Array.from(uniqueDataMap.values());

        setTableData(uniqueData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenClick = async (customerId) => {
    try {
      const response = await Axios.get(
        `https://titan-api-v2uu.onrender.com/admin/user/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      const newPageUrl = `/user/${customerId}`;
      window.location.href = newPageUrl;
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  return (
    <div className="overflow-y-auto w-full h-screen p-4 mb-10">
      {/* Filter input */}
      <input
        type="text"
        value={filterID}
        onChange={(e) => setFilterID(e.target.value)}
        placeholder="Filter by ID..."
        className="p-2 border rounded mb-4"
        style={{ marginLeft: "10px" }}
      />
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter by name..."
        className="p-2 border rounded mb-4"
        style={{ marginLeft: "10px" }}
      />
      <input
        type="text"
        value={filterPhone}
        onChange={(e) => setFilterPhone(e.target.value)}
        placeholder="Filter by Phone..."
        className="p-2 border rounded mb-4"
        style={{ marginLeft: "10px" }}
      />
      <input
        type="text"
        value={filterDOB}
        onChange={(e) => setFilterDOB(e.target.value)}
        placeholder="Filter by Dob..."
        className="p-2 border rounded mb-4"
        style={{ marginLeft: "10px" }}
      />

      <table className="text-center w-full border-collapse">
        <thead>
          <tr className="sticky top-0.1">
            {TABLE_HEAD.map(({ label, icon }) => (
              <th
                key={label}
                className="border border-black-800 bg-gray-50 p-4"
              >
                <div className="flex items-center justify-center gap-1">
                  <FontAwesomeIcon
                    icon={icon}
                    className="text-green-gray-500 h-3 w-3"
                  />
                  <span className="font-normal leading-none opacity-70">
                    {label}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody onScroll={(e) => handleScroll(e)}>
          {Array.isArray(tableData) && tableData.length > 0 ? (
            tableData
              .sort((a, b) => b.ID - a.ID) // Sort in descending order by ID
              .filter(
                (rowData) =>
                  rowData.NAME &&
                  rowData.NAME.toLowerCase().includes(filter.toLowerCase())
              )
              .filter(
                (rowData) =>
                  filterID ? rowData.ID === parseInt(filterID) : true // Exact match for ID
              )
              .filter(
                (rowData) =>
                  rowData.PHONE && rowData.PHONE.includes(filterPhone)
              )
              .filter((rowData) => {
                // Check if the DOB exists and convert it to 'DD/MM/YYYY' format
                if (rowData.DOB) {
                  const formattedDOB = new Date(rowData.DOB).toLocaleDateString(
                    "en-GB"
                  );
                  return formattedDOB.includes(filterDOB);
                }
                return false;
              })

              .map((rowData, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : ""
                  } border-b border-blue-gray-800`}
                >
                  <td className="p-4 border-l border-r border-blue-gray-800">
                    {rowData.ID}
                  </td>
                  <td className="p-4 border-l border-r border-blue-gray-800">
                    {rowData.NAME}
                  </td>
                  <td className="p-4 border-l border-r border-blue-gray-800">
                    {rowData.PHONE}
                  </td>
                  <td className="p-4 border-l border-r border-gray-300">
                    {new Date(rowData.DOB).toLocaleDateString()}
                  </td>
                  <td className="p-4 border-l border-r border-gray-300">
                    <div className="relative z-10">
                      <Chip
                        variant="ghost"
                        size="sm"
                        value={rowData.STATUS === 1 ? "Active" : "Non-Active"}
                        color={rowData.STATUS === 1 ? "green" : "blue-gray"}
                        className="text-gray-800"
                      />
                    </div>
                  </td>
                  <td className="p-4 border-l border-r border-gray-300">
                    <button
                      className="text-gray-800 bg-green-200 px-3 py-1 rounded-md cursor-pointer hover:bg-green-300"
                      onClick={() => handleOpenClick(rowData.ID)}
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan={TABLE_HEAD.length} className="p-4 text-center">
                <Loading />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Tablegym;
