import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";
import "./TagInput.css";

const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddTag = () => {
    if (inputValue.trim() !== "") {
      setTags([...tags, inputValue]);
      setInputValue(""); // Clear the input field
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <>
      <div>
        {tags?.length > 0 && (
          <div className="tagsContainer">
            {tags.map((tag, index) => (
              <span key={index} className="tag">
                # {tag}
                <button className="removeTagBtn" onClick={() => handleRemoveTag(tag)} >
                  <MdClose />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="tagInput">
        <div className="tagCont">
          <input
            className="inputLabelTag"
            type="text"
            placeholder="Add tags"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />

          <button className="tagButton" onClick={handleAddTag}>
            <MdAdd />
          </button>
        </div>
      </div>
    </>
  );
};

export default TagInput;
