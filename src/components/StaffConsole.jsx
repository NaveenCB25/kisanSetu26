import React, { useState } from 'react';
import { 
  Scale, 
  Truck, 
  CheckCircle2, 
  QrCode, 
  Search, 
  Volume2, 
  Clock, 
  AlertCircle, 
  FileText, 
  ArrowRight,
  Layers,
  Zap,
  Radio,
  Printer
} from 'lucide-react';
import { officialMSPRates } from '../data/procurementData';

export default function StaffConsole({ 
  tokens, 
  onCheckInToken, 
  onCallToken, 
  onCompleteWeighment, 
  onViewReceipt 
}) {
  const [selectedMandi, setSelectedMandi] = useState('mandi-khanna');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBay, setActiveBay] = useState('Bay 1');

  // Weighbridge Station state
  const [selectedTokenForScale, setSelectedTokenForScale] = useState(
    tokens.find((t) => t.status === 'AT_WEIGHBRIDGE' || t.status === 'CALLED') || tokens[0]
  );
  const [grossWeightKg, setGrossWeightKg] = useState(13450);
  const [tareWeightKg, setTareWeightKg] = useState(3850);
  const [moisturePercent, setMoisturePercent] = useState(11.2);
  const [showSlipSuccess, setShowSlipSuccess] = useState(null);

  // Filter tokens
  const yardQueue = tokens.filter((t) => t.status === 'IN_YARD');
  const atScales = tokens.filter((t) => t.status === 'AT_WEIGHBRIDGE' || t.status === 'CALLED');
  const pendingGate = tokens.filter((t) => t.status === 'SCHEDULED');

  // Weighment calculations
  const netWeightKg = Math.max(0, (grossWeightKg || 0) - (tareWeightKg || 0));
  const netQuintals = netWeightKg / 100;
  
  // Crop MSP lookup
  const cropObj = officialMSPRates.find((c) => c.crop === selectedTokenForScale?.crop) || officialMSPRates[0];
  const totalMSPVal = Math.round(netQuintals * cropObj.mspRate);

  const handleFinishWeighment = (e) => {
    e.preventDefault();
    if (!selectedTokenForScale) return;

    const receiptData = {
      slipNumber: `REC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      tokenNumber: selectedTokenForScale.tokenNumber,
      farmerName: selectedTokenForScale.farmerName,
      farmerAadhaarLast4: selectedTokenForScale.farmerAadhaarLast4 || '4412',
      phone: selectedTokenForScale.phone,
      mandiName: selectedTokenForScale.mandiName,
      crop: selectedTokenForScale.crop,
      vehicleNumber: selectedTokenForScale.vehicleNumber,
      grossWeightKg: Number(grossWeightKg),
      tareWeightKg: Number(tareWeightKg),
      netWeightKg: Number(netWeightKg),
      netQuintals: Number(netQuintals),
      moisturePercent: Number(moisturePercent),
      deductionQuintals: 0,
      finalPayableQuintals: Number(netQuintals),
      mspRate: cropObj.mspRate,
      totalPayableAmount: totalMSPVal,
      procurementAgency: cropObj.procurementAgency,
      weighbridgeOperator: `Operator Balwinder Singh (${activeBay})`,
      timestamp: 'Today, Just Now',
      paymentStatus: 'DBT Queued (Approved for PFMS)',
      bankAccountEnding: '•••• ' + (selectedTokenForScale.farmerAadhaarLast4 || '8812'),
      dbtReferenceId: `DBT-PUN-2026-${Math.floor(100000 + Math.random() * 900000)}`
    };

    onCompleteWeighment(selectedTokenForScale.id, receiptData);
    setShowSlipSuccess(receiptData);
  };

  return (
    <div className="staff-console-page animate-fade">
      {/* Console Header */}
      <div className="portal-header-bar glass-panel staff-header">
        <div>
          <div className="header-badge-row">
            <span className="badge badge-amber">Authorized Operator Station</span>
            <span className="badge badge-green">Weighbridge Bay 1 & 2 Online</span>
          </div>
          <h2>Mandi Weighbridge & Queue Operations Console</h2>
          <p className="console-sub">Khanna Central Grain Market • Operator Desk: #OP-BAY1</p>
        </div>

        <div className="quick-stats-strip">
          <div className="q-stat">
            <span className="q-lbl">In Yard Waiting:</span>
            <span className="q-val">{yardQueue.length} Trolleys</span>
          </div>
          <div className="q-stat">
            <span className="q-lbl">At Scales:</span>
            <span className="q-val highlight">{atScales.length} Active</span>
          </div>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="staff-two-col-grid">
        {/* Left Column: Gate Check-in & Live Queue Controls */}
        <div className="staff-queue-control-col">
          {/* 1. Gate Check-in Barcode / Search Box */}
          <div className="gate-checkin-box glass-panel">
            <div className="box-title-row">
              <QrCode size={20} className="checkin-icon" />
              <h3>Gate Check-In & Arrival Verification</h3>
            </div>
            <p className="box-desc">Enter vehicle plate number or token number from farmer's gate pass.</p>

            <div className="checkin-input-row">
              <input 
                type="text"
                placeholder="e.g. PB-10-CZ-4412 or KST-105"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
              />
              <button 
                onClick={() => {
                  const match = tokens.find(
                    (t) => t.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           t.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase())
                  );
                  if (match) {
                    onCheckInToken(match.id);
                    setSearchQuery('');
                  } else {
                    alert('Token or Vehicle not found in today\'s booking schedule.');
                  }
                }}
                className="btn-primary"
              >
                Verify & Check-In
              </button>
            </div>
          </div>

          {/* 2. Today's Waiting Queue List & Calling Controls */}
          <div className="yard-queue-management-box glass-panel">
            <div className="box-title-row space-between">
              <div>
                <h3>Yard Waiting Queue ({yardQueue.length} Trolleys)</h3>
                <span className="sub-lbl">Ordered by scheduled token order</span>
              </div>
              <span className="badge badge-blue">Yard Bay 1</span>
            </div>

            <div className="yard-tokens-scroll-list">
              {yardQueue.length === 0 ? (
                <div className="empty-yard-note">
                  <CheckCircle2 size={32} className="check-all" />
                  <p>All checked-in trolleys have been called to the weighbridge!</p>
                </div>
              ) : (
                yardQueue.map((t, idx) => (
                  <div key={t.id} className="staff-token-card">
                    <div className="st-left">
                      <div className="st-pos-circle">#{idx + 1}</div>
                      <div>
                        <div className="st-token-title">
                          <b>{t.tokenNumber}</b> • <span className="veh-plate">{t.vehicleNumber}</span>
                        </div>
                        <div className="st-farmer-desc">
                          {t.farmerName} • {t.crop} ({t.estimatedQuantityQtl} Qtl)
                        </div>
                        <span className="st-arrival-time">Gate Entry: {t.gateCheckInTime || '09:30 AM'}</span>
                      </div>
                    </div>

                    <div className="st-actions">
                      <button 
                        onClick={() => onCallToken(t.id, 'Bay 1')} 
                        className="btn-primary btn-call-bay"
                      >
                        <Volume2 size={15} />
                        <span>Call to Bay 1</span>
                      </button>
                      <button 
                        onClick={() => onCallToken(t.id, 'Bay 2')} 
                        className="btn-secondary btn-call-bay"
                      >
                        <span>Call to Bay 2</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 3. Pending Gate Arrival (Scheduled) */}
          <div className="scheduled-pending-box glass-panel">
            <h4 className="sec-sub-heading">Awaiting Gate Arrival Today ({pendingGate.length})</h4>
            <div className="pending-chips-wrap">
              {pendingGate.map((t) => (
                <div key={t.id} className="pending-chip">
                  <span><b>{t.tokenNumber}</b> ({t.vehicleNumber})</span>
                  <button 
                    onClick={() => onCheckInToken(t.id)} 
                    className="btn-chip-checkin"
                    title="Mark Arrived"
                  >
                    Check In
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Weighbridge Bay Station (Gross & Tare Weighing) */}
        <div className="weighbridge-station-col">
          <div className="weighbridge-station-card glass-panel">
            <div className="station-top-bar">
              <div className="station-title">
                <Scale size={24} className="scale-icon-green" />
                <div>
                  <h3>Weighbridge Operational Desk</h3>
                  <span className="station-subtitle">Electronic Gross & Tare Recording Protocol</span>
                </div>
              </div>

              {/* Bay Selector */}
              <div className="bay-selector-tabs">
                <button 
                  onClick={() => setActiveBay('Bay 1')} 
                  className={`bay-btn ${activeBay === 'Bay 1' ? 'active' : ''}`}
                >
                  Bay 1 Scale
                </button>
                <button 
                  onClick={() => setActiveBay('Bay 2')} 
                  className={`bay-btn ${activeBay === 'Bay 2' ? 'active' : ''}`}
                >
                  Bay 2 Scale
                </button>
              </div>
            </div>

            {showSlipSuccess ? (
              <div className="weighment-success-banner animate-fade">
                <CheckCircle2 size={50} className="success-icon" />
                <h3>Procurement Complete & Slip Issued!</h3>
                <p>Digital Weighment Slip <b>{showSlipSuccess.slipNumber}</b> has been generated for <b>{showSlipSuccess.farmerName}</b>.</p>
                <div className="success-slip-summary">
                  <span>Net Quintals: <b>{showSlipSuccess.netQuintals.toFixed(2)} Qtl</b></span>
                  <span>MSP Value: <b>₹{showSlipSuccess.totalPayableAmount.toLocaleString()}</b></span>
                  <span>Payment Status: <b>{showSlipSuccess.paymentStatus}</b></span>
                </div>
                <div className="success-actions-row">
                  <button onClick={() => onViewReceipt(showSlipSuccess)} className="btn-primary">
                    <FileText size={16} />
                    <span>View & Print Slip</span>
                  </button>
                  <button onClick={() => setShowSlipSuccess(null)} className="btn-secondary">
                    Process Next Vehicle
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFinishWeighment} className="weighbridge-form">
                {/* Active Weighbridge Vehicle Selection */}
                <div className="form-group">
                  <label>Vehicle on Scale *</label>
                  <select
                    value={selectedTokenForScale?.id || ''}
                    onChange={(e) => {
                      const found = tokens.find((t) => t.id === e.target.value);
                      if (found) setSelectedTokenForScale(found);
                    }}
                    className="form-select"
                  >
                    {tokens.filter(t => t.status !== 'COMPLETED').map((t) => (
                      <option key={t.id} value={t.id}>
                        [{t.status}] {t.tokenNumber} — {t.vehicleNumber} ({t.farmerName} • {t.crop})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedTokenForScale && (
                  <div className="weighing-vehicle-badge">
                    <Truck size={18} />
                    <div>
                      <b>{selectedTokenForScale.vehicleNumber}</b> ({selectedTokenForScale.vehicleType})
                      <span className="veh-farmer-sub">Farmer: {selectedTokenForScale.farmerName} • Crop: {selectedTokenForScale.crop}</span>
                    </div>
                  </div>
                )}

                {/* Step 1: Gross Weight Entry */}
                <div className="weight-input-block">
                  <div className="form-group">
                    <label>Step 1: Gross Weight (Loaded Vehicle + Crop, in Kg) *</label>
                    <div className="input-with-unit">
                      <input
                        type="number"
                        min="2000"
                        max="60000"
                        required
                        value={grossWeightKg}
                        onChange={(e) => setGrossWeightKg(Number(e.target.value))}
                        className="form-input big-weight-input"
                      />
                      <span className="unit-tag">Kg</span>
                    </div>
                    <span className="form-hint">Scale Sensor: Calibrated ±1 Kg electronic load cell</span>
                  </div>
                </div>

                {/* Step 2: Tare Weight Entry */}
                <div className="weight-input-block">
                  <div className="form-group">
                    <label>Step 2: Tare Weight (Empty Vehicle after Unloading, in Kg) *</label>
                    <div className="input-with-unit">
                      <input
                        type="number"
                        min="500"
                        max="20000"
                        required
                        value={tareWeightKg}
                        onChange={(e) => setTareWeightKg(Number(e.target.value))}
                        className="form-input big-weight-input"
                      />
                      <span className="unit-tag">Kg</span>
                    </div>
                  </div>
                </div>

                {/* Step 3: Moisture Quality */}
                <div className="form-group">
                  <label>Step 3: Moisture Meter Reading (% Moisture)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="5"
                    max="25"
                    value={moisturePercent}
                    onChange={(e) => setMoisturePercent(Number(e.target.value))}
                    className="form-input"
                  />
                  <span className="form-hint">Standard FAQ limit: 12.0% (No moisture cut required)</span>
                </div>

                {/* Live Real-Time Net & MSP Payout Calculation */}
                <div className="calculated-weighment-box">
                  <div className="calc-row">
                    <span>Net Commodity Weight:</span>
                    <b className="calc-net">{netWeightKg.toLocaleString()} Kg ({netQuintals.toFixed(2)} Qtl)</b>
                  </div>
                  <div className="calc-row">
                    <span>Configured MSP Rate:</span>
                    <b>₹{cropObj.mspRate.toLocaleString()} / Quintal</b>
                  </div>
                  <div className="calc-row total-highlight">
                    <span>Total Calculated Payout:</span>
                    <b className="total-rupee-val">₹{totalMSPVal.toLocaleString()}</b>
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full submit-procurement-btn">
                  <CheckCircle2 size={19} />
                  <span>Confirm Weighment & Issue Digital Receipt</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
