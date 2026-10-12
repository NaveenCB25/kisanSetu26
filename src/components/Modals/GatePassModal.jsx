import React from 'react';
import { X, Printer, ShieldCheck, QrCode, MapPin, Calendar, Clock, Truck, User } from 'lucide-react';

export default function GatePassModal({ isOpen, onClose, token }) {
  if (!isOpen || !token) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade gate-pass-modal-content">
        <div className="modal-header">
          <div className="modal-header-title">
            <ShieldCheck size={22} className="modal-icon-green" />
            <div>
              <h3>Official Digital Gate Pass (डिजिटल गेट पास)</h3>
              <p>Government of India • Department of Food & Public Distribution</p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Printable Pass Body */}
        <div className="gate-pass-body" id="printable-gate-pass">
          <div className="gate-pass-top-band">
            <div className="pass-emblem-text">
              <span className="pass-gov-title">APMC PROCUREMENT & QUEUE REGULATION</span>
              <span className="pass-sub-title">KISANSETU SMART MANDI DISPATCH PASS</span>
            </div>
            <div className="pass-status-stamp">
              VERIFIED ENTRY
            </div>
          </div>

          <div className="gate-pass-token-hero">
            <span className="pass-token-label">TOKEN NUMBER</span>
            <div className="pass-token-number">{token.tokenNumber}</div>
            <span className="pass-token-status">STATUS: {token.status.replace('_', ' ')}</span>
          </div>

          <div className="gate-pass-grid">
            <div className="pass-detail-col">
              <div className="pass-item">
                <span className="pass-label">Farmer Name:</span>
                <span className="pass-val"><b>{token.farmerName}</b></span>
              </div>
              <div className="pass-item">
                <span className="pass-label">Aadhaar Verification:</span>
                <span className="pass-val">Linked (•••• {token.farmerAadhaarLast4}) ✓</span>
              </div>
              <div className="pass-item">
                <span className="pass-label">Registered Mobile:</span>
                <span className="pass-val">+91 {token.phone}</span>
              </div>
              <div className="pass-item">
                <span className="pass-label">Village / Taluk:</span>
                <span className="pass-val">{token.village}, {token.taluk || 'Not specified'}</span>
              </div>
              <div className="pass-item">
                <span className="pass-label">District / State:</span>
                <span className="pass-val">{token.district}{token.state ? `, ${token.state}` : ''}</span>
              </div>
            </div>

            <div className="pass-detail-col">
              <div className="pass-item">
                <span className="pass-label">Procurement Mandi:</span>
                <span className="pass-val"><b>{token.mandiName}</b></span>
              </div>
              <div className="pass-item">
                <span className="pass-label">Crop & Quota:</span>
                <span className="pass-val"><b>{token.crop}</b> ({token.estimatedQuantityQtl} Quintals)</span>
              </div>
              <div className="pass-item">
                <span className="pass-label">Vehicle Registration:</span>
                <span className="pass-val highlight-veh"><b>{token.vehicleNumber}</b></span>
              </div>
              <div className="pass-item">
                <span className="pass-label">Scheduled Arrival:</span>
                <span className="pass-val">{token.scheduledDate} ({token.scheduledSlot})</span>
              </div>
            </div>
          </div>

          {/* QR Code Block */}
          <div className="gate-pass-qr-section">
            <div className="qr-box-frame">
              {/* High fidelity SVG simulated QR code */}
              <svg width="110" height="110" viewBox="0 0 110 110" className="gate-pass-qr-svg">
                <rect width="110" height="110" fill="#ffffff" />
                {/* Outer corners */}
                <rect x="10" y="10" width="28" height="28" fill="#14532d" />
                <rect x="14" y="14" width="20" height="20" fill="#ffffff" />
                <rect x="18" y="18" width="12" height="12" fill="#14532d" />

                <rect x="72" y="10" width="28" height="28" fill="#14532d" />
                <rect x="76" y="14" width="20" height="20" fill="#ffffff" />
                <rect x="80" y="18" width="12" height="12" fill="#14532d" />

                <rect x="10" y="72" width="28" height="28" fill="#14532d" />
                <rect x="14" y="76" width="20" height="20" fill="#ffffff" />
                <rect x="18" y="80" width="12" height="12" fill="#14532d" />

                {/* Simulated Data matrix points */}
                <rect x="44" y="14" width="6" height="6" fill="#14532d" />
                <rect x="56" y="14" width="6" height="6" fill="#14532d" />
                <rect x="44" y="26" width="6" height="6" fill="#14532d" />
                <rect x="52" y="32" width="6" height="6" fill="#14532d" />
                <rect x="14" y="44" width="6" height="6" fill="#14532d" />
                <rect x="24" y="44" width="6" height="6" fill="#14532d" />
                <rect x="36" y="44" width="6" height="6" fill="#14532d" />
                <rect x="48" y="44" width="14" height="6" fill="#14532d" />
                <rect x="68" y="44" width="6" height="6" fill="#14532d" />
                <rect x="80" y="44" width="6" height="6" fill="#14532d" />
                <rect x="90" y="44" width="6" height="6" fill="#14532d" />
                <rect x="44" y="56" width="6" height="6" fill="#14532d" />
                <rect x="56" y="56" width="10" height="6" fill="#14532d" />
                <rect x="72" y="56" width="6" height="6" fill="#14532d" />
                <rect x="88" y="56" width="6" height="6" fill="#14532d" />
                <rect x="44" y="72" width="6" height="6" fill="#14532d" />
                <rect x="54" y="80" width="6" height="6" fill="#14532d" />
                <rect x="72" y="72" width="12" height="6" fill="#14532d" />
                <rect x="72" y="84" width="6" height="12" fill="#14532d" />
                <rect x="88" y="80" width="12" height="12" fill="#14532d" />
              </svg>
            </div>
            <div className="qr-instructions">
              <h4>Mandi Gate Entry Protocol:</h4>
              <ul>
                <li>Show this QR pass to Security at Gate #1 on arrival.</li>
                <li>Driver must carry Original Aadhaar and Land Registration document.</li>
                <li>Ensure crop moisture is within FAQ tolerance (&lt; 12.0%) to avoid dockage.</li>
                <li>Do not park outside highway shoulder; proceed directly to designated yard bay.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="modal-actions-row">
          <button type="button" onClick={onClose} className="btn-secondary">
            Close
          </button>
          <button type="button" onClick={handlePrint} className="btn-primary">
            <Printer size={17} />
            <span>Print / Save Gate Pass PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
