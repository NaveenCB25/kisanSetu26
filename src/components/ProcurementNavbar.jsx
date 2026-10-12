import React, { useState } from 'react';
import { 
  Scale, 
  User, 
  ShieldCheck, 
  Building2, 
  PlusCircle, 
  PhoneCall, 
  Languages, 
  Menu, 
  X,
  LogIn,
  UserPlus,
  Radio,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import { languages } from '../data/translations';
import { t } from '../data/i18n';

export default function ProcurementNavbar({ 
  currentRole, 
  setCurrentRole, 
  currentLang, 
  setCurrentLang, 
  onOpenBookModal,
  onOpenAuthModal,
  activeTokensCount 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const text = (key) => t(currentLang, key);

  const roles = [
    { id: 'public', label: text('publicPortal'), icon: Radio },
    { id: 'farmer', label: text('farmerPortal'), icon: User },
    { id: 'staff', label: text('staffConsole'), icon: Scale },
    { id: 'admin', label: text('districtAdmin'), icon: Building2 }
  ];

  return (
    <header className="navbar-wrapper">
      {/* Top Ticker Ribbon */}
      <div className="top-banner">
        <div className="container top-banner-inner">
          <div className="ticker-wrapper">
            <span className="ticker-label">⚡ LIVE MANDI QUEUE:</span>
            <div className="ticker-content">
              <span className="ticker-item">🟢 <b>Khanna Central:</b> Bay 1 Calling #KST-101 • Bay 2 Calling #KST-102</span>
              <span className="ticker-item">🌾 <b>Karnal APMC:</b> 22 Trolleys in Yard • Avg Wait 18 Mins</span>
              <span className="ticker-item">⚖️ <b>Wheat MSP:</b> ₹2,275/Qtl • <b>Mustard MSP:</b> ₹5,650/Qtl</span>
              <span className="ticker-item">🛡️ <b>Anti-Congestion Protocol Active:</b> Gate Entry strictly by Digital QR Token</span>
            </div>
          </div>
          <div className="helpline-badge">
            <PhoneCall size={13} />
            <span>{text('controlRoom')} <b>1800-180-1551</b> ({text('tollFree')})</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="main-nav-container">
        <div className="container main-nav-inner">
          {/* Brand Logo */}
          <div className="brand-logo" onClick={() => setCurrentRole('public')}>
            <div className="logo-icon-wrapper">
              <Scale size={26} className="logo-leaf" />
            </div>
            <div className="logo-text">
              <div className="logo-title">
                Kisan<span className="logo-highlight">Setu</span>
              </div>
              <div className="logo-subtitle">{text('queueManagement')}</div>
            </div>
          </div>

          {/* Role Switcher Tabs */}
          <nav className="desktop-nav role-switcher-nav">
            {roles.map((r) => {
              const Icon = r.icon;
              const isActive = currentRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setCurrentRole(r.id)}
                  className={`role-tab-btn ${isActive ? 'active' : ''}`}
                >
                  <Icon size={16} />
                  <span>{r.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="nav-actions">
            {/* Language Selector */}
            <div className="language-selector-wrapper">
              <Languages size={16} className="lang-icon" />
              <select
                value={currentLang}
                onChange={(e) => setCurrentLang(e.target.value)}
                className="lang-select"
                aria-label="Select Language"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.native}
                  </option>
                ))}
              </select>
            </div>

            <div className="auth-nav-actions">
              <button onClick={() => onOpenAuthModal('login')} className="btn-login">
                <LogIn size={16} />
                <span>{text('login')}</span>
              </button>
              <button onClick={() => onOpenAuthModal('register')} className="btn-register">
                <UserPlus size={16} />
                <span>{text('register')}</span>
              </button>
            </div>

            {/* Quick Action: Book Slot */}
            <button
              onClick={onOpenBookModal}
              className="btn-primary nav-post-btn"
            >
              <PlusCircle size={17} />
              <span>{text('bookSlot')}</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer animate-fade">
          <div className="mobile-drawer-links">
            <span className="mobile-drawer-heading">{text('selectPortal')}</span>
            {roles.map((r) => {
              const Icon = r.icon;
              const isActive = currentRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => {
                    setCurrentRole(r.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{r.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => {
                onOpenBookModal();
                setMobileMenuOpen(false);
              }}
              className="btn-primary mobile-drawer-post-btn"
            >
              <PlusCircle size={18} />
              <span>{text('bookProcurementSlot')}</span>
            </button>
            <div className="mobile-auth-actions">
              <button onClick={() => { onOpenAuthModal('login'); setMobileMenuOpen(false); }} className="btn-login"><LogIn size={17} /> {text('login')}</button>
              <button onClick={() => { onOpenAuthModal('register'); setMobileMenuOpen(false); }} className="btn-register"><UserPlus size={17} /> {text('register')}</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
