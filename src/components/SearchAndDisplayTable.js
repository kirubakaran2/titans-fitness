import React, { useState, useEffect } from "react";
import Axios from "axios";
import SearchForm from "./SearchForm";
import Tablegym from "./Tablegym";

const SearchAndDisplayTable = () => {
  const [searchResults, setSearchResults] = useState([]);

  const handleSubmit = async (searchCriteria) => {
    try {
      const response = await Axios.get("https://titan-api-v2uu.onrender.com/admin/user", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        params: searchCriteria,
      });
      setSearchResults(response.data.users);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <SearchForm onSubmit={handleSubmit} />
      <Tablegym tableData={searchResults} />
    </div>
  );
};

export default SearchAndDisplayTable;
