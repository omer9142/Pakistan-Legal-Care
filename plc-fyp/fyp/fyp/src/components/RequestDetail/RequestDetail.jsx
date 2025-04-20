import { useLocation, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './RequestDetail.css';

export default function RequestDetail() {
  const { id } = useParams();
  const { state } = useLocation();
  const request = state?.request;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [popupMessage, setPopupMessage] = useState('');
  const [currentStatus, setCurrentStatus] = useState(request?.status || '');

  useEffect(() => {
    if (request) {
      setCurrentStatus(request.status);
    }
  }, [request]);

  useEffect(() => {
    document.body.style.overflow = popupMessage ? 'hidden' : 'auto';
  }, [popupMessage]);

  if (!request || !id) {
    return <p>Request not found!</p>;
  }

  const updateStatus = async (status) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.put(`http://localhost:5000/update-request-status/${id}`, {
        status: status,
      });
      console.log("Response:", response.data);

      setCurrentStatus(status);

      if (status === 'Accepted') {
        setPopupMessage("The case has been accepted successfully. The client will receive a confirmation email with your contact details and will contact you soon");
      } else if (status === 'Rejected') {
        setPopupMessage("The case has been rejected successfully. The client will be informed that their case was not accepted");
      } else if (status === 'Completed') {
        setPopupMessage("The case has been completed successfully. The client will receive a confirmation email.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(`Failed to ${status.toLowerCase()} the request`);
    } finally {
      setLoading(false);
    }
  };

  const handlePopupClose = () => {
    setPopupMessage('');
    navigate('/attorney-dashboard');
  };

  return (
    <div className={`request-detail-page ${popupMessage ? 'popup-active' : ''}`}>
      <div className="page-content">
        <div className="detail-container">
          <h2>Case Details</h2>
          <p><strong>Client Name:</strong> {request.clientName}</p>
          <p><strong>Category:</strong> {request.caseCategory}</p>
          <p><strong>City:</strong> {request.city}</p>
          <p><strong>Main Issue:</strong> {request.shortSummary}</p>
          <p><strong>Detail:</strong> {request.detailSummary}</p>

          {loading && <p>Processing...</p>}
          {error && <p className="error-message">{error}</p>}

          <div className="action-buttons">
            {currentStatus === 'Accepted' ? (
              <button className="complete-btn" onClick={() => updateStatus('Completed')} disabled={loading}>
                Complete
              </button>
            ) : (
              <>
                <button className="accept-btn" onClick={() => updateStatus('Accepted')} disabled={loading}>
                  Accept
                </button>
                <button className="reject-btn" onClick={() => updateStatus('Rejected')} disabled={loading}>
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {popupMessage && (
        <div className="popup-overlay">
          <div className="popup-message">
            <p>{popupMessage}</p>
            <button onClick={handlePopupClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
