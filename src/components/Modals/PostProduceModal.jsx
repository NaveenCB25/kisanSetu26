import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ShoppingBag, Calculator } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PostProduceModal({ isOpen, onClose, onAddListing }) {
  const [formData, setFormData] = useState({
    farmerName: '',
    phone: '',
    village: '',
    state: 'Punjab',
    cropName: 'Wheat (गेहूं)',
    category: 'Grains',
    variety: 'Sharbati HD-3226',
    quantity: 50,
    unit: 'Quintals',
    pricePerQuintal: 2450,
    mandiBenchmark: 2380,
    grade: 'Grade A+ (Premium)',
    isOrganic: false,
    harvestDate: 'Current Harvest',
    moisturePercent: '11%',
    description: 'Fresh clean grain, threshed under dry sun, high test weight.',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80'
  });

  if (!isOpen) return null;

  const totalValue = (formData.quantity || 0) * (formData.pricePerQuintal || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLot = {
      ...formData,
      id: `crop-${Date.now()}`,
      quantity: Number(formData.quantity),
      pricePerQuintal: Number(formData.pricePerQuintal),
      bidsCount: 0,
      highestBid: Number(formData.pricePerQuintal),
      status: 'Available'
    };

    onAddListing(newLot);

    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback
    }

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade">
        <div className="modal-header">
          <div className="modal-header-title">
            <ShoppingBag size={22} className="modal-icon-green" />
            <div>
              <h3>List Harvest for Direct Sale (फसल बिक्री प्रविष्टि)</h3>
              <p>Directly reach 2,500+ verified buyers with zero middleman fee.</p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Farmer Contact Info */}
          <div className="form-row two-cols">
            <div className="form-group">
              <label>Farmer Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sardar Harpreet Singh"
                value={formData.farmerName}
                onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Contact Mobile No. *</label>
              <input
                type="tel"
                required
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row two-cols">
            <div className="form-group">
              <label>Village & District *</label>
              <input
                type="text"
                required
                placeholder="e.g. Khanna, Ludhiana"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>State *</label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="form-select"
              >
                <option value="Punjab">Punjab</option>
                <option value="Haryana">Haryana</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Telangana">Telangana</option>
              </select>
            </div>
          </div>

          {/* Crop Specifications */}
          <div className="form-row two-cols">
            <div className="form-group">
              <label>Crop Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sharbati Wheat"
                value={formData.cropName}
                onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-select"
              >
                <option value="Grains">Grains (अनाज)</option>
                <option value="Vegetables">Vegetables (सब्जियां)</option>
                <option value="Oilseeds">Oilseeds (तिलहन)</option>
                <option value="Cash Crops">Cash Crops (नकदी फसलें)</option>
                <option value="Pulses">Pulses (दालें)</option>
              </select>
            </div>
          </div>

          <div className="form-row two-cols">
            <div className="form-group">
              <label>Quantity (in Quintals) *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Your Asking Price (₹ per Quintal) *</label>
              <input
                type="number"
                min="100"
                required
                value={formData.pricePerQuintal}
                onChange={(e) => setFormData({ ...formData, pricePerQuintal: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row two-cols">
            <div className="form-group">
              <label>Quality Grade</label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="form-select"
              >
                <option value="Grade A+ (Premium)">Grade A+ (Premium)</option>
                <option value="Grade A (Standard Good)">Grade A (Standard Good)</option>
                <option value="Export Quality">Export Quality</option>
              </select>
            </div>
            <div className="form-group">
              <label>Organic Certified?</label>
              <select
                value={formData.isOrganic ? 'yes' : 'no'}
                onChange={(e) => setFormData({ ...formData, isOrganic: e.target.value === 'yes' })}
                className="form-select"
              >
                <option value="no">Conventional Farming</option>
                <option value="yes">100% Organic / Jaivik</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Crop Description & Details</label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-input"
            ></textarea>
          </div>

          {/* Real-time Earnings Calculator Box */}
          <div className="earnings-preview-box">
            <div className="earnings-icon-col">
              <Calculator size={22} className="calc-icon" />
            </div>
            <div>
              <span className="earnings-label">Total Estimated Produce Value:</span>
              <div className="earnings-amount">
                ₹{totalValue.toLocaleString()} 
                <span className="net-tag">(Direct to your Bank Account)</span>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="modal-actions-row">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Sparkles size={17} />
              <span>Publish Listing to Kisan Bazaar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
