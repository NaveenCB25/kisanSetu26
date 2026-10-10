import React, { useState } from 'react';
import { X, Gavel, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function BidModal({ isOpen, onClose, produce, onPlaceBid }) {
  const [buyerName, setBuyerName] = useState('');
  const [phone, setPhone] = useState('');
  const [bidPrice, setBidPrice] = useState(produce ? produce.pricePerQuintal : 0);
  const [bidQuantity, setBidQuantity] = useState(produce ? produce.quantity : 10);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !produce) return null;

  const orderTotal = (bidPrice || 0) * (bidQuantity || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onPlaceBid(produce.id, Number(bidPrice));
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade">
        <div className="modal-header">
          <div className="modal-header-title">
            <Gavel size={22} className="modal-icon-green" />
            <div>
              <h3>Place Direct Buyer Offer (खरीदार बोली / खरीद प्रस्ताव)</h3>
              <p>Lot: <b>{produce.cropName}</b> ({produce.variety})</p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="modal-success-state">
            <CheckCircle2 size={54} className="success-icon" />
            <h3>Offer Transmitted to Farmer!</h3>
            <p>
              Your bid of <b>₹{Number(bidPrice).toLocaleString()}/Qtl</b> for <b>{bidQuantity} Quintals</b> has been notified to <b>{produce.farmerName}</b> via SMS/WhatsApp.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-row two-cols">
              <div className="form-group">
                <label>Buyer / Trader / Firm Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Agri Traders / Sunil Aggarwal"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Contact Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9812345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row two-cols">
              <div className="form-group">
                <label>Offer Price (₹ per Quintal) *</label>
                <input
                  type="number"
                  min="100"
                  required
                  value={bidPrice}
                  onChange={(e) => setBidPrice(e.target.value)}
                  className="form-input"
                />
                <span className="form-hint">Farmer Asking Rate: ₹{produce.pricePerQuintal}/Qtl</span>
              </div>
              <div className="form-group">
                <label>Quantity Required (Quintals) *</label>
                <input
                  type="number"
                  min="1"
                  max={produce.quantity}
                  required
                  value={bidQuantity}
                  onChange={(e) => setBidQuantity(e.target.value)}
                  className="form-input"
                />
                <span className="form-hint">Max Available: {produce.quantity} Quintals</span>
              </div>
            </div>

            <div className="form-group">
              <label>Delivery Terms or Message to Farmer</label>
              <textarea
                rows="2"
                placeholder="e.g. Immediate ex-farm loading requested, payment via RTGS/NEFT within 24 hours of weighbridge receipt."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="form-input"
              ></textarea>
            </div>

            {/* Total Order Calculation */}
            <div className="earnings-preview-box">
              <div>
                <span className="earnings-label">Calculated Transaction Value:</span>
                <div className="earnings-amount">
                  ₹{orderTotal.toLocaleString()} 
                  <span className="net-tag">(Escrow Protected Trade)</span>
                </div>
              </div>
            </div>

            <div className="modal-actions-row">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Confirm & Send Offer to Farmer
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
