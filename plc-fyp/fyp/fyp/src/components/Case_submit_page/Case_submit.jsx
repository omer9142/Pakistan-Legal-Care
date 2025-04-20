import React from "react";
import "./Case_submit.css"; // Import the CSS file

const CaseSubmit = () => {
  return (
    <div className="case-submit-container">
      <h2>Submit Case Details</h2>
      <form>
        <input type="text" placeholder="Full Name" />
        <input type="text" placeholder="Select City" />
        <input type="text" placeholder="Practice" />
        <textarea placeholder="Short Summary " maxLength="30"></textarea>
        <textarea placeholder="Case Details"></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CaseSubmit;
