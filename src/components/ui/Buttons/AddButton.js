import React from "react";
import "../../../styles/Buttons.css";

const AddButton = ({ type, onClick, disabled, label }) => (
  <button
    className="customBtn add btn btn-success"
    onClick={onClick}
    type={type}
    disabled={disabled}
  >
    Add
  </button>
);

export default AddButton;
