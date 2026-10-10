import React, { useState } from 'react';
import { X, Calculator, CheckCircle2, Award, ArrowRight } from 'lucide-react';
import { governmentSchemes } from '../../data/schemesData';

export default function EligibilityModal({ isOpen, onClose }) {
  const [landAcres, setLandAcres] = useState(3.5);
  const [farmerCategory, setFarmerCategory] = useState('Small'); // Marginal, Small, Medium
  const [state, setState] = useState('All States');

  if (!isOpen) return null;

  // Calculate matching schemes based on land size
  const matchingSchemes = governmentSchemes.filter((scheme) => {
    return landAcres >= scheme.eligibility.minLand && landAcres <= scheme.eligibility.maxLand;
  });

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade">
        <div className="modal-header">
          <div className="modal-header-title">
            <Calculator size={22} className="modal-icon-green" />
            <div>
              <h3>Government Scheme Eligibility Calculator (पात्रता गणक)</h3>
              <p>Find which central & state farm subsidies you can claim right now.</p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-form">
          {/* User Parameters */}
          <div className="form-row two-cols">
            <div className="form-group">
              <label>Total Agricultural Landholding (in Acres) *</label>
              <input
                type="number"
                step="0.5"
                min="0.1"
                value={landAcres}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setLandAcres(val);
                  if (val <= 2.5) setFarmerCategory('Marginal');
                  else if (val <= 5) setFarmerCategory('Small');
                  else setFarmerCategory('Medium');
                }}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Farmer Category</label>
              <select
                value={farmerCategory}
                onChange={(e) => setFarmerCategory(e.target.value)}
                className="form-select"
              >
                <option value="Marginal">Marginal Farmer (&lt; 2.5 Acres)</option>
                <option value="Small">Small Farmer (2.5 - 5.0 Acres)</option>
                <option value="Medium">Medium / Large Farmer (&gt; 5.0 Acres)</option>
              </select>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="eligibility-results-card">
            <div className="result-stat-col">
              <span className="res-label">Qualifying Schemes</span>
              <div className="res-number">{matchingSchemes.length} of {governmentSchemes.length}</div>
            </div>
            <div className="result-benefit-col">
              <span className="res-label">Estimated Annual Benefits</span>
              <div className="res-value">Up to ₹1,40,000+ in Subsidies</div>
            </div>
          </div>

          {/* List of matched schemes */}
          <div className="matched-schemes-list">
            <h4>Eligible Schemes for Your Farm Profile:</h4>
            {matchingSchemes.map((scheme) => (
              <div key={scheme.id} className="matched-scheme-item">
                <div className="matched-scheme-icon">
                  <CheckCircle2 size={18} className="match-check" />
                </div>
                <div className="matched-scheme-info">
                  <div className="matched-scheme-title">{scheme.name}</div>
                  <span className="matched-scheme-benefit">{scheme.benefit}</span>
                </div>
                <a 
                  href={scheme.portalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="matched-link-btn"
                >
                  <span>Apply</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            ))}
          </div>

          <div className="modal-actions-row">
            <button type="button" onClick={onClose} className="btn-primary w-full">
              Close Calculator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
