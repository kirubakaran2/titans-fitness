import React, { useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';

const Punchinform = () => {
  const [searchId, setSearchId] = useState("");
  const [matchingUser, setMatchingUser] = useState(null);

  const handleSearchChange = (event) => {
    setSearchId(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams({
      searchId: searchId,
    });
  
    const url = `http://54.175.94.211:8080/admin/user/searching?${searchParams.toString()}`;
  
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        const data = response.data.user;
        const firstThreeResults = data; // Get only the first three results
  
  
        // Find the user with the specified memberID
        const matchingUser = firstThreeResults.find(user => user.ID === parseInt(searchId, 10));
  
        if (matchingUser) {
          setMatchingUser(matchingUser); // Update the state with the matching user
        } else {
          setMatchingUser(null); // Reset the matching user if not found
        }
      } else {
        console.error('Error fetching search results:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }    
  };
  
  

  return (
    <div>
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={searchId}
          onChange={handleSearchChange}
          placeholder="Enter Member ID"
          className="border rounded px-2 py-1"
        />
        <button onClick={handleSubmit} className="btn">
          <FontAwesomeIcon icon={faSearch} className="mr-1" />
          Search
        </button>
      </div>
      
      {/* Display matching user details */}
      {matchingUser && (
        <div className="mt-8">
          <h3 className="text-lg font-medium">Matching User Details</h3>
          <div className="bg-gray-100 p-4 rounded-md">
            <p><strong>ID:</strong> {matchingUser.ID}</p>
            <p><strong>Name:</strong> {matchingUser.NAME}</p>
            <p><strong>Mobile Number:</strong> {matchingUser.PHONE}</p>
            <p><strong>Date of Birth:</strong> {matchingUser.DOB ? matchingUser.DOB.substring(0, 10) : ''}</p>
            <p><strong>Status:</strong> {matchingUser.STATUS === 1 ? "ACTIVE" : "NON-ACTIVE"}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Punchinform;
