import React, { useState } from 'react';
import { 
  Landmark, 
  Search, 
  CheckCircle2, 
  ExternalLink, 
  PhoneCall, 
  Calculator, 
  FileText, 
  Award, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { governmentSchemes } from '../data/schemesData';
import { translations } from '../data/translations';

export default function SchemesView({ currentLang, onOpenEligibilityModal }) {
  const t = translations[currentLang] || translations.en;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All', 
    'Direct Income Support', 
    'Solar Irrigation & Energy', 
    'Crop Insurance', 
    'Subsidized Agri Loans', 
    'Machinery Subsidy', 
    'Micro-Irrigation'
  ];

  const filteredSchemes = governmentSchemes.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="schemes-page animate-fade">
      {/* Header */}
      <div className="section-header-box schemes-header-box">
        <div>
          <span className="badge badge-blue">Ministry of Agriculture & Farmers Welfare</span>
          <h2 className="section-title">{t.schemes} (सरकारी योजनाएं व सब्सिडी)</h2>
          <p className="section-subtitle">
            Transparent guide to Central & State Government agricultural subsidy schemes, eligibility checklists, and direct online application links.
          </p>
        </div>

        <button 
          onClick={onOpenEligibilityModal} 
          className="btn-gold eligibility-btn-header"
        >
          <Calculator size={19} />
          <span>{t.eligibilityCheck}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="mandi-filter-bar glass-panel">
        <div className="search-input-wrap">
          <Search size={18} className="search-icon" />
          <input 
            type="text"
            placeholder="Search scheme name, subsidy keyword or benefit..."
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

      {/* Schemes Grid */}
      <div className="schemes-cards-grid">
        {filteredSchemes.map((scheme) => (
          <div key={scheme.id} className="scheme-card glass-panel">
            <div className="scheme-card-header">
              <div>
                <span className="badge badge-green">{scheme.category}</span>
                <h3 className="scheme-name">{scheme.name}</h3>
              </div>
              <div className="subsidy-percent-badge">{scheme.subsidyPercent}</div>
            </div>

            {/* Benefit Box */}
            <div className="scheme-benefit-box">
              <span className="benefit-label">Key Financial Benefit:</span>
              <div className="benefit-highlight">{scheme.benefit}</div>
            </div>

            <p className="scheme-desc">{scheme.description}</p>

            {/* Eligibility Highlights */}
            <div className="scheme-eligibility-block">
              <span className="block-label">Eligibility Highlights:</span>
              <p className="eligibility-text">{scheme.eligibility.keyRequirements}</p>
            </div>

            {/* Documents Checklist */}
            <div className="scheme-documents-block">
              <span className="block-label">Required Documents:</span>
              <div className="doc-tags-wrap">
                {scheme.documentsRequired.map((doc, idx) => (
                  <span key={idx} className="doc-tag">
                    <FileText size={12} /> {doc}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer with Links and Helpline */}
            <div className="scheme-card-footer">
              <div className="scheme-helpline">
                <PhoneCall size={14} className="helpline-icon" />
                <span>Helpline: <b>{scheme.helpline}</b></span>
              </div>

              <a 
                href={scheme.portalUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary apply-scheme-btn"
              >
                <span>Official Portal</span>
                <ExternalLink size={15} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
