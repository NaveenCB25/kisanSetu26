import React from 'react';
import { X, Printer, CheckCircle2, FileText, Landmark, Scale, Award } from 'lucide-react';

export default function ReceiptModal({ isOpen, onClose, receipt }) {
  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade receipt-modal-content">
        <div className="modal-header">
          <div className="modal-header-title">
            <FileText size={22} className="modal-icon-green" />
            <div>
              <h3>Digital Weighment & MSP Procurement Slip (डिजिटल तुलाई पर्ची)</h3>
              <p>Certified Electronic Weighbridge Record • Food Corporation of India</p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div className="receipt-body" id="printable-receipt">
          {/* Header */}
          <div className="receipt-top-header">
            <div className="receipt-logo-col">
              <span className="gov-stamp">GOVERNMENT OF INDIA</span>
              <h4>{receipt.mandiName}</h4>
              <span className="proc-agency">Procurement Agency: <b>{receipt.procurementAgency}</b></span>
            </div>
            <div className="receipt-meta-box">
              <div>Slip No: <b>{receipt.slipNumber}</b></div>
              <div>Token: <b className="token-highlight">{receipt.tokenNumber}</b></div>
              <div>Date & Time: {receipt.timestamp}</div>
            </div>
          </div>

          {/* Farmer & Vehicle Info */}
          <div className="receipt-info-strip">
            <div className="info-cell">
              <span className="lbl">Farmer Name:</span>
              <span className="val"><b>{receipt.farmerName}</b> (•••• {receipt.farmerAadhaarLast4})</span>
            </div>
            <div className="info-cell">
              <span className="lbl">Vehicle Number:</span>
              <span className="val"><b>{receipt.vehicleNumber}</b></span>
            </div>
            <div className="info-cell">
              <span className="lbl">Procured Commodity:</span>
              <span className="val"><b>{receipt.crop}</b></span>
            </div>
          </div>

          {/* Electronic Weighbridge Weight Calculation Table */}
          <div className="weight-calc-table-wrap">
            <table className="weight-calc-table">
              <thead>
                <tr>
                  <th>Weighment Stage</th>
                  <th>Recorded Weight (Kg)</th>
                  <th>Remarks / Scale Protocol</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>1. Gross Weight (सकल भार)</b><br /><small>Loaded Tractor + Crop</small></td>
                  <td><b>{receipt.grossWeightKg.toLocaleString()} Kg</b></td>
                  <td>Bay Certified Scale Sensor</td>
                </tr>
                <tr>
                  <td><b>2. Tare Weight (खाली भार)</b><br /><small>Empty Tractor after Unloading</small></td>
                  <td><b>{receipt.tareWeightKg.toLocaleString()} Kg</b></td>
                  <td>Post-dumping Tare Scale</td>
                </tr>
                <tr className="highlight-row">
                  <td><b>3. Net Commodity Weight (शुद्ध भार)</b></td>
                  <td className="net-wt-cell">
                    <b>{receipt.netWeightKg.toLocaleString()} Kg</b>
                    <span className="qtl-equiv">({receipt.netQuintals.toFixed(2)} Quintals)</span>
                  </td>
                  <td>Gross − Tare Weight</td>
                </tr>
                <tr>
                  <td><b>4. Moisture & Dockage Deduction</b></td>
                  <td><b>{receipt.moisturePercent}% Moisture</b> ({receipt.deductionQuintals} Qtl)</td>
                  <td>Within FAQ Standard (&lt; 12.0%)</td>
                </tr>
                <tr className="final-payable-row">
                  <td><b>Final Payable Quantity</b></td>
                  <td colSpan="2">
                    <b className="final-qtl">{receipt.finalPayableQuintals.toFixed(2)} Quintals</b>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* MSP Payout Calculation Box */}
          <div className="receipt-payout-box">
            <div className="msp-payout-row">
              <div className="payout-unit-calc">
                <span className="calc-desc">
                  {receipt.finalPayableQuintals} Quintals × Official MSP ₹{receipt.mspRate.toLocaleString()}
                </span>
                <span className="calc-agency">Under Pradhan Mantri Annadata Aay Sanrakshan Abhiyan (PM-AASHA)</span>
              </div>
              <div className="payout-total-figure">
                <span className="total-lbl">Total Payable MSP Amount:</span>
                <div className="total-rupees">₹{receipt.totalPayableAmount.toLocaleString()}</div>
              </div>
            </div>

            {/* Direct Bank Account Status */}
            <div className="receipt-dbt-status">
              <div className="dbt-status-header">
                <Landmark size={18} className="bank-icon" />
                <span className="dbt-title">Direct Benefit Transfer (DBT) Status: <b>{receipt.paymentStatus}</b></span>
              </div>
              <div className="dbt-details-line">
                <span>Account: <b>{receipt.bankAccountEnding}</b></span>
                <span>PFMS Ref: <b>{receipt.dbtReferenceId}</b></span>
              </div>
            </div>
          </div>

          {/* Certified Footer */}
          <div className="receipt-certified-footer">
            <div className="cert-officer">
              <Scale size={16} />
              <span>Certified By: <b>{receipt.weighbridgeOperator}</b></span>
            </div>
            <div className="cert-seal">
              <Award size={16} />
              <span>DIGITALLY SIGNED & ENCRYPTION VERIFIED</span>
            </div>
          </div>
        </div>

        <div className="modal-actions-row">
          <button type="button" onClick={onClose} className="btn-secondary">
            Close
          </button>
          <button type="button" onClick={handlePrint} className="btn-primary">
            <Printer size={17} />
            <span>Print Official Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
}
