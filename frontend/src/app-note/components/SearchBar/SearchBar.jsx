import React from "react";
import "./SearchBar.css";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="searchCont">
      <input
        type="text"
        placeholder="Search Notes"
        value={value}
        onChange={(e) => {
          onChange(e);
          if (e.target.value.trim() === "") {
            onClearSearch(); // Reset notes if input is empty
          } else {
            handleSearch();
          }
        }}
      />
      {value && <IoMdClose className="close-icon" onClick={onClearSearch} />}
      <FaMagnifyingGlass className="search-icon" onClick={handleSearch} />
    </div>
  );
};

export default SearchBar;
