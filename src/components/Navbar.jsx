import React, { useState } from 'react';
import { 
  Sprout, 
  Volume2, 
  VolumeX, 
  PhoneCall, 
  PlusCircle, 
  Languages, 
  Menu, 
  X,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { languages, translations } from '../data/translations';

export default function Navbar({ 
  currentLang, 
  setCurrentLang, 
  activeTab, 
  setActiveTab, 
  onOpenPostModal,
  isSpeaking,
  onToggleSpeech 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[currentLang] || translations.en;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Sprout },
    { id: 'mandi', label: t.liveMandi, icon: TrendingUp },
    { id: 'marketplace', label: t.marketplace, icon: ShieldCheck },
    { id: 'doctor', label: t.cropDoctor, icon: Sprout },
    { id: 'weather', label: t.weather, icon: null },
    { id: 'schemes', label: t.schemes, icon: null },
    { id: 'machinery', label: t.machinery, icon: null }
  ];

  return (
    <header className="navbar-wrapper">
      {/* Top Bar for Ticker and Emergency Helpline */}
      <div className="top-banner">
        <div className="container top-banner-inner">
          <div className="ticker-wrapper">
            <span className="ticker-label">⚡ LIVE MANDI:</span>
            <div className="ticker-content">
              <span className="ticker-item">🌾 Wheat Khanna: <b>₹2,380</b> (+2.8%)</span>
              <span className="ticker-item">🍚 Basmati 1121 Karnal: <b>₹4,250</b> (+4.1%)</span>
              <span className="ticker-item">🌱 Mustard Bharatpur: <b>₹5,620</b> (+1.6%)</span>
              <span className="ticker-item">🥔 Potato Agra: <b>₹1,540</b> (+1.2%)</span>
              <span className="ticker-item">🧅 Onion Lasalgaon: <b>₹2,250</b> (-3.4%)</span>
              <span className="ticker-item">🌿 Cotton Rajkot: <b>₹7,320</b> (+3.2%)</span>
            </div>
          </div>
          <div className="helpline-badge">
            <PhoneCall size={13} />
            <span>Kisan Call Centre: <b>1800-180-1551</b> (Toll Free)</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="main-nav-container">
        <div className="container main-nav-inner">
          {/* Brand Logo */}
          <div className="brand-logo" onClick={() => setActiveTab('dashboard')}>
            <div className="logo-icon-wrapper">
              <Sprout size={28} className="logo-leaf" />
            </div>
            <div className="logo-text">
              <div className="logo-title">
                Kisan<span className="logo-highlight">Setu</span>
              </div>
              <div className="logo-subtitle">किसान सेतु • Digital Farm Bridge</div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="desktop-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions: Audio Readout, Language Selector, Post Produce CTA */}
          <div className="nav-actions">
            {/* Audio Voice Readout Button */}
            <button
              onClick={onToggleSpeech}
              className={`voice-btn ${isSpeaking ? 'speaking' : ''}`}
              title={isSpeaking ? t.voiceStop : t.voiceReadout}
            >
              {isSpeaking ? (
                <>
                  <VolumeX size={18} />
                  <span className="voice-text">{t.voiceStop}</span>
                  <span className="voice-pulse"></span>
                </>
              ) : (
                <>
                  <Volume2 size={18} />
                  <span className="voice-text">{t.voiceReadout}</span>
                </>
              )}
            </button>

            {/* Language Selector */}
            <div className="language-selector-wrapper">
              <Languages size={17} className="lang-icon" />
              <select
                value={currentLang}
                onChange={(e) => setCurrentLang(e.target.value)}
                className="lang-select"
                aria-label="Select Language"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.native} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Post Produce CTA */}
            <button
              onClick={onOpenPostModal}
              className="btn-primary nav-post-btn"
            >
              <PlusCircle size={18} />
              <span>{t.postProduce}</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer animate-fade">
          <div className="mobile-drawer-links">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`mobile-nav-link ${activeTab === item.id ? 'active' : ''}`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                onOpenPostModal();
                setMobileMenuOpen(false);
              }}
              className="btn-primary mobile-drawer-post-btn"
            >
              <PlusCircle size={18} />
              <span>{t.postProduce}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
