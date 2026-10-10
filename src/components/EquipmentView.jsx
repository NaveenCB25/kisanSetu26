import React, { useState } from 'react';
import { 
  Tractor, 
  Search, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Phone, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  User, 
  Zap,
  Tag
} from 'lucide-react';
import { initialEquipmentListings } from '../data/equipmentData';
import { translations } from '../data/translations';

export default function EquipmentView({ currentLang, onOpenBookModal }) {
  const t = translations[currentLang] || translations.en;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Tractor & Tillage', 'Drone Spraying', 'Harvesting', 'Land Preparation', 'Sowing & Seeding'];

  const filteredEquipment = initialEquipmentListings.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.village.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="equipment-page animate-fade">
      {/* Header */}
      <div className="section-header-box">
        <div>
          <span className="badge badge-amber">Custom Hiring Center (CHC) Network</span>
          <h2 className="section-title">{t.machinery} (यंत्र सेतु - कृषि यंत्र किराया)</h2>
          <p className="section-subtitle">
            Rent modern tractors, high-capacity combine harvesters, laser levellers and spraying drones from nearby farmers at transparent hourly and per-acre rates.
          </p>
        </div>

        <div className="equipment-header-stats">
          <div className="meta-pill">
            <Zap size={14} className="zap-icon" />
            <span>Average Dispatch: Within 2 Hours</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mandi-filter-bar glass-panel">
        <div className="search-input-wrap">
          <Search size={18} className="search-icon" />
          <input 
            type="text"
            placeholder="Search equipment, tractor model, or village..."
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

      {/* Equipment Cards Grid */}
      <div className="equipment-cards-grid">
        {filteredEquipment.map((eq) => (
          <div key={eq.id} className="equipment-card glass-panel">
            {/* Image & Category Tag */}
            <div className="equipment-image-box">
              <img src={eq.image} alt={eq.name} className="eq-img" />
              <div className="eq-cat-badge">{eq.category}</div>
              <div className="eq-distance-badge">
                <MapPin size={12} /> {eq.distanceKm} km away
              </div>
            </div>

            {/* Content */}
            <div className="equipment-content">
              <div className="eq-header-row">
                <h3 className="eq-name">{eq.name}</h3>
                <div className="eq-rating-box">
                  <Star size={14} className="star-icon filled" />
                  <span>{eq.rating}</span>
                  <span className="reviews-cnt">({eq.reviewsCount})</span>
                </div>
              </div>

              {/* Pricing Block */}
              <div className="eq-rates-block">
                {eq.ratePerHour && (
                  <div className="rate-item">
                    <span className="rate-label">Hourly Rate:</span>
                    <div className="rate-num">
                      ₹{eq.ratePerHour.toLocaleString()}
                      <span className="rate-unit">/hour</span>
                    </div>
                  </div>
                )}
                {eq.ratePerAcre && (
                  <div className="rate-item">
                    <span className="rate-label">Per Acre Rate:</span>
                    <div className="rate-num">
                      ₹{eq.ratePerAcre.toLocaleString()}
                      <span className="rate-unit">/acre</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Specs & Inclusions */}
              <div className="inclusions-pills-row">
                <span className={`inclusion-badge ${eq.includesOperator ? 'yes' : 'no'}`}>
                  {eq.includesOperator ? '✓ Operator Included' : '✕ Self Operate'}
                </span>
                <span className={`inclusion-badge ${eq.includesDiesel ? 'yes' : 'no'}`}>
                  {eq.includesDiesel ? '✓ Diesel Fuel Included' : '✕ Fuel by Hirer'}
                </span>
              </div>

              <div className="eq-specs-tags">
                {eq.specs.map((spec, idx) => (
                  <span key={idx} className="spec-tag">• {spec}</span>
                ))}
              </div>

              <p className="eq-description">{eq.description}</p>

              {/* Owner Info & Actions */}
              <div className="eq-footer">
                <div className="owner-info">
                  <User size={15} className="owner-icon" />
                  <div>
                    <span className="owner-name">{eq.ownerName}</span>
                    <span className="owner-village">{eq.village}</span>
                  </div>
                </div>

                <div className="eq-actions-row">
                  <button 
                    onClick={() => onOpenBookModal(eq)} 
                    className="btn-primary book-eq-btn"
                  >
                    <Calendar size={16} />
                    <span>Book Now</span>
                  </button>
                  <a 
                    href={`tel:${eq.phone}`} 
                    className="btn-secondary call-owner-btn"
                    title="Call Owner Directly"
                  >
                    <Phone size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
