import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Stethoscope, 
  CloudSun, 
  Landmark, 
  Tractor, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Droplets,
  Wind
} from 'lucide-react';
import { translations } from '../data/translations';
import { initialMandiData } from '../data/mandiData';
import { weatherData } from '../data/weatherData';

export default function DashboardView({ 
  currentLang, 
  setActiveTab, 
  onOpenPostModal,
  marketplaceCount 
}) {
  const t = translations[currentLang] || translations.en;
  const topMandis = initialMandiData.slice(0, 4);

  return (
    <div className="dashboard-page animate-fade">
      {/* Hero Welcome Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>Digital Agri Revolution 2026</span>
          </div>
          <h1 className="hero-title">
            {currentLang === 'hi' ? 'नमस्ते किसान साथी! स्वागत है किसान सेतु में' : 
             currentLang === 'pb' ? 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! ਜੀ ਆਇਆਂ ਨੂੰ ਕਿਸਾਨ ਸੇਤੂ ਵਿੱਚ' : 
             'Direct Market Access, Fair Price & Farm Intelligence'}
          </h1>
          <p className="hero-subtitle">
            {t.tagline}. Connect directly with buyers, track APMC Mandi Bhav across 10+ states, diagnose crop diseases, and get instant weather advisories.
          </p>

          <div className="hero-actions">
            <button 
              onClick={() => setActiveTab('mandi')} 
              className="btn-primary hero-btn"
            >
              <TrendingUp size={18} />
              <span>{t.liveMandi}</span>
            </button>
            <button 
              onClick={onOpenPostModal} 
              className="btn-gold hero-btn"
            >
              <ShoppingBag size={18} />
              <span>{t.postProduce}</span>
            </button>
            <button 
              onClick={() => setActiveTab('doctor')} 
              className="btn-secondary hero-btn"
            >
              <Stethoscope size={18} />
              <span>{t.cropDoctor}</span>
            </button>
          </div>
        </div>

        {/* Quick Weather Snapshot Card in Hero */}
        <div className="hero-weather-card glass-panel" onClick={() => setActiveTab('weather')}>
          <div className="weather-card-header">
            <div>
              <span className="badge badge-green">Hyperlocal Live</span>
              <h3 className="weather-loc-title">{weatherData.location.city}</h3>
            </div>
            <CloudSun size={36} className="weather-hero-icon" />
          </div>

          <div className="weather-temp-row">
            <div className="weather-big-temp">{weatherData.current.temp}°C</div>
            <div className="weather-meta-col">
              <span className="weather-cond-text">{weatherData.current.condition}</span>
              <span className="weather-humidity-text">
                <Droplets size={13} /> {weatherData.current.humidity}% Humidity
              </span>
            </div>
          </div>

          <div className="weather-advisory-pill">
            <Wind size={14} className="wind-icon" />
            <span>{weatherData.agroAdvisory.sprayStatus}</span>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="stats-grid">
        <div className="stat-card glass-panel" onClick={() => setActiveTab('mandi')}>
          <div className="stat-icon-wrap green">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">{t.avgMandiRate}</span>
            <div className="stat-value">₹2,380 <span className="stat-trend positive">+2.8%</span></div>
            <span className="stat-desc">Khanna & Karnal Hub</span>
          </div>
        </div>

        <div className="stat-card glass-panel" onClick={() => setActiveTab('marketplace')}>
          <div className="stat-icon-wrap amber">
            <ShoppingBag size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">{t.activeListings}</span>
            <div className="stat-value">{marketplaceCount} Verified Lots</div>
            <span className="stat-desc">Direct Farmer Produce</span>
          </div>
        </div>

        <div className="stat-card glass-panel" onClick={() => setActiveTab('doctor')}>
          <div className="stat-icon-wrap blue">
            <Stethoscope size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">{t.healthyCropsScanned}</span>
            <div className="stat-value">96.4% Accuracy</div>
            <span className="stat-desc">AI Pathology & Bio-Cure</span>
          </div>
        </div>

        <div className="stat-card glass-panel" onClick={() => setActiveTab('schemes')}>
          <div className="stat-icon-wrap purple">
            <Landmark size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">{t.subsidiesDisbursed}</span>
            <div className="stat-value">6 Central Schemes</div>
            <span className="stat-desc">PM-Kisan, KUSUM, PMFBY</span>
          </div>
        </div>
      </section>

      {/* Urgent Agri Advisory Alert */}
      <section className="advisory-alert-card">
        <div className="advisory-icon-wrap">
          <AlertTriangle size={26} />
        </div>
        <div className="advisory-content">
          <h4>{t.weatherAlert}: {weatherData.agroAdvisory.title}</h4>
          <p>{weatherData.agroAdvisory.description}</p>
        </div>
        <button onClick={() => setActiveTab('weather')} className="btn-secondary alert-cta">
          <span>View 5-Day Plan</span>
          <ChevronRight size={16} />
        </button>
      </section>

      {/* Two Column Layout: Trending Mandi Bhav & Feature Hub */}
      <div className="dashboard-split-grid">
        {/* Left Column: Live Mandi Price Highlights */}
        <div className="mandi-highlight-box glass-panel">
          <div className="box-header">
            <div>
              <span className="badge badge-green">Real-Time APMC</span>
              <h3>Top Commodity Mandi Bhav</h3>
            </div>
            <button onClick={() => setActiveTab('mandi')} className="view-all-btn">
              <span>View All 12 Mandis</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="mandi-table-wrapper">
            <table className="dashboard-mandi-table">
              <thead>
                <tr>
                  <th>Commodity</th>
                  <th>Mandi / State</th>
                  <th>Modal Price</th>
                  <th>Trend</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {topMandis.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="commodity-name-cell">
                        <span className="comm-title">{item.commodity}</span>
                        <span className="comm-cat">{item.category}</span>
                      </div>
                    </td>
                    <td>
                      <div className="mandi-loc-cell">
                        <span className="mandi-name">{item.market}</span>
                        <span className="mandi-state">{item.state}</span>
                      </div>
                    </td>
                    <td>
                      <div className="price-cell">
                        <b>₹{item.modalPrice.toLocaleString()}</b>
                        <span className="price-unit">/Qtl</span>
                      </div>
                    </td>
                    <td>
                      <span className={`trend-badge ${item.isPositive ? 'trend-up' : 'trend-down'}`}>
                        {item.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {item.trend}
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => setActiveTab('mandi')} 
                        className="btn-secondary btn-sm-table"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: 4 Core Services Quick Launch Cards */}
        <div className="services-hub-grid">
          {/* Card 1: Kisan Bazaar */}
          <div className="service-card glass-panel" onClick={() => setActiveTab('marketplace')}>
            <div className="service-card-top">
              <div className="service-icon amber">
                <ShoppingBag size={22} />
              </div>
              <span className="badge badge-amber">Direct B2B Trade</span>
            </div>
            <h4>Kisan Bazaar</h4>
            <p>Sell your harvest directly to millers, FPOs & buyers without commission cuts.</p>
            <div className="service-action-link">
              <span>Explore Marketplace</span>
              <ArrowUpRight size={16} />
            </div>
          </div>

          {/* Card 2: AI Crop Doctor */}
          <div className="service-card glass-panel" onClick={() => setActiveTab('doctor')}>
            <div className="service-card-top">
              <div className="service-icon green">
                <Stethoscope size={22} />
              </div>
              <span className="badge badge-green">Instant Scan</span>
            </div>
            <h4>AI Crop Doctor</h4>
            <p>Upload diseased leaves. Get disease diagnosis, bio-pesticides & exact dosage.</p>
            <div className="service-action-link">
              <span>Diagnose Crop Now</span>
              <ArrowUpRight size={16} />
            </div>
          </div>

          {/* Card 3: Government Schemes */}
          <div className="service-card glass-panel" onClick={() => setActiveTab('schemes')}>
            <div className="service-card-top">
              <div className="service-icon purple">
                <Landmark size={22} />
              </div>
              <span className="badge badge-blue">Govt Subsidies</span>
            </div>
            <h4>Sarkari Yojanas & MSP</h4>
            <p>Check eligibility for PM-Kisan (₹6000), PM KUSUM solar pumps (60% subsidy) and KCC.</p>
            <div className="service-action-link">
              <span>Check Subsidies</span>
              <ArrowUpRight size={16} />
            </div>
          </div>

          {/* Card 4: Farm Machinery Rental */}
          <div className="service-card glass-panel" onClick={() => setActiveTab('machinery')}>
            <div className="service-card-top">
              <div className="service-icon orange">
                <Tractor size={22} />
              </div>
              <span className="badge badge-amber">Yantra Setu</span>
            </div>
            <h4>Machinery Rental</h4>
            <p>Rent high-tech tractors, combine harvesters, and spray drones from nearby farmers.</p>
            <div className="service-action-link">
              <span>Rent Equipment</span>
              <ArrowUpRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
