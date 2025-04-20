import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./AttorneyDashboard.css";

export default function AttorneyDashboard() {
  const [email, setEmail] = useState("");
  const [requestsData, setRequestsData] = useState([]);
  const hasSentEmail = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasSentEmail.current) return;
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setEmail(storedUser.email);
      sendEmailToBackend(storedUser.email);
      hasSentEmail.current = true;
    }
  }, []);

  const sendEmailToBackend = async (email) => {
    try {
      const response = await fetch("http://localhost:5000/attorney-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.cases) {
        setRequestsData(data.cases);
      }
    } catch (error) {
      console.error("Error fetching cases:", error);
    }
  };

  const handleViewClick = (request) => {
    navigate(`/request/${request.id}`, { state: { request } });
  };

  // Filter and sort the cases that are not "Pending" in descending order
  const filteredRequestsData = requestsData
    .filter((request) => request.status !== "Pending")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by the 'createdAt' field in descending order

  // Reverse the order to make the newest at the top
  const reversedRequestsData = [...filteredRequestsData].reverse();

  return (
    <div className="dashboard-container">
      <div className="overview-box">
        <h2>Attorney Dashboard</h2>
        <div className="stats">
          <div className="stat-item">
            <p className="number">{reversedRequestsData.length}</p>
            <p>Total Requests</p>
          </div>
          <div className="stat-item respond">
            <p className="number">
              {reversedRequestsData.filter(
                (request) => request.status !== "pending"
              ).length}
            </p>
            <p>Responded</p>
          </div>
        </div>
      </div>

      <div className="requests-box">
        <div className="requests-header">
          <h3>Requests</h3>
        </div>

        <table>
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Category</th>
              <th>City</th>
              <th>Main Issue</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reversedRequestsData.map((request, index) => (
              <tr key={index}>
                <td>{request.clientName}</td>
                <td>{request.caseCategory}</td>
                <td>{request.city}</td>
                <td className="issue">{request.shortSummary}</td>
                <td>
                  <span className="status-tag">{request.status}</span>
                </td>
                <td>
                  <button
                    className={`view-btn ${
                      request.status === "Completed" ? "completed" : ""
                    }`}
                    onClick={() => handleViewClick(request)}
                    disabled={
                      request.status === "Rejected" || request.status === "Completed"
                    }
                    title={
                      request.status === "Rejected"
                        ? "This case has been rejected"
                        : request.status === "Completed"
                        ? "Case completed"
                        : ""
                    }
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
