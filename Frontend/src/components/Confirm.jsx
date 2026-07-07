import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { CheckCircle2, ChevronLeft, CreditCard } from 'lucide-react';
import { API_BASE } from '../api';

export default function ConfirmTransaction() {
  const location = useLocation();
  const navigate = useNavigate();
  const transactionData = location.state?.transaction;
  const [showAlert, setShowAlert] = useState(false);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const handleConfirm = async () => {
    setSaving(true);
    try {
      await axios.post(
        `${API_BASE}/transactions/add`,
        { ...transactionData, userId },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save transaction.');
    } finally {
      setSaving(false);
    }
  };

  if (!transactionData) return <p className="text-center mt-5 text-muted">No transaction data found.</p>;

  return (
    <>
      <Navbar />
      
      <div className="container" style={{ marginTop: "6.5rem", marginBottom: "3rem", maxWidth: "550px" }}>
        {showAlert && (
          <div className="alert alert-success d-flex align-items-center gap-2 mb-4 rounded-3 border-0 shadow-sm" role="alert">
            <CheckCircle2 size={18} className="text-success" />
            <div style={{ fontWeight: 600 }}>Transaction confirmed and saved successfully!</div>
          </div>
        )}

        <div className="premium-card p-0 overflow-hidden" style={{
          boxShadow: "var(--shadow-xl)",
          border: "1px solid var(--border-color)",
          borderRadius: "20px"
        }}>
          {/* Receipt Header Banner */}
          <div className="text-center py-4 px-3" style={{
            background: "linear-gradient(135deg, var(--primary), var(--primary-hover))",
            color: "white"
          }}>
            <CreditCard size={32} className="mb-2" />
            <h3 className="m-0 text-white" style={{ fontWeight: 700, fontSize: "1.35rem" }}>Confirm Transaction</h3>
            <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>ID: {transactionData.transactionId}</span>
          </div>

          {/* Receipt Details Container */}
          <div className="p-4" style={{ position: "relative", backgroundColor: "var(--bg-card)" }}>
            
            {/* Perforated lines divider pattern */}
            <div className="d-flex justify-content-between text-muted mb-4" style={{
              borderBottom: "2px dashed var(--border-color)",
              paddingBottom: "1.5rem"
            }}>
              <div>
                <span className="small text-secondary d-block mb-1">TITLE</span>
                <strong className="fs-5" style={{ color: "var(--text-primary)" }}>{transactionData.title}</strong>
              </div>
              <div className="text-end">
                <span className="small text-secondary d-block mb-1">TOTAL AMOUNT</span>
                <strong className="fs-4 text-success">₹{parseFloat(transactionData.amount || 0).toFixed(2)}</strong>
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-6">
                <span className="small text-secondary d-block">Transaction Type</span>
                <strong style={{ color: "var(--text-primary)", textTransform: "capitalize" }}>{transactionData.type}</strong>
              </div>
              <div className="col-6">
                <span className="small text-secondary d-block">Category</span>
                <span className="badge bg-secondary-subtle text-secondary-emphasis mt-1" style={{ fontWeight: 600 }}>{transactionData.category}</span>
              </div>
              <div className="col-6">
                <span className="small text-secondary d-block">Payment Mode</span>
                <strong style={{ color: "var(--text-primary)", textTransform: "uppercase" }}>{transactionData.paymentMode || 'N/A'}</strong>
              </div>
              <div className="col-6">
                <span className="small text-secondary d-block">Paid To</span>
                <strong style={{ color: "var(--text-primary)" }}>{transactionData.paymentTo || 'Self'}</strong>
              </div>
            </div>

            {/* Split Contributors Info */}
            {transactionData.contributors && transactionData.contributors.length > 0 && (
              <div className="p-3 rounded-3 mb-4" style={{
                backgroundColor: "var(--bg-app)",
                border: "1px solid var(--border-color)"
              }}>
                <span className="small text-secondary d-block mb-2" style={{ fontWeight: 600 }}>Split Contributors ID List</span>
                <div className="d-flex flex-wrap gap-2">
                  {transactionData.contributors.map((cId, idx) => (
                    <span key={idx} className="badge bg-primary-subtle text-primary px-2.5 py-1.5 rounded-pill" style={{ fontSize: "0.8rem" }}>
                      {cId}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions Footer */}
            <div className="d-flex flex-column gap-2 mt-4" style={{
              borderTop: "1px solid var(--border-color)",
              paddingTop: "1.5rem"
            }}>
              <button 
                className="btn-premium-primary w-100 py-3" 
                onClick={handleConfirm}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>Saving transaction...</span>
                  </>
                ) : (
                  <span>Save Transaction</span>
                )}
              </button>
              <button 
                className="btn-premium-secondary w-100 py-2.5" 
                onClick={() => navigate(-1)}
                disabled={saving}
              >
                <ChevronLeft size={16} />
                <span>Go Back</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
