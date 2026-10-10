import React, { useState } from 'react';
import { X, BellRing, CheckCircle2 } from 'lucide-react';

export default function PriceAlertModal({ isOpen, onClose, mandi }) {
  const [targetPrice, setTargetPrice] = useState(mandi ? mandi.modalPrice + 100 : 2500);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [alertType, setAlertType] = useState('above');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !mandi) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade">
        <div className="modal-header">
          <div className="modal-header-title">
            <BellRing size={22} className="modal-icon-green" />
            <div>
              <h3>Set Mandi Price Alert (मंडी भाव अलर्ट)</h3>
              <p>{mandi.commodity} • {mandi.market} ({mandi.state})</p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {isSaved ? (
          <div className="modal-success-state">
            <CheckCircle2 size={50} className="success-icon" />
            <h3>Alert Set Successfully!</h3>
            <p>You will receive an instant SMS when {mandi.commodity} crosses ₹{targetPrice}/Qtl.</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="modal-form">
            <div className="current-price-badge">
              <span>Today's Modal Price: <b>₹{mandi.modalPrice}/Quintal</b></span>
            </div>

            <div className="form-group">
              <label>Notify me when price goes:</label>
              <select
                value={alertType}
                onChange={(e) => setAlertType(e.target.value)}
                className="form-select"
              >
                <option value="above">Rises Above Target (भाव ऊपर जाने पर)</option>
                <option value="below">Drops Below Target (भाव नीचे गिरने पर)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Target Price (₹ per Quintal) *</label>
              <input
                type="number"
                required
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Mobile Number for Free SMS Alert *</label>
              <input
                type="tel"
                required
                placeholder="e.g. 9876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="modal-actions-row">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Activate Price Alert
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
