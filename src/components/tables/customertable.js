import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import user from "../fi_user.png";
import mobile from "../mobile.png";
import timer from "../fi_calendar.png";
import intime from "../fi_calendar.png";
import out from "../fi_calendar.png";
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
import moneys from "../moneys.png";
import document from "../document.png";
import "../Cssbg/att.css";
const formatTime = (isoTime) => {
  if (!isoTime) return "N/A";
  const date = new Date(isoTime);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const Customertable = () => {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [period, setPeriod] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  const TABLE_HEAD = [
    { field: "ID", label: "Customer ID", img: <img src={user} alt="User" /> },
    { field: "NAME", label: "Name", img: <img src={vector} alt="User" /> },
    {
      field: "PAYMENT_AMOUNT",
      label: "Payment Amount",
      img: <img src={moneys} alt="Payment Amount" />,
    },
    {
      field: "PAYMENT_DATE",
      label: "Payment Date",
      img: <img src={timer} alt="Payment Date" />,
    },
    {
      field: "PAYMENT_TYPE",
      label: "Payment type",
      img: <img src={intime} alt="Payment TYPE" />,
    },
    {
      field: "END_DATE",
      label: "End Date",
      img: <img src={out} alt="End Date" />,
    },
    {
      field: "PAYMENT_STATUS",
      label: "Payment Status",
      img: <img src={timer} alt="Payment Status" />,
    },
    {
      field: "MOBILE_NUM",
      label: "Mobile Num",
      img: <img src={timer} alt="MOBILE NUM" />,
    },
  ];

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, selectedDate]);

  useEffect(() => {
    applyFilter();
  }, [tableData, filter, period]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = `https://titan-api-v2uu.onrender.com/admin/payment`;
      const url = page === 0 ? baseUrl : `${baseUrl}?page=${page + 0}`;
      const response = await Axios.get(url, { headers });
      const transformedData = response.data.customer.map((customer) => ({
        ...customer,
        PAYMENT_DATE: customer.PAYMENT_DATE
          ? new Date(customer.PAYMENT_DATE).toISOString().slice(0, 10)
          : "N/A",
        END_DATE: customer.END_DATE
          ? new Date(customer.END_DATE).toISOString().slice(0, 10)
          : "N/A",
        // PAYMENT_TYPE: customer.PAYMENT_TYPE,
        MOBILE_NUM: customer.PHONE,
      }));

      setTableData(transformedData);
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

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, selectedDate, period]);

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
  return (
    <Box className="overflow-hidden w-full h-screen p-4 mb-10 mr-5 mt-0 overflowX: 'auto'">
      <Box className="mb-4 flex justify-between items-center">
        {/* <CustomDatePicker /> */}
        <Box className="flex gap-2"></Box>
      </Box>
      <div className="flex justify-between items-center mb-4">
        <p className="text-70AB0E-800">Active log</p>
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
        <Button
          onClick={handleNextPage}
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
          Next
        </Button>
      </Box>
      <Box style={{ overflowX: "auto" ,overflowY:"auto"}}>
        <TableContainer
          component={Paper}
          className="table-container"
          style={{
            width: "100%",
          }}
        >
          <Table>
          <TableHead>
  <TableRow>
    {TABLE_HEAD.map(({ field, label, img }) => (
      <TableCell
        key={field}
        align="center"
        sx={{
          border: "1px solid rgba(224, 224, 224, 1)",
          width: "120px",
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis' 
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <img src={img.props.src} className="mr-1" alt={label} />
          {label}
        </Box>
      </TableCell>
    ))}
    <TableCell
      align="center"
      sx={{ 
        border: "1px solid rgba(224, 224, 224, 1)",
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis' 
      }}
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
            sx={{ 
              border: "1px solid rgba(224, 224, 224, 1)",
              whiteSpace: 'nowrap', // Prevent wrapping
              overflow: 'hidden', // Hide overflow
              textOverflow: 'ellipsis' // Add ellipsis if the text is too long
            }}
          >
            {field === "PAYMENT_DATE" || field === "END_DATE"
              ? rowData[field]
              : rowData[field] || "N/A"}
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
    </Box>
  );
};

export default Customertable;
