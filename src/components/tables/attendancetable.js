import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import user from "../fi_user.png";
import mobile from "../mobile.png";
import timer from "../timer.png";
import intime from "../time-quarter-pass.png";
import out from "../time-quarter.png";
import vector from "../Vector.png";
import Axios from "axios";
import CustomDatePicker from "../custompicker";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  TextField,
} from "@mui/material";
import Loading from "../loading";
import document from "../document.png";
import "../Cssbg/att.css";
const formatTime = (isoTime) => {
  if (!isoTime) return "N/A";
  const date = new Date(isoTime);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const Attendancetable = () => {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [period, setPeriod] = useState("monthly");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterDate, setFilterDate] = useState(new Date());
  const navigate = useNavigate();

  const TABLE_HEAD = [
    { field: "ID", label: "Customer ID", img: <img src={user} alt="User" /> },
    { field: "NAME", label: "Name", img: <img src={vector} alt="User" /> },
    {
      field: "PHONE",
      label: "Mobile No",
      img: <img src={mobile} alt="User" />,
    },
    {
      field: "IN_TIME",
      label: "In Time",
      img: <img src={intime} alt="User" />,
    },
    { field: "OUT_TIME", label: "Out Time", img: <img src={out} alt="User" /> },
    {
      field: "Duration",
      label: "Duration",
      img: <img src={timer} alt="User" />,
    },
    {
      field: "END_DATE",
      label: "END DATE"
    },
    {
      field: "PAYMENT_STATUS",
      label: "PAYMENT STATUS"
    },
  ];

  // useEffect(() => {
  //   fetchData();
  // }, [page, rowsPerPage, selectedDate]);

  useEffect(() => {
    applyFilter();
  }, [tableData, filter, period]);

  useEffect(() => {
   async function call() {
     try {
      setIsLoading(true);
      const token = sessionStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = `https://titan-api-v2uu.onrender.com/admin/attendance/${period}?date=${new Date(filterDate).toISOString().slice(0,10)}`
      const url = page === 0 ? baseUrl : `${baseUrl}&page=${page + 1}`;
      const response = await Axios.get(url, { headers });
      setTableData(response.data.user);
      setIsLoading(false);
    }
    catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
   }
   call()
  }, [filterDate, page, period])

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      
      // Determine the base URL based on the selected period
      const baseUrl = `https://titan-api-v2uu.onrender.com/admin/attendance${period ? `/${period}` : ''}`;
      const url = page === 0 ? baseUrl : `${baseUrl}?page=${page + 1}`;
  
      const response = await Axios.get(url, { headers });
      setTableData(response.data.customer);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };
  
  const handlePeriodClick = (selectedPeriod) => {
    setPeriod(selectedPeriod);
    setPage(0);
  };
  
  // useEffect(() => {
  //   fetchData();
  // }, [page, rowsPerPage, selectedDate, period]);
  

  const handleDownloadExcel = (tableData) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(tableData);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "table_data.xlsx");
  };

