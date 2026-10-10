import React, { useState } from 'react';
import { 
  TrendingUp, 
  Search, 
  MapPin, 
  BellRing, 
  ArrowUpRight, 
  ArrowDownRight, 
  Filter, 
  Calendar,
  Layers,
  Sparkles,
  Award
} from 'lucide-react';
import { initialMandiData, statesList, commoditiesList } from '../data/mandiData';
import { translations } from '../data/translations';

export default function MandiRatesView({ currentLang, onOpenPriceAlertModal }) {
  const t = translations[currentLang] || translations.en;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedCommodity, setSelectedCommodity] = useState('All Commodities');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Grains', 'Oilseeds', 'Vegetables', 'Cash Crops', 'Pulses', 'Spices'];

  const filteredMandis = initialMandiData.filter((item) => {
    const matchesSearch = 
      item.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.market.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.state.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesState = selectedState === 'All States' || item.state === selectedState;
    const matchesCommodity = selectedCommodity === 'All Commodities' || item.commodity.includes(selectedCommodity.split(' ')[0]);
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesState && matchesCommodity && matchesCategory;
  });

  return (
    <div className="mandi-page animate-fade">
      {/* Page Header */}
      <div className="section-header-box">
        <div>
          <span className="badge badge-green">APMC Agmarknet Integrated</span>
          <h2 className="section-title">{t.liveMandi} (दैनिक मंडी भाव)</h2>
          <p className="section-subtitle">
            Accurate daily commodity prices reported from major agricultural market yards across India.
          </p>
        </div>

        <div className="header-meta-stats">
          <div className="meta-pill">
            <span className="meta-dot live"></span>
            <span>Live Data Feed Active</span>
          </div>
          <div className="meta-pill">
            <Calendar size={14} />
            <span>Updated Today, 10 Oct 2026</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mandi-filter-bar glass-panel">
        <div className="search-input-wrap">
          <Search size={18} className="search-icon" />
          <input 
            type="text"
            placeholder={t.searchMandi}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input search-input"
          />
        </div>

        <div className="filter-selects-row">
          <div className="select-wrap">
            <label>{t.selectState}</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="form-select"
            >
              {statesList.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div className="select-wrap">
            <label>{t.selectCommodity}</label>
            <select
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
              className="form-select"
            >
              {commoditiesList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="category-pills-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Mandi Cards Grid */}
      <div className="mandi-cards-grid">
        {filteredMandis.length === 0 ? (
          <div className="no-results-card glass-panel">
            <Search size={40} className="empty-icon" />
            <h3>No Mandi Rates Found</h3>
            <p>Try resetting filters or searching for another commodity or state.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedState('All States'); setSelectedCommodity('All Commodities'); setSelectedCategory('All'); }}
              className="btn-primary mt-3"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredMandis.map((mandi) => {
            const aboveMsp = mandi.msp && mandi.modalPrice >= mandi.msp;
            return (
              <div key={mandi.id} className="mandi-card glass-panel">
                <div className="mandi-card-top">
                  <div>
                    <span className="badge badge-amber">{mandi.category}</span>
                    <h3 className="mandi-comm-name">{mandi.commodity}</h3>
                  </div>
                  <span className={`trend-badge-large ${mandi.isPositive ? 'trend-up' : 'trend-down'}`}>
                    {mandi.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {mandi.trend}
                  </span>
                </div>

                <div className="mandi-location-row">
                  <MapPin size={16} className="loc-icon" />
                  <span className="loc-text">{mandi.market}, {mandi.district} ({mandi.state})</span>
                </div>

                {/* Big Price Display */}
                <div className="mandi-price-box">
                  <div className="price-item main">
                    <span className="price-label">{t.modalPrice}</span>
                    <div className="big-price">
                      ₹{mandi.modalPrice.toLocaleString()} 
                      <span className="unit">/Quintal</span>
                    </div>
                  </div>

                  <div className="min-max-row">
                    <div className="sub-price">
                      <span className="sub-label">Min:</span>
                      <b>₹{mandi.minPrice.toLocaleString()}</b>
                    </div>
                    <div className="sub-price">
                      <span className="sub-label">Max:</span>
                      <b>₹{mandi.maxPrice.toLocaleString()}</b>
                    </div>
                  </div>
                </div>

                {/* MSP Benchmark and Arrivals */}
                <div className="mandi-extra-row">
                  <div className="arrivals-badge">
                    <Layers size={14} />
                    <span>Arrivals: <b>{mandi.arrivals.toLocaleString()} {mandi.arrivalUnit}</b></span>
                  </div>

                  {mandi.msp ? (
                    <div className={`msp-badge ${aboveMsp ? 'above' : 'below'}`}>
                      <Award size={13} />
                      <span>Govt MSP: ₹{mandi.msp} ({aboveMsp ? 'Above MSP' : 'Below MSP'})</span>
                    </div>
                  ) : (
                    <span className="free-market-tag">Free Market Crop</span>
                  )}
                </div>

                {/* Actions: Price Alert & Trade */}
                <div className="mandi-card-footer">
                  <span className="updated-text">⏱️ {mandi.lastUpdated}</span>
                  <button 
                    onClick={() => onOpenPriceAlertModal(mandi)} 
                    className="btn-secondary btn-alert"
                  >
                    <BellRing size={16} />
                    <span>Set Price Alert</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
