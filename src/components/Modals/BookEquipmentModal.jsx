import React, { useState } from 'react';
import { X, Calendar, CheckCircle2, Tractor, Clock } from 'lucide-react';

export default function BookEquipmentModal({ isOpen, onClose, equipment }) {
  const [bookingDate, setBookingDate] = useState('2026-10-12');
  const [duration, setDuration] = useState(4); // hours or acres
  const [bookingType, setBookingType] = useState('hours'); // hours or acres
  const [farmerName, setFarmerName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen || !equipment) return null;

  const unitRate = bookingType === 'hours' && equipment.ratePerHour 
    ? equipment.ratePerHour 
    : (equipment.ratePerAcre || equipment.ratePerHour || 600);

  const totalEstimate = duration * unitRate;

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade">
        <div className="modal-header">
          <div className="modal-header-title">
            <Tractor size={22} className="modal-icon-green" />
            <div>
              <h3>Book Farm Machinery (कृषि यंत्र बुकिंग)</h3>
              <p>{equipment.name} • Owner: <b>{equipment.ownerName}</b></p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {confirmed ? (
          <div className="modal-success-state">
            <CheckCircle2 size={54} className="success-icon" />
            <h3>Machinery Booking Requested!</h3>
            <p>
              Your booking for <b>{equipment.name}</b> on <b>{bookingDate}</b> has been received. 
              The owner <b>{equipment.ownerName}</b> ({equipment.phone}) has been notified.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-row two-cols">
              <div className="form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jaswinder Singh"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row two-cols">
              <div className="form-group">
                <label>Preferred Booking Date *</label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Billing Method</label>
                <select
                  value={bookingType}
                  onChange={(e) => setBookingType(e.target.value)}
                  className="form-select"
                >
                  {equipment.ratePerHour && <option value="hours">By Hours (प्रति घंटा)</option>}
                  {equipment.ratePerAcre && <option value="acres">By Acres (प्रति एकड़)</option>}
                </select>
              </div>
            </div>

            <div className="form-row two-cols">
              <div className="form-group">
                <label>Required {bookingType === 'hours' ? 'Hours' : 'Acres'} *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Farm / Field Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tubewell field, near GT Road"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="earnings-preview-box">
              <div>
                <span className="earnings-label">Estimated Rental Cost:</span>
                <div className="earnings-amount">
                  ₹{totalEstimate.toLocaleString()}
                  <span className="net-tag">({duration} {bookingType} @ ₹{unitRate})</span>
                </div>
              </div>
            </div>

            <div className="modal-actions-row">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Confirm Machinery Booking
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
