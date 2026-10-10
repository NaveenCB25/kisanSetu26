import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  Clock, 
  Truck, 
  FileText, 
  ShieldCheck, 
  Landmark, 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  PlusCircle, 
  Layers,
  Award
} from 'lucide-react';

export default function FarmerPortal({ 
  tokens, 
  receipts, 
  onOpenBookModal, 
  onViewGatePass, 
  onViewReceipt 
}) {
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'bookings', 'receipts', 'payments'

  // Pick active token (e.g. Sardar Baldev Singh's token #KST-101 or first active)
  const activeToken = tokens.find((t) => t.status !== 'COMPLETED') || tokens[0];
  const myCompletedReceipts = receipts;

  return (
    <div className="farmer-portal-page animate-fade">
      {/* Farmer Profile Strip */}
      <div className="portal-header-bar glass-panel">
        <div className="farmer-profile-identity">
          <div className="farmer-avatar-circle-large">
            <User size={28} />
          </div>
          <div>
            <div className="farmer-title-row">
              <h2>Sardar Baldev Singh (ਸਰਦਾਰ ਬਲਦੇਵ ਸਿੰਘ)</h2>
              <span className="badge badge-green">
                <CheckCircle2 size={13} /> PM-Kisan & Aadhaar Verified
              </span>
            </div>
            <div className="farmer-meta-line">
              <span>Farmer ID: <b>KST-PB-88419</b></span>
              <span>Village: <b>Samrala, Dist. Ludhiana (Punjab)</b></span>
              <span>Phone: <b>+91 98765 43210</b></span>
              <span>Bank A/c: <b>•••• 4821 (SBI)</b></span>
            </div>
          </div>
        </div>

        <button onClick={onOpenBookModal} className="btn-primary">
          <PlusCircle size={18} />
          <span>Book New Slot</span>
        </button>
      </div>

      {/* Hero Active Booking Banner */}
      {activeToken && (
        <div className="active-token-hero-card glass-panel">
          <div className="active-token-top">
            <div className="token-headline-group">
              <span className="badge badge-amber">Active Scheduled Token</span>
              <div className="token-hero-num">{activeToken.tokenNumber}</div>
              <span className="token-mandi-tag">
                {activeToken.mandiName} • {activeToken.crop}
              </span>
            </div>

            <div className="token-status-pill-box">
              <span className={`status-pill ${activeToken.status === 'CALLED' ? 'calling' : activeToken.status === 'AT_WEIGHBRIDGE' ? 'weighing' : 'scheduled'}`}>
                <span className="dot"></span>
                {activeToken.status.replace('_', ' ')}
              </span>
              <div className="wait-time-tag">
                <Clock size={14} />
                <span>Estimated Wait: <b>{activeToken.estimatedWaitMins} Mins</b></span>
              </div>
            </div>
          </div>

          <div className="active-token-details-grid">
            <div className="token-detail-box">
              <span className="td-label">Vehicle Registration</span>
              <div className="td-val">
                <Truck size={16} />
                <b>{activeToken.vehicleNumber}</b>
              </div>
              <span className="td-sub">{activeToken.vehicleType}</span>
            </div>

            <div className="token-detail-box">
              <span className="td-label">Estimated Lot</span>
              <div className="td-val">
                <b>{activeToken.estimatedQuantityQtl} Quintals</b>
              </div>
              <span className="td-sub">Standard Trolley Load</span>
            </div>

            <div className="token-detail-box">
              <span className="td-label">Arrival Window</span>
              <div className="td-val">
                <Calendar size={16} />
                <b>{activeToken.scheduledDate}</b>
              </div>
              <span className="td-sub">{activeToken.scheduledSlot}</span>
            </div>

            <div className="token-detail-box">
              <span className="td-label">Weighbridge Assignment</span>
              <div className="td-val highlight-bay">
                <b>{activeToken.currentBay || 'Pending Gate Arrival'}</b>
              </div>
              <span className="td-sub">Assigned upon gate check-in</span>
            </div>
          </div>

          <div className="active-token-actions">
            <button 
              onClick={() => onViewGatePass(activeToken)} 
              className="btn-primary view-pass-btn"
            >
              <QrCode size={18} />
              <span>View & Print Digital QR Gate Pass</span>
            </button>
            <div className="gate-instructions-text">
              ⚠️ Please arrive at Mandi Gate #1 between <b>{activeToken.scheduledSlot}</b>. Gate security will scan your QR code.
            </div>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="farmer-tabs-bar">
        <button 
          onClick={() => setActiveTab('active')} 
          className={`farmer-tab-btn ${activeTab === 'active' ? 'active' : ''}`}
        >
          <span>Active Bookings ({tokens.filter(t => t.status !== 'COMPLETED').length})</span>
        </button>
        <button 
          onClick={() => setActiveTab('receipts')} 
          className={`farmer-tab-btn ${activeTab === 'receipts' ? 'active' : ''}`}
        >
          <span>Digital Weighment Slips ({myCompletedReceipts.length})</span>
        </button>
        <button 
          onClick={() => setActiveTab('payments')} 
          className={`farmer-tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
        >
          <span>MSP Direct Bank Payments (DBT)</span>
        </button>
      </div>

      {/* Tab 1: Bookings List */}
      {activeTab === 'active' && (
        <div className="farmer-tab-content animate-fade">
          <div className="farmer-bookings-grid">
            {tokens.map((tok) => (
              <div key={tok.id} className="booking-card glass-panel">
                <div className="booking-card-header">
                  <div>
                    <span className="tok-badge">{tok.tokenNumber}</span>
                    <h3 className="booking-mandi">{tok.mandiName}</h3>
                  </div>
                  <span className={`status-badge-compact ${tok.status.toLowerCase()}`}>
                    {tok.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="booking-specs-row">
                  <div>
                    <span className="b-lbl">Commodity:</span>
                    <span className="b-val">{tok.crop}</span>
                  </div>
                  <div>
                    <span className="b-lbl">Quantity:</span>
                    <span className="b-val">{tok.estimatedQuantityQtl} Qtl</span>
                  </div>
                  <div>
                    <span className="b-lbl">Vehicle:</span>
                    <span className="b-val">{tok.vehicleNumber}</span>
                  </div>
                  <div>
                    <span className="b-lbl">Slot:</span>
                    <span className="b-val">{tok.scheduledSlot}</span>
                  </div>
                </div>

                <div className="booking-card-footer">
                  <span className="wait-pill">⏱️ ~{tok.estimatedWaitMins}m wait</span>
                  <button onClick={() => onViewGatePass(tok)} className="btn-secondary btn-sm-table">
                    <QrCode size={14} />
                    <span>View Gate Pass</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Digital Weighment Slips */}
      {activeTab === 'receipts' && (
        <div className="farmer-tab-content animate-fade">
          <div className="receipts-list-grid">
            {myCompletedReceipts.map((rec) => (
              <div key={rec.slipNumber} className="receipt-summary-card glass-panel">
                <div className="rec-summary-top">
                  <div>
                    <span className="badge badge-green">FCI Certified Slip</span>
                    <h3 className="rec-slip-num">{rec.slipNumber}</h3>
                    <span className="rec-date">{rec.timestamp} • {rec.mandiName}</span>
                  </div>
                  <div className="rec-total-payout">
                    <span className="rec-rupee-lbl">Total MSP Payout</span>
                    <div className="rec-rupee-val">₹{rec.totalPayableAmount.toLocaleString()}</div>
                  </div>
                </div>

                <div className="rec-weights-strip">
                  <div className="weight-stat">
                    <span>Gross Weight:</span>
                    <b>{rec.grossWeightKg.toLocaleString()} Kg</b>
                  </div>
                  <div className="weight-stat">
                    <span>Tare Weight:</span>
                    <b>{rec.tareWeightKg.toLocaleString()} Kg</b>
                  </div>
                  <div className="weight-stat highlight">
                    <span>Net Delivered:</span>
                    <b>{rec.netQuintals.toFixed(2)} Quintals</b>
                  </div>
                  <div className="weight-stat">
                    <span>MSP Rate:</span>
                    <b>₹{rec.mspRate}/Qtl</b>
                  </div>
                </div>

                <div className="rec-summary-footer">
                  <div className="dbt-pill">
                    <Landmark size={14} />
                    <span>DBT Status: <b>{rec.paymentStatus}</b></span>
                  </div>
                  <button onClick={() => onViewReceipt(rec)} className="btn-primary btn-sm-table">
                    <FileText size={15} />
                    <span>View Full Weighment Slip</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Payments Tracker */}
      {activeTab === 'payments' && (
        <div className="farmer-tab-content animate-fade">
          <div className="payments-overview-card glass-panel">
            <div className="payments-stat-row">
              <div className="p-stat">
                <span className="p-lbl">Total Season Procured</span>
                <div className="p-val">172.0 Quintals</div>
              </div>
              <div className="p-stat">
                <span className="p-lbl">Total MSP Amount Realized</span>
                <div className="p-val highlight">₹3,91,300</div>
              </div>
              <div className="p-stat">
                <span className="p-lbl">Credited via DBT</span>
                <div className="p-val">₹3,91,300 (100%)</div>
              </div>
            </div>

            <div className="payment-records-table-wrap">
              <table className="dashboard-mandi-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Slip No.</th>
                    <th>Crop</th>
                    <th>Net Quantity</th>
                    <th>Amount</th>
                    <th>Payment Mode</th>
                    <th>PFMS Reference</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myCompletedReceipts.map((rec) => (
                    <tr key={rec.slipNumber}>
                      <td>{rec.timestamp.split(',')[0]}</td>
                      <td><b>{rec.slipNumber}</b></td>
                      <td>{rec.crop}</td>
                      <td>{rec.finalPayableQuintals} Qtl</td>
                      <td><b>₹{rec.totalPayableAmount.toLocaleString()}</b></td>
                      <td>Aadhaar DBT</td>
                      <td><code>{rec.dbtReferenceId}</code></td>
                      <td>
                        <span className="badge badge-green">
                          <CheckCircle2 size={12} /> {rec.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
