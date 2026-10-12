import React, { useEffect, useState } from 'react';
import './App.css';
import ProcurementNavbar from './components/ProcurementNavbar';
import ProcurementHome from './components/ProcurementHome';
import FarmerPortal from './components/FarmerPortal';
import StaffConsole from './components/StaffConsole';
import DistrictAdmin from './components/DistrictAdmin';
import LoginPage from './components/LoginPage';

// Modals
import BookSlotModal from './components/Modals/BookSlotModal';
import GatePassModal from './components/Modals/GatePassModal';
import ReceiptModal from './components/Modals/ReceiptModal';
import AuthModal from './components/Modals/AuthModal';
import { t } from './data/i18n';
import { getSession, clearSession } from './data/authData';
import { bookingApi, bookingForUi } from './services/api';
import NotificationBell from './components/NotificationBell';

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
  const [currentUser, setCurrentUser] = useState(getSession);
  const [currentLang, setCurrentLang] = useState(() => {
    try {
      return localStorage.getItem('kisansetu-language') || 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kisansetu-language', currentLang);
    } catch {
      // Continue without persistence when browser storage is unavailable.
    }
    document.documentElement.lang = currentLang;
  }, [currentLang]);
  
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
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 1. Book Slot Action
  useEffect(() => {
    if (currentUser) bookingApi.list().then((rows) => setTokens(rows.map(bookingForUi))).catch((error) => showToast(`Unable to load live bookings: ${error.message}`));
  }, [currentUser]);

  const handleBookSlot = async (newToken) => {
    const saved = bookingForUi(await bookingApi.create({ mandiId: newToken.mandiId, cropId: newToken.cropId, vehicleNumber: newToken.vehicleNumber, vehicleType: newToken.vehicleType, estimatedQuantityQtl: newToken.estimatedQuantityQtl, scheduledDate: newToken.scheduledDate, scheduledSlot: newToken.scheduledSlot, location: { state: newToken.state, district: newToken.district, taluk: newToken.taluk, village: newToken.village } }));
    setTokens((current) => [saved, ...current]);
    showToast(`Booking ${saved.tokenNumber} submitted for approval.`);
    setSelectedTokenForPass(saved);
    return saved;
  };

  // 2. Gate Check-In Action
  const handleCheckInToken = async (tokenId) => {
    const saved = bookingForUi(await bookingApi.status(tokenId, { status: 'IN_YARD', note: 'Gate arrival verified' }));
    const updated = tokens.map((t) => {
      if (t.id === tokenId) {
        return {
          ...t, ...saved,
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
  const handleCallToken = async (tokenId, bayName) => {
    const saved = bookingForUi(await bookingApi.status(tokenId, { status: 'CALLED', currentBay: bayName, note: `Called to ${bayName}` }));
    const updated = tokens.map((t) => {
      if (t.id === tokenId) {
        return {
          ...t, ...saved,
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
  const handleCompleteWeighment = async (tokenId, receiptData) => {
    await bookingApi.procurement(tokenId, { grossWeightKg: receiptData.grossWeightKg, tareWeightKg: receiptData.tareWeightKg, moisturePercent: receiptData.moisturePercent, mspRate: receiptData.mspRate });
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

  const handleUpdateToken = async (tokenId, changes) => {
    const saved = bookingForUi(await bookingApi.status(tokenId, { status: changes.status, currentBay: changes.currentBay, rejectionReason: changes.rejectionReason, note: changes.note }));
    setTokens((current) => current.map((token) => token.id === tokenId ? { ...token, ...saved } : token));
  };

  const handleUpdateReceipt = (slipNumber, changes) => {
    const updated = receipts.map((receipt) => receipt.slipNumber === slipNumber ? { ...receipt, ...changes } : receipt);
    setReceipts(updated);
    saveStoredReceipts(updated);
  };

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthenticate = ({ name, mode }) => {
    showToast(mode === 'register' ? t(currentLang, 'accountCreated', { name }) : t(currentLang, 'loggedIn'));
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentRole(user.role === 'admin' ? 'admin' : user.role === 'staff' ? 'staff' : 'farmer');
  };

  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
    setCurrentRole('public');
  };

  if (!currentUser) {
    return <LoginPage currentLang={currentLang} onLoginSuccess={handleLoginSuccess} />;
  }

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
        onOpenAuthModal={openAuthModal}
        activeTokensCount={tokens.filter((t) => t.status !== 'COMPLETED').length}
      />
      <NotificationBell />

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
            tokens={tokens}
            receipts={receipts}
            onUpdateToken={handleUpdateToken}
            onUpdateReceipt={handleUpdateReceipt}
            onNotify={showToast}
            onLogout={handleLogout}
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
            <h4>{t(currentLang, 'systemWorkspaces')}</h4>
            <button onClick={() => setCurrentRole('public')} className="footer-link">{t(currentLang, 'publicQueue')}</button>
            <button onClick={() => setCurrentRole('farmer')} className="footer-link">{t(currentLang, 'farmerBooking')}</button>
            <button onClick={() => setCurrentRole('staff')} className="footer-link">{t(currentLang, 'staffWorkspace')}</button>
            <button onClick={() => setCurrentRole('admin')} className="footer-link">{t(currentLang, 'adminWorkspace')}</button>
          </div>

          <div className="footer-links-col">
            <h4>{t(currentLang, 'integratedAgencies')}</h4>
            <a href="https://fci.gov.in" target="_blank" rel="noreferrer" className="footer-link">Food Corporation of India (FCI)</a>
            <a href="https://nafed-india.com" target="_blank" rel="noreferrer" className="footer-link">NAFED (PSS Procurement)</a>
            <a href="https://pfms.nic.in" target="_blank" rel="noreferrer" className="footer-link">PFMS Direct Benefit Transfer</a>
            <a href="https://enam.gov.in" target="_blank" rel="noreferrer" className="footer-link">National Agriculture Market (e-NAM)</a>
          </div>

          <div className="footer-help-col">
            <h4>{t(currentLang, 'helpDesk')}</h4>
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
      <AuthModal
        key={authMode}
        isOpen={authModalOpen}
        initialMode={authMode}
        currentLang={currentLang}
        onClose={() => {
          setAuthModalOpen(false);
          setAuthMode('login');
        }}
        onAuthenticate={handleAuthenticate}
      />
    </div>
  );
}
