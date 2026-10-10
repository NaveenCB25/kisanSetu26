import React, { useState } from 'react';
import { 
  Stethoscope, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Leaf, 
  Sparkles, 
  FlaskConical, 
  RefreshCw, 
  Volume2,
  ChevronRight
} from 'lucide-react';
import { cropDiseases } from '../data/diseaseData';
import { translations } from '../data/translations';

export default function CropDoctorView({ currentLang, onSpeakText }) {
  const t = translations[currentLang] || translations.en;
  const [selectedDisease, setSelectedDisease] = useState(cropDiseases[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImagePreview, setUploadedImagePreview] = useState(null);

  const handleSelectSample = (disease) => {
    setIsAnalyzing(true);
    setUploadedImagePreview(disease.sampleImage);
    setTimeout(() => {
      setSelectedDisease(disease);
      setIsAnalyzing(false);
    }, 700);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImagePreview(url);
      setIsAnalyzing(true);
      // Simulate intelligent neural network classification
      setTimeout(() => {
        // Randomly pick one or keep relevant
        const randomDisease = cropDiseases[Math.floor(Math.random() * cropDiseases.length)];
        setSelectedDisease(randomDisease);
        setIsAnalyzing(false);
      }, 1000);
    }
  };

  const readDiagnosisAloud = () => {
    if (!selectedDisease) return;
    const textToSpeak = `फसल रोग निदान: ${selectedDisease.crop}. बीमारी का नाम: ${selectedDisease.diseaseName}. जैविक उपचार: ${selectedDisease.organicRemedy.recipe}. रासायनिक उपचार: ${selectedDisease.chemicalRemedy.products[0]}`;
    onSpeakText(textToSpeak);
  };

  return (
    <div className="crop-doctor-page animate-fade">
      {/* Header */}
      <div className="section-header-box">
        <div>
          <span className="badge badge-green">AI Plant Pathology Lab</span>
          <h2 className="section-title">{t.cropDoctor} (एआई फसल डॉक्टर)</h2>
          <p className="section-subtitle">
            Upload or capture clear photos of affected crop leaves, fruits or stems for instant scientific diagnosis and curative remedies.
          </p>
        </div>

        <button onClick={readDiagnosisAloud} className="btn-secondary voice-listen-btn">
          <Volume2 size={18} />
          <span>Listen in Voice</span>
        </button>
      </div>

      {/* Main Grid: Upload & Diagnostic Report */}
      <div className="doctor-main-grid">
        {/* Left Column: Image Uploader and Sample Leaves */}
        <div className="doctor-input-col">
          <div className="uploader-card glass-panel">
            <h3 className="card-box-title">1. Upload Affected Leaf Photo</h3>
            
            <label className="dropzone-area">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden-file-input" 
              />
              {uploadedImagePreview ? (
                <div className="preview-container">
                  <img src={uploadedImagePreview} alt="Crop Scan" className="uploaded-leaf-img" />
                  <div className="re-upload-badge">
                    <RefreshCw size={14} /> Click to Scan Another
                  </div>
                </div>
              ) : (
                <div className="dropzone-placeholder">
                  <div className="upload-icon-circle">
                    <UploadCloud size={32} />
                  </div>
                  <h4>Tap to Upload or Take Photo</h4>
                  <p>Supports JPG, PNG from mobile camera or gallery</p>
                  <span className="btn-secondary btn-sm-upload">Browse Image</span>
                </div>
              )}
            </label>

            {/* Quick Sample diseased leaves for instant testing */}
            <div className="sample-leaves-section">
              <span className="sample-title">Or click sample leaf to test AI:</span>
              <div className="sample-chips-grid">
                {cropDiseases.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => handleSelectSample(d)}
                    className={`sample-chip ${selectedDisease?.id === d.id ? 'active' : ''}`}
                  >
                    <Leaf size={14} />
                    <span>{d.crop.split(' ')[0]}: {d.diseaseName.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Pathology Report */}
        <div className="doctor-report-col">
          {isAnalyzing ? (
            <div className="analyzing-state-card glass-panel">
              <div className="scanner-animation-wrapper">
                <div className="radar-spinner"></div>
                <Sparkles size={36} className="sparkle-center" />
              </div>
              <h3>Analyzing Leaf Pathology with AI...</h3>
              <p>Scanning fungal pustules, bacterial lesions, chlorosis pattern & foliar necrosis</p>
            </div>
          ) : selectedDisease ? (
            <div className="report-card glass-panel">
              {/* Header with Disease & Confidence */}
              <div className="report-header">
                <div>
                  <div className="crop-tag-pill">{selectedDisease.crop}</div>
                  <h2 className="disease-headline">{selectedDisease.diseaseName}</h2>
                  <div className="scientific-name">Pathogen: <i>{selectedDisease.scientificName}</i></div>
                </div>

                <div className="confidence-meter-box">
                  <div className="confidence-percent">{selectedDisease.confidenceScore}</div>
                  <span className="confidence-label">AI Match Confidence</span>
                  <div className="confidence-bar">
                    <div className="confidence-fill" style={{ width: selectedDisease.confidenceScore }}></div>
                  </div>
                </div>
              </div>

              {/* Severity Alert */}
              <div className={`severity-banner ${selectedDisease.severityLevel}`}>
                <ShieldAlert size={20} />
                <span><b>Severity Level:</b> {selectedDisease.severity}</span>
              </div>

              {/* Symptoms Checklist */}
              <div className="report-section">
                <h4 className="section-heading">Diagnosed Symptoms</h4>
                <ul className="symptoms-checklist">
                  {selectedDisease.symptoms.map((symptom, idx) => (
                    <li key={idx}>
                      <CheckCircle2 size={16} className="check-bullet" />
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Biological / Organic Treatment */}
              <div className="treatment-box organic">
                <div className="treatment-header">
                  <Leaf size={18} className="treat-icon" />
                  <h4>Organic / Bio-Pesticide Solution</h4>
                </div>
                <p className="treatment-title">{selectedDisease.organicRemedy.treatment}</p>
                <div className="treatment-recipe">{selectedDisease.organicRemedy.recipe}</div>
              </div>

              {/* Recommended Chemical Fungicide / Pesticide */}
              <div className="treatment-box chemical">
                <div className="treatment-header">
                  <FlaskConical size={18} className="treat-icon" />
                  <h4>Chemical Treatment & Dosage (Per Acre)</h4>
                </div>
                <ul className="chemical-products-list">
                  {selectedDisease.chemicalRemedy.products.map((prod, idx) => (
                    <li key={idx} className="chemical-item">
                      <b>Option {idx + 1}:</b> {prod}
                    </li>
                  ))}
                </ul>
                <div className="waiting-period-tag">
                  ⏱️ Safe Harvest Interval: {selectedDisease.chemicalRemedy.waitingPeriod}
                </div>
              </div>

              {/* Cultural Prevention Tips */}
              <div className="prevention-box">
                <h4 className="section-heading">Agronomic Prevention Tips</h4>
                <div className="prevention-tags">
                  {selectedDisease.preventionTips.map((tip, idx) => (
                    <div key={idx} className="prevention-pill">
                      <span>• {tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
