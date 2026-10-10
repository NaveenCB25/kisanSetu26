import React, { useState } from 'react';
import { X, Calendar, Truck, ShieldCheck, Calculator, Sparkles, CheckCircle2 } from 'lucide-react';
import { configuredMandis, officialMSPRates } from '../../data/procurementData';
import confetti from 'canvas-confetti';

export default function BookSlotModal({ isOpen, onClose, onBookSlot }) {
  const [formData, setFormData] = useState({
    farmerName: 'Sardar Baldev Singh',
    farmerAadhaarLast4: '7823',
    phone: '9876543210',
    village: 'Samrala',
    district: 'Ludhiana',
    mandiId: 'mandi-khanna',
    crop: 'Wheat (गेहूं)',
    estimatedQuantityQtl: 80,
    vehicleType: 'Tractor Trolley (Double Axle)',
    vehicleNumber: 'PB-10-CZ-4412',
    scheduledDate: '2026-10-11',
    scheduledSlot: '09:00 AM - 11:00 AM'
  });

  const [confirmedToken, setConfirmedToken] = useState(null);

  if (!isOpen) return null;

  // Selected crop MSP
  const selectedCropObj = officialMSPRates.find((c) => c.crop === formData.crop) || officialMSPRates[0];
  const mspRate = selectedCropObj.mspRate;
  const estimatedPayout = (formData.estimatedQuantityQtl || 0) * mspRate;

  const handleSubmit = (e) => {
    e.preventDefault();
    const tokenSeq = Math.floor(100 + Math.random() * 900);
    const newToken = {
      ...formData,
      id: `tok-${Date.now()}`,
      tokenNumber: `KST-${tokenSeq}`,
      mandiName: configuredMandis.find((m) => m.id === formData.mandiId)?.name || 'Khanna Central Grain Market',
      status: 'SCHEDULED',
      currentBay: null,
      gateCheckInTime: null,
      estimatedWaitMins: 30,
      priority: 'Normal'
    };

    onBookSlot(newToken);
    setConfirmedToken(newToken);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback
    }
  };

  const handleClose = () => {
    setConfirmedToken(null);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade">
        <div className="modal-header">
          <div className="modal-header-title">
            <Calendar size={22} className="modal-icon-green" />
            <div>
              <h3>Book Mandi Procurement Slot (खरीद स्लॉट बुकिंग)</h3>
              <p>Transparent queue token scheduling — zero roadside waiting.</p>
            </div>
          </div>
          <button onClick={handleClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {confirmedToken ? (
          <div className="modal-success-state">
            <CheckCircle2 size={56} className="success-icon" />
            <div className="confirmed-token-pill">
              <span className="token-lbl">Your Digital Token Number:</span>
              <div className="token-big-num">{confirmedToken.tokenNumber}</div>
            </div>
            <h3>Slot Booked Successfully!</h3>
            <p>
              Your tractor-trolley <b>{confirmedToken.vehicleNumber}</b> is scheduled at{' '}
              <b>{confirmedToken.mandiName}</b> on <b>{confirmedToken.scheduledDate}</b> during{' '}
              <b>{confirmedToken.scheduledSlot}</b>.
            </p>
            <div className="confirmed-meta-box">
              <span>🌾 Crop: <b>{confirmedToken.crop}</b> ({confirmedToken.estimatedQuantityQtl} Qtl)</span>
              <span>💰 Estimated MSP Value: <b>₹{estimatedPayout.toLocaleString()}</b></span>
              <span>📱 SMS confirmation sent to: <b>+91 {confirmedToken.phone}</b></span>
            </div>
            <button onClick={handleClose} className="btn-primary mt-3">
              View Digital Gate Pass & Token
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            {/* Farmer Identity */}
            <div className="form-row two-cols">
              <div className="form-group">
                <label>Farmer Name *</label>
                <input
                  type="text"
                  required
                  value={formData.farmerName}
                  onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Mobile Number (for SMS token) *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row two-cols">
              <div className="form-group">
                <label>Village & District *</label>
                <input
                  type="text"
                  required
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Aadhaar Card (Last 4 Digits) *</label>
                <input
                  type="text"
                  maxLength="4"
                  required
                  value={formData.farmerAadhaarLast4}
                  onChange={(e) => setFormData({ ...formData, farmerAadhaarLast4: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            {/* Mandi & Crop Selection */}
            <div className="form-row two-cols">
              <div className="form-group">
                <label>Select APMC Procurement Mandi *</label>
                <select
                  value={formData.mandiId}
                  onChange={(e) => setFormData({ ...formData, mandiId: e.target.value })}
                  className="form-select"
                >
                  {configuredMandis.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.district}, {m.state})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Procurement Crop (MSP Configured) *</label>
                <select
                  value={formData.crop}
                  onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                  className="form-select"
                >
                  {officialMSPRates.map((c) => (
                    <option key={c.id} value={c.crop}>
                      {c.crop} — ₹{c.mspRate}/Qtl
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quantity & Vehicle Info */}
            <div className="form-row two-cols">
              <div className="form-group">
                <label>Estimated Quantity (Quintals) *</label>
                <input
                  type="number"
                  min="5"
                  max={selectedCropObj.dailyQuotaPerFarmerQtl || 200}
                  required
                  value={formData.estimatedQuantityQtl}
                  onChange={(e) => setFormData({ ...formData, estimatedQuantityQtl: Number(e.target.value) })}
                  className="form-input"
                />
                <span className="form-hint">Daily Quota Cap: {selectedCropObj.dailyQuotaPerFarmerQtl} Qtl</span>
              </div>

              <div className="form-group">
                <label>Vehicle Registration Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PB-10-CZ-4412"
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                  className="form-input"
                />
              </div>
            </div>

            {/* Slot Timing */}
            <div className="form-row two-cols">
              <div className="form-group">
                <label>Preferred Date *</label>
                <input
                  type="date"
                  required
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Arrival Slot Window *</label>
                <select
                  value={formData.scheduledSlot}
                  onChange={(e) => setFormData({ ...formData, scheduledSlot: e.target.value })}
                  className="form-select"
                >
                  <option value="07:00 AM - 09:00 AM">07:00 AM - 09:00 AM (Early Batch)</option>
                  <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM (Morning Batch)</option>
                  <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM (Noon Batch)</option>
                  <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM (Afternoon Batch)</option>
                  <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM (Evening Batch)</option>
                </select>
              </div>
            </div>

            {/* MSP Calculation Box */}
            <div className="earnings-preview-box">
              <Calculator size={24} className="calc-icon" />
              <div>
                <span className="earnings-label">Official MSP Payout Estimate:</span>
                <div className="earnings-amount">
                  ₹{estimatedPayout.toLocaleString()}
                  <span className="net-tag">({formData.estimatedQuantityQtl} Qtl × ₹{mspRate}/Qtl)</span>
                </div>
              </div>
            </div>

            <div className="modal-actions-row">
              <button type="button" onClick={handleClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <Sparkles size={17} />
                <span>Confirm Slot & Generate Token</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
