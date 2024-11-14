import React, { useState } from "react";
import { Input } from "@material-tailwind/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const UserSearchForm = ({ onSubmit }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [memberID, setMemberID] = useState("");
  const [name, setName] = useState("");
  const handleMemberIDChange = (event) => {
    setMemberID(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams({
      name: name.toLowerCase(),
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
        const firstThreeResults = data.slice(0, 3); 
        setSearchResults(firstThreeResults); 
        onSubmit(firstThreeResults); 
        
      } else {
        console.error('Error fetching search results:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }    
  };
  const handleOpenClick = async (_id) => {
    try {
      const response = await axios.get(`http://54.175.94.211:8080/admin/user/${_id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        const newPageUrl = `/user/${_id}`;
        window.location.href = newPageUrl;
      } else {
        console.error('Error fetching user details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };
  

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center gap-4">
          {/* Input fields */}
          <Input
            type="text"
            value={memberID}
            onChange={handleMemberIDChange}
            placeholder="Member ID"
            size="lg"
            className="px-7 w-48 bg-white border border-gray-300 rounded-md"
            label="Member ID"
          />
          <Input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Name"
            size="lg"
            className="px-7 w-48 bg-white border border-gray-300 rounded-md"
            label="Name"
          />

        </div>
        <div className="flex justify-end mt-5">
          <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded-md ml-auto">
            <FontAwesomeIcon icon={faSearch} className="mr-2 text-lg px-1" />
            Search
          </button>
        </div>
      </form>

      {/* Display search results */}
      <div className="mt-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
  {searchResults && searchResults.length > 0 ? (
    searchResults.map((result, index) => (
      <tr key={index} className="hover:bg-gray-100">
        <td className="px-6 py-4 whitespace-nowrap">{result._id}</td>
        <td className="px-6 py-4 whitespace-nowrap">{result.NAME}</td>
        <td className="px-6 py-4 whitespace-nowrap">{result.PHONE}</td>
        <td className="px-6 py-4 whitespace-nowrap">{result.STATUS === 1 ? "ACTIVE" : "NON-ACTIVE"}</td>
        <td className="px-6 py-4 whitespace-nowrap">
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" className="px-6 py-4 text-center">No results found</td>
    </tr>
  )}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default UserSearchForm;