const applyFilter = () => {
  if (!tableData || !Array.isArray(tableData)) return;
  
  let filteredResults = tableData.filter(
    (rowData) =>
      rowData.NAME.toLowerCase().includes(filter.toLowerCase()) ||
      rowData.ID.toString().includes(filter)
  );

  if (period === "morning") {
    filteredResults = filteredResults.filter((rowData) => {
      const inTime = new Date(rowData.IN_TIME).getHours();
      return inTime >= 0 && inTime < 12; // Morning session
    });
  } else if (period === "evening") {
    filteredResults = filteredResults.filter((rowData) => {
      const inTime = new Date(rowData.IN_TIME).getHours();
      return inTime >= 12; // Evening session
    });
  }

  setFilteredData(filteredResults);
};


  const handleOpenClick = async (customerId) => {
    try {
      await Axios.get(
        `https://titan-api-v2uu.onrender.com/admin/user/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      const newPageUrl = `/user/${customerId}`;
      navigate(newPageUrl);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(0);
  };

  const calculateDuration = (inTime, outTime) => {
    if (!inTime || !outTime) return "N/A";

    const inDate = new Date(inTime);
    const outDate = new Date(outTime);

    const duration = Math.abs(outDate - inDate);

    const minutes = Math.floor((duration / 1000 / 60) % 60);
    const hours = Math.floor(duration / (1000 * 60 * 60));

    const hoursPart = hours > 0 ? `${hours}hr` : "";
    const minutesPart = minutes > 0 ? `${minutes}mins` : "";

    return `${hoursPart} ${minutesPart}`.trim() || "N/A";
  };

  return (
    <Box className="overflow-hidden w-full h-screen p-4 mb-10 mr-5 mt-0">
      <Box className="mb-4 flex justify-between items-center">
          <div className="datepicker-container">
          <label className="datepicker-label">Date</label>
          <div className="datepicker-input-wrapper">
            <input type="date" value={new Date(filterDate).toISOString().slice(0,10)} onChange={e=>{setFilterDate(e.target.value); setPage(0)}} />
          </div>
        </div>
        <Box className="flex gap-2">
          <Button
            onClick={() => handlePeriodClick("morning")}
            variant="contained"
            style={{
              backgroundColor: "white",
              borderRadius: "100px",
              boxShadow:
                "rgba(44, 187, 99, .2) 0 -25px 18px -14px inset, rgba(44, 187, 99, .15) 0 1px 2px, rgba(44, 187, 99, .15) 0 2px 4px, rgba(44, 187, 99, .15) 0 4px 8px, rgba(44, 187, 99, .15) 0 8px 16px, rgba(44, 187, 99, .15) 0 16px 32px",
              color: "green",
              cursor: "pointer",
              padding: "7px 20px",
            }}
          >
            Morning
          </Button>
          <Button
            onClick={() => handlePeriodClick("evening")}
            variant="contained"
            style={{
              backgroundColor: "white",
              borderRadius: "100px",
              boxShadow:
                "rgba(44, 187, 99, .2) 0 -25px 18px -14px inset, rgba(44, 187, 99, .15) 0 1px 2px, rgba(44, 187, 99, .15) 0 2px 4px, rgba(44, 187, 99, .15) 0 4px 8px, rgba(44, 187, 99, .15) 0 8px 16px, rgba(44, 187, 99, .15) 0 16px 32px",
              color: "green",
              cursor: "pointer",
              padding: "7px 20px",
            }}
          >
            Evening
          </Button>
        </Box>
      </Box>
      <div className="flex justify-between items-center mb-4">
        <div className="w-[100px]"></div>
        <button
          onClick={() => handleDownloadExcel(tableData)}
          style={{
            backgroundColor: "white",
            borderRadius: "100px",
            boxShadow:
              "rgba(44, 187, 99, .2) 0 -25px 18px -14px inset, rgba(44, 187, 99, .15) 0 1px 2px, rgba(44, 187, 99, .15) 0 2px 4px, rgba(44, 187, 99, .15) 0 4px 8px, rgba(44, 187, 99, .15) 0 8px 16px, rgba(44, 187, 99, .15) 0 16px 32px",
            color: "green",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: "7px 20px",
            fontSize: "16px",
          }}
        >
          <img srcSet={document} className="mr-1 w-5 h-5" alt="Excel Icon" />
          <span>Excel</span>
        </button>
      </div>
      <Box display="flex" justifyContent="space-between" p={2}>
          <Button
            onClick={handlePreviousPage}
            disabled={page === 0}
            variant="contained"
            color="primary"
            style={{
              backgroundColor: "white",
              borderRadius: "100px",
              boxShadow:
                "rgba(44, 187, 99, .2) 0 -25px 18px -14px inset, rgba(44, 187, 99, .15) 0 1px 2px, rgba(44, 187, 99, .15) 0 2px 4px, rgba(44, 187, 99, .15) 0 4px 8px, rgba(44, 187, 99, .15) 0 8px 16px, rgba(44, 187, 99, .15) 0 16px 32px",
              color: "green",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: "7px 20px",
              fontSize: "16px",
            }}
          >
            Previous
          </Button>
          <Button onClick={handleNextPage} variant="contained" color="primary"
          style={{
            backgroundColor: "white",
            borderRadius: "100px",
            boxShadow:
              "rgba(44, 187, 99, .2) 0 -25px 18px -14px inset, rgba(44, 187, 99, .15) 0 1px 2px, rgba(44, 187, 99, .15) 0 2px 4px, rgba(44, 187, 99, .15) 0 4px 8px, rgba(44, 187, 99, .15) 0 8px 16px, rgba(44, 187, 99, .15) 0 16px 32px",
            color: "green",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: "7px 20px",
            fontSize: "16px",
          }}>
            Next
          </Button>
        </Box>
      <TableContainer component={Paper} className="table-container" style={{ maxHeight: "calc(100vh - 250px)", overflowY: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              {TABLE_HEAD.map(({ field, label, img }) => (
                <TableCell
                  key={field}
                  align="center"
                  sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                   {img && <img src={img?.props?.src} className="mr-1" alt={label} />}
                    {label}
                  </Box>
                </TableCell>
              ))}
              <TableCell
                align="center"
                sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={TABLE_HEAD.length + 1} align="center">
                  <Loading />
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={TABLE_HEAD.length + 1} align="center">
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((rowData) => (
                <TableRow key={rowData.ID} className="table-row">
                  {TABLE_HEAD.map(({ field }) => (
                    <TableCell
                      key={field}
                      align="center"
                      sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}
                    >
                      {field === "IN_TIME" || field === "OUT_TIME" ? (
                        formatTime(rowData[field])
                      ) : field === "Duration" ? (
                        <Box
                          sx={{
                            backgroundColor: "#FFF0BB",
                            padding: "5px 10px",
                            borderRadius: "4px",
                            textAlign: "center",
                          }}
                        >
                          {calculateDuration(rowData.IN_TIME, rowData.OUT_TIME)}
                        </Box>
                      ) : (
                        rowData[field] || "N/A"
                      )}
                    </TableCell>
                  ))}
                  <TableCell
                    align="center"
                    sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => handleOpenClick(rowData.ID)}
                      style={{
                        backgroundColor: "white",
                        borderRadius: "100px",
                        boxShadow:
                          "rgba(44, 187, 99, .2) 0 -25px 18px -14px inset, rgba(44, 187, 99, .15) 0 1px 2px, rgba(44, 187, 99, .15) 0 2px 4px, rgba(44, 187, 99, .15) 0 4px 8px, rgba(44, 187, 99, .15) 0 8px 16px, rgba(44, 187, 99, .15) 0 16px 32px",
                        color: "green",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        padding: "7px 20px",
                        fontSize: "16px",
                      }}
                    >
                      Open
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Attendancetable;
