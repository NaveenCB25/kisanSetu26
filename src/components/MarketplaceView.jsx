import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  MapPin, 
  PlusCircle, 
  ShieldCheck, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles,
  Droplets,
  Gavel
} from 'lucide-react';
import { translations } from '../data/translations';

export default function MarketplaceView({ 
  currentLang, 
  listings, 
  onOpenPostModal, 
  onOpenBidModal 
}) {
  const t = translations[currentLang] || translations.en;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Grains', 'Vegetables', 'Oilseeds', 'Cash Crops'];

  const filteredListings = listings.filter((item) => {
    const matchesSearch = 
      item.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.state.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="marketplace-page animate-fade">
      {/* Header Banner */}
      <div className="section-header-box marketplace-header">
        <div>
          <span className="badge badge-amber">0% Middleman Commission</span>
          <h2 className="section-title">{t.marketplace} (किसान बाजार)</h2>
          <p className="section-subtitle">
            Buy farm-fresh harvests directly from verified cultivators across India at fair wholesale rates.
          </p>
        </div>

        <button 
          onClick={onOpenPostModal} 
          className="btn-primary post-produce-header-btn"
        >
          <PlusCircle size={20} />
          <span>{t.postProduce}</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="mandi-filter-bar glass-panel">
        <div className="search-input-wrap">
          <Search size={18} className="search-icon" />
          <input 
            type="text"
            placeholder="Search by crop, variety, farmer name, or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input search-input"
          />
        </div>

        <div className="category-pills-bar no-margin">
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
      </div>

      {/* Produce Grid */}
      <div className="marketplace-grid">
        {filteredListings.length === 0 ? (
          <div className="no-results-card glass-panel col-span-all">
            <ShoppingBag size={42} className="empty-icon" />
            <h3>No Produce Lots Found</h3>
            <p>Be the first farmer to list this crop or modify your search filters.</p>
            <button onClick={onOpenPostModal} className="btn-primary mt-3">
              <PlusCircle size={18} />
              <span>List Your Harvest Now</span>
            </button>
          </div>
        ) : (
          filteredListings.map((item) => {
            const priceDifference = item.pricePerQuintal - item.mandiBenchmark;
            const isFairPrice = Math.abs(priceDifference) <= 200;

            return (
              <div key={item.id} className="produce-card glass-panel">
                {/* Crop Image & Badges */}
                <div className="produce-image-wrapper">
                  <img src={item.image} alt={item.cropName} className="produce-img" />
                  <div className="image-overlay-badges">
                    <span className="badge badge-grade">{item.grade}</span>
                    {item.isOrganic && (
                      <span className="badge badge-organic">🌱 Organic</span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="produce-content">
                  <div className="produce-title-row">
                    <div>
                      <span className="crop-cat-tag">{item.category}</span>
                      <h3 className="crop-main-name">{item.cropName}</h3>
                      <div className="crop-variety-tag">{item.variety}</div>
                    </div>
                  </div>

                  {/* Quantity and Moisture */}
                  <div className="lot-specs-row">
                    <div className="lot-spec-pill">
                      <span className="spec-label">Available:</span>
                      <b>{item.quantity} {item.unit}</b>
                    </div>
                    <div className="lot-spec-pill">
                      <Droplets size={13} />
                      <span>Moisture: <b>{item.moisturePercent}</b></span>
                    </div>
                    <div className="lot-spec-pill">
                      <Calendar size={13} />
                      <span>{item.harvestDate}</span>
                    </div>
                  </div>

                  <p className="produce-description">{item.description}</p>

                  {/* Price Comparison Block */}
                  <div className="pricing-box">
                    <div>
                      <span className="price-title">Asking Price:</span>
                      <div className="asking-price">
                        ₹{item.pricePerQuintal.toLocaleString()}
                        <span className="unit">/Qtl</span>
                      </div>
                    </div>
                    <div className="mandi-ref-box">
                      <span className="ref-label">Mandi Rate:</span>
                      <span className="ref-val">₹{item.mandiBenchmark.toLocaleString()}/Qtl</span>
                      <span className={`diff-tag ${priceDifference >= 0 ? 'premium' : 'discount'}`}>
                        {priceDifference >= 0 ? `+₹${priceDifference} Premium` : `-₹${Math.abs(priceDifference)} Discount`}
                      </span>
                    </div>
                  </div>

                  {/* Farmer Credential Bar */}
                  <div className="farmer-credential-bar">
                    <div className="farmer-avatar-col">
                      <div className="farmer-avatar-circle">
                        {item.farmerName.charAt(0)}
                      </div>
                      <div>
                        <div className="farmer-name">
                          {item.farmerName}
                          <CheckCircle2 size={14} className="verified-icon" title="KYC Verified Farmer" />
                        </div>
                        <div className="farmer-location">
                          <MapPin size={12} />
                          <span>{item.village}, {item.state}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="produce-card-actions">
                    <button 
                      onClick={() => onOpenBidModal(item)} 
                      className="btn-primary bid-btn"
                    >
                      <Gavel size={17} />
                      <span>Place Bid / Buy Lot</span>
                    </button>
                    <a 
                      href={`tel:${item.phone}`} 
                      className="btn-secondary call-farmer-btn"
                      title="Direct Call Farmer"
                    >
                      <Phone size={17} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
