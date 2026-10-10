import React, { useState } from 'react';
import './App.css';
import ProcurementNavbar from './components/ProcurementNavbar';
import ProcurementHome from './components/ProcurementHome';
import FarmerPortal from './components/FarmerPortal';
import StaffConsole from './components/StaffConsole';
import DistrictAdmin from './components/DistrictAdmin';

// Modals
import BookSlotModal from './components/Modals/BookSlotModal';
import GatePassModal from './components/Modals/GatePassModal';
import ReceiptModal from './components/Modals/ReceiptModal';

import { 
  getStoredTokens, 
  saveStoredTokens, 
  getStoredReceipts, 
  saveStoredReceipts, 
  getStoredMSP, 
  saveStoredMSP,
  auditLogs 
} from './data/procurementData';

export default function App() {
  const [currentRole, setCurrentRole] = useState('public'); // 'public', 'farmer', 'staff', 'admin'
  const [currentLang, setCurrentLang] = useState('en');
  
  // Persistent Queue Tokens & Receipts
  const [tokens, setTokens] = useState(getStoredTokens);
  const [receipts, setReceipts] = useState(getStoredReceipts);
  const [mspRates, setMspRates] = useState(getStoredMSP);

  // Modals state
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [gatePassModalOpen, setGatePassModalOpen] = useState(false);
  const [selectedTokenForPass, setSelectedTokenForPass] = useState(null);
  
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 1. Book Slot Action
  const handleBookSlot = (newToken) => {
    const updated = [newToken, ...tokens];
    setTokens(updated);
    saveStoredTokens(updated);
    showToast(`🌾 Token ${newToken.tokenNumber} issued for ${newToken.vehicleNumber}!`);
    setSelectedTokenForPass(newToken);
  };

  // 2. Gate Check-In Action
  const handleCheckInToken = (tokenId) => {
    const updated = tokens.map((t) => {
      if (t.id === tokenId) {
        return {
          ...t,
          status: 'IN_YARD',
          gateCheckInTime: 'Just Now',
          estimatedWaitMins: 15
        };
      }
      return t;
    });
    setTokens(updated);
    saveStoredTokens(updated);
    const target = tokens.find((t) => t.id === tokenId);
    showToast(`✓ Gate Entry Verified: Token ${target?.tokenNumber} marked IN_YARD!`);
  };

  // 3. Token Calling Action
  const handleCallToken = (tokenId, bayName) => {
    const updated = tokens.map((t) => {
      if (t.id === tokenId) {
        return {
          ...t,
          status: 'CALLED',
          currentBay: bayName,
          estimatedWaitMins: 2
        };
      }
      return t;
    });
    setTokens(updated);
    saveStoredTokens(updated);
    const target = tokens.find((t) => t.id === tokenId);
    showToast(`📢 Token ${target?.tokenNumber} called to ${bayName}! Public Board Updated.`);
  };

  // 4. Complete Weighment Action
  const handleCompleteWeighment = (tokenId, receiptData) => {
    // Mark token completed
    const updatedTokens = tokens.map((t) => {
      if (t.id === tokenId) {
        return {
          ...t,
          status: 'COMPLETED',
          currentBay: 'Weighed & Cleared'
        };
      }
      return t;
    });
    setTokens(updatedTokens);
    saveStoredTokens(updatedTokens);

    // Save receipt
    const updatedReceipts = [receiptData, ...receipts];
    setReceipts(updatedReceipts);
    saveStoredReceipts(updatedReceipts);

    showToast(`⚖️ Procurement Completed! Slip ${receiptData.slipNumber} generated.`);
  };

  // 5. Update MSP Action
  const handleUpdateMSP = (updatedList) => {
    setMspRates(updatedList);
    saveStoredMSP(updatedList);
    showToast('✓ MSP and Daily Quotas updated across system.');
  };

  return (
    <div className="app-layout">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="toast-notification animate-fade">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar with Role Switcher */}
      <ProcurementNavbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        onOpenBookModal={() => setBookModalOpen(true)}
        activeTokensCount={tokens.filter((t) => t.status !== 'COMPLETED').length}
      />

      {/* Main Content Rendered by Role */}
      <main className="container app-content-container">
        {currentRole === 'public' && (
          <ProcurementHome
            tokens={tokens}
            onOpenBookModal={() => setBookModalOpen(true)}
            onSelectRole={(role) => setCurrentRole(role)}
            onViewGatePass={(tok) => {
              setSelectedTokenForPass(tok);
              setGatePassModalOpen(true);
            }}
          />
        )}

        {currentRole === 'farmer' && (
          <FarmerPortal
            tokens={tokens}
            receipts={receipts}
            onOpenBookModal={() => setBookModalOpen(true)}
            onViewGatePass={(tok) => {
              setSelectedTokenForPass(tok);
              setGatePassModalOpen(true);
            }}
            onViewReceipt={(rec) => {
              setSelectedReceipt(rec);
              setReceiptModalOpen(true);
            }}
          />
        )}

        {currentRole === 'staff' && (
          <StaffConsole
            tokens={tokens}
            onCheckInToken={handleCheckInToken}
            onCallToken={handleCallToken}
            onCompleteWeighment={handleCompleteWeighment}
            onViewReceipt={(rec) => {
              setSelectedReceipt(rec);
              setReceiptModalOpen(true);
            }}
          />
        )}

        {currentRole === 'admin' && (
          <DistrictAdmin
            mspRates={mspRates}
            onUpdateMSP={handleUpdateMSP}
          />
        )}
      </main>

      {/* Professional Footer */}
      <footer className="main-footer">
        <div className="container footer-inner">
          <div className="footer-brand-col">
            <div className="footer-logo">
              🌾 Kisan<span className="logo-highlight">Setu</span>
            </div>
            <p className="footer-tagline">
              National Smart Mandi Procurement and Queue Management System. Eliminating highway delays, providing transparent digital token queues, automated dual-weighbridges, and guaranteed direct DBT MSP transfers for Indian cultivators.
            </p>
            <div className="footer-badge-row">
              <span className="badge badge-green">FCI & APMC Certified 2026</span>
              <span className="badge badge-amber">Anti-Congestion Protocol</span>
            </div>
          </div>

          <div className="footer-links-col">
            <h4>System Workspaces</h4>
            <button onClick={() => setCurrentRole('public')} className="footer-link">Public Live Queue Board</button>
            <button onClick={() => setCurrentRole('farmer')} className="footer-link">Farmer Booking & Passes</button>
            <button onClick={() => setCurrentRole('staff')} className="footer-link">Mandi Staff Console</button>
            <button onClick={() => setCurrentRole('admin')} className="footer-link">District Analytics & MSP</button>
          </div>

          <div className="footer-links-col">
            <h4>Integrated Agencies</h4>
            <a href="https://fci.gov.in" target="_blank" rel="noreferrer" className="footer-link">Food Corporation of India (FCI)</a>
            <a href="https://nafed-india.com" target="_blank" rel="noreferrer" className="footer-link">NAFED (PSS Procurement)</a>
            <a href="https://pfms.nic.in" target="_blank" rel="noreferrer" className="footer-link">PFMS Direct Benefit Transfer</a>
            <a href="https://enam.gov.in" target="_blank" rel="noreferrer" className="footer-link">National Agriculture Market (e-NAM)</a>
          </div>

          <div className="footer-help-col">
            <h4>Mandi Control Room & Helpline</h4>
            <div className="footer-helpline-box">
              <div className="kcc-number">1800-180-1551</div>
              <span className="kcc-sub">Kisan Call Centre & Mandi Queue Redressal (24x7 Toll-Free)</span>
            </div>
            <p className="footer-copy">© 2026 KisanSetu. Ministry of Agriculture and Farmers Welfare, Govt of India.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BookSlotModal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        onBookSlot={handleBookSlot}
      />

      <GatePassModal
        isOpen={gatePassModalOpen}
        onClose={() => setGatePassModalOpen(false)}
        token={selectedTokenForPass}
      />

      <ReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        receipt={selectedReceipt}
      />
    </div>
  );
}
