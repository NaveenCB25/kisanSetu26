import React, { useState } from 'react';
import { 
  Scale, 
  Calendar, 
  Clock, 
  Truck, 
  CheckCircle2, 
  ArrowRight, 
  Radio, 
  Building2, 
  AlertTriangle, 
  User, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  Layers, 
  FileText, 
  Search,
  Zap,
  TrendingUp,
  Landmark
} from 'lucide-react';
import { configuredMandis, officialMSPRates } from '../data/procurementData';

export default function ProcurementHome({ 
  tokens, 
  onOpenBookModal, 
  onSelectRole,
  onViewGatePass 
}) {
  const [selectedMandiFilter, setSelectedMandiFilter] = useState('All');
  const [searchTokenQuery, setSearchTokenQuery] = useState('');

  // Group tokens for live board
  const currentlyAtWeighbridge = tokens.filter((t) => t.status === 'AT_WEIGHBRIDGE');
  const currentlyCalled = tokens.filter((t) => t.status === 'CALLED');
  const inYardQueue = tokens.filter((t) => t.status === 'IN_YARD');
  const upcomingScheduled = tokens.filter((t) => t.status === 'SCHEDULED');

  const filteredQueue = tokens.filter((t) => {
    const matchMandi = selectedMandiFilter === 'All' || t.mandiId === selectedMandiFilter;
    const matchSearch = 
      t.tokenNumber.toLowerCase().includes(searchTokenQuery.toLowerCase()) ||
      t.vehicleNumber.toLowerCase().includes(searchTokenQuery.toLowerCase()) ||
      t.farmerName.toLowerCase().includes(searchTokenQuery.toLowerCase());
    return matchMandi && matchSearch && t.status !== 'COMPLETED';
  });

  return (
    <div className="procurement-home-page animate-fade">
      {/* 1. Procurement-Focused Hero Section */}
      <section className="procurement-hero">
        <div className="hero-badge-strip">
          <span className="badge badge-green">
            <Radio size={14} className="pulse-icon" /> Live Anti-Congestion System Active
          </span>
          <span className="badge badge-amber">Ministry of Agriculture & FCI Integrated</span>
        </div>

        <h1 className="hero-main-title">
          Smart Mandi Procurement & <br />
          <span className="hero-gradient-text">Queue Management System</span>
        </h1>

        <p className="hero-desc-para">
          Say goodbye to 24-hour highway bottlenecks and chaotic gate queues. Book your verified procurement slot, track your live token position, proceed through dual automated weighbridges, and receive guaranteed MSP payments directly via DBT.
        </p>

        {/* Primary and Secondary Actions */}
        <div className="hero-cta-buttons">
          <button onClick={onOpenBookModal} className="btn-primary hero-btn-main">
            <Calendar size={19} />
            <span>Book Procurement Slot</span>
          </button>
          
          <a href="#live-queue-board" className="btn-secondary hero-btn-sub">
            <Radio size={18} />
            <span>View Live Mandi Queue ({tokens.filter(t => t.status !== 'COMPLETED').length} Active)</span>
          </a>
        </div>

        {/* Key Operational Impact Counters */}
        <div className="hero-impact-stats">
          <div className="impact-stat-item">
            <div className="impact-num">18 Mins</div>
            <span className="impact-lbl">Avg Yard Clearance (Down from 14 hrs)</span>
          </div>
          <div className="impact-stat-item">
            <div className="impact-num">100%</div>
            <span className="impact-lbl">Digital Dual-Weighbridge Accuracy</span>
          </div>
          <div className="impact-stat-item">
            <div className="impact-num">Zero</div>
            <span className="impact-lbl">Highway Congestion Outside Gate</span>
          </div>
          <div className="impact-stat-item">
            <div className="impact-num">48 Hours</div>
            <span className="impact-lbl">Guaranteed Direct DBT Payment</span>
          </div>
        </div>
      </section>

      {/* 2. Three Dedicated Portals Entry Point Grid */}
      <section className="portals-launch-section">
        <div className="section-title-wrap">
          <span className="badge badge-blue">Role-Based Access</span>
          <h2 className="section-title">Direct Portal Access</h2>
          <p className="section-subtitle">Dedicated operational workspaces tailored for farmers, weighing staff, and district administrators.</p>
        </div>

        <div className="portals-cards-grid">
          {/* Card 1: Farmer Portal */}
          <div className="portal-launch-card glass-panel" onClick={() => onSelectRole('farmer')}>
            <div className="portal-card-top">
              <div className="portal-icon-box green">
                <User size={24} />
              </div>
              <span className="badge badge-green">For Cultivators</span>
            </div>
            <h3>Farmer Portal (किसान पोर्टल)</h3>
            <p>Schedule crop arrival slots, generate QR digital gate passes, monitor live queue status, and track MSP direct bank transfers.</p>
            <div className="portal-card-footer">
              <span>Open Farmer Dashboard</span>
              <ArrowRight size={16} />
            </div>
          </div>

          {/* Card 2: Staff Console */}
          <div className="portal-launch-card glass-panel" onClick={() => onSelectRole('staff')}>
            <div className="portal-card-top">
              <div className="portal-icon-box amber">
                <Scale size={24} />
              </div>
              <span className="badge badge-amber">For Yard Staff</span>
            </div>
            <h3>Mandi Staff Console (मंडी संचालन)</h3>
            <p>Security gate check-in, token calling to Bay 1 & Bay 2, Gross & Tare weighbridge entry, quality inspection, and slip generation.</p>
            <div className="portal-card-footer">
              <span>Open Staff Console</span>
              <ArrowRight size={16} />
            </div>
          </div>

          {/* Card 3: District Admin */}
          <div className="portal-launch-card glass-panel" onClick={() => onSelectRole('admin')}>
            <div className="portal-card-top">
              <div className="portal-icon-box purple">
                <Building2 size={24} />
              </div>
              <span className="badge badge-blue">For Administration</span>
            </div>
            <h3>District Administration (जिला प्रशासन)</h3>
            <p>Real-time yard congestion monitors, procurement bottlenecks, quota configurations, MSP tracking, and operational audit trails.</p>
            <div className="portal-card-footer">
              <span>Open District Analytics</span>
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Live Mandi Operational Status Cards */}
      <section className="mandi-status-section">
        <div className="section-title-wrap">
          <span className="badge badge-green">Real-Time Yard Telemetry</span>
          <h2 className="section-title">Live Mandi Operations Status</h2>
          <p className="section-subtitle">Real-time capacity, queue length, and waiting times across monitored APMC procurement yards.</p>
        </div>

        <div className="mandis-status-grid">
          {configuredMandis.map((mandi) => {
            const isCongested = mandi.status === 'CONGESTED';
            const capacityPercent = Math.round((mandi.currentQueueCount / mandi.dailyCapacityTrolleys) * 100);

            return (
              <div key={mandi.id} className="mandi-telemetry-card glass-panel">
                <div className="mandi-card-header">
                  <div>
                    <span className="mandi-state-pill">{mandi.district}, {mandi.state}</span>
                    <h3 className="mandi-title">{mandi.name}</h3>
                  </div>
                  <span className={`status-pill ${isCongested ? 'congested' : 'smooth'}`}>
                    <span className="dot"></span>
                    {mandi.status}
                  </span>
                </div>

                {/* Key Metrics Grid */}
                <div className="mandi-metrics-row">
                  <div className="metric-box">
                    <span className="m-lbl">Queue Length</span>
                    <div className="m-val highlight">
                      <Truck size={17} />
                      <b>{mandi.currentQueueCount}</b> Trolleys
                    </div>
                  </div>

                  <div className="metric-box">
                    <span className="m-lbl">Avg Waiting Time</span>
                    <div className="m-val">
                      <Clock size={17} />
                      <b>{mandi.avgWaitMinutes}</b> Mins
                    </div>
                  </div>

                  <div className="metric-box">
                    <span className="m-lbl">Active Weighbridges</span>
                    <div className="m-val">
                      <Scale size={17} />
                      <b>{mandi.openBays} of {mandi.totalBays}</b> Bays Open
                    </div>
                  </div>
                </div>

                {/* Yard Capacity Progress Bar */}
                <div className="yard-capacity-bar-wrap">
                  <div className="capacity-label-row">
                    <span>Daily Capacity: <b>{mandi.dailyCapacityTrolleys} Trolleys/Day</b></span>
                    <span>{capacityPercent}% Occupied</span>
                  </div>
                  <div className="capacity-progress-track">
                    <div 
                      className={`capacity-fill ${capacityPercent > 70 ? 'high' : 'normal'}`}
                      style={{ width: `${Math.min(capacityPercent * 2, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Procuring Crops & Agency */}
                <div className="mandi-crops-footer">
                  <div className="crops-tags">
                    {mandi.procuringCrops.map((c, idx) => (
                      <span key={idx} className="crop-pill">• {c}</span>
                    ))}
                  </div>
                  <span className="agency-tag">{mandi.agency}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Live Public Queue Board (Token Display) */}
      <section id="live-queue-board" className="live-queue-board-section">
        <div className="queue-board-header glass-panel">
          <div>
            <div className="live-indicator-row">
              <span className="live-red-dot"></span>
              <span className="live-board-title">PUBLIC LIVE MANDI QUEUE & TOKEN BOARD</span>
            </div>
            <p className="board-sub">Refreshed live every 10 seconds. Check your token before pulling into gate.</p>
          </div>

          {/* Filter by Mandi */}
          <div className="board-filter-wrap">
            <select
              value={selectedMandiFilter}
              onChange={(e) => setSelectedMandiFilter(e.target.value)}
              className="form-select board-select"
            >
              <option value="All">All Mandis ({tokens.length} Total)</option>
              {configuredMandis.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Token Stage Columns */}
        <div className="token-stages-grid">
          {/* Stage 1: Now Calling to Weighbridge */}
          <div className="token-stage-col called-col glass-panel">
            <div className="stage-header">
              <div className="stage-title-wrap">
                <Zap size={18} className="zap-icon" />
                <h4>Now Calling to Bay</h4>
              </div>
              <span className="stage-count-badge green">{currentlyCalled.length}</span>
            </div>
            <div className="tokens-list">
              {currentlyCalled.length === 0 ? (
                <div className="empty-stage-note">No tokens being called right now.</div>
              ) : (
                currentlyCalled.map((t) => (
                  <div key={t.id} className="live-token-card calling-card animate-pulse">
                    <div className="tok-card-top">
                      <span className="tok-number">{t.tokenNumber}</span>
                      <span className="tok-bay-assigned">{t.currentBay || 'Bay 1'}</span>
                    </div>
                    <div className="tok-veh-info">
                      <Truck size={14} />
                      <b>{t.vehicleNumber}</b> • {t.farmerName}
                    </div>
                    <div className="tok-crop-spec">{t.crop} ({t.estimatedQuantityQtl} Qtl)</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Stage 2: At Weighbridge (Gross / Tare Scale) */}
          <div className="token-stage-col scale-col glass-panel">
            <div className="stage-header">
              <div className="stage-title-wrap">
                <Scale size={18} className="scale-icon" />
                <h4>At Weighbridge (Weighing)</h4>
              </div>
              <span className="stage-count-badge amber">{currentlyAtWeighbridge.length}</span>
            </div>
            <div className="tokens-list">
              {currentlyAtWeighbridge.length === 0 ? (
                <div className="empty-stage-note">Scales currently clear.</div>
              ) : (
                currentlyAtWeighbridge.map((t) => (
                  <div key={t.id} className="live-token-card weighing-card">
                    <div className="tok-card-top">
                      <span className="tok-number">{t.tokenNumber}</span>
                      <span className="tok-bay-assigned amber">{t.currentBay || 'Bay 1 (Gross Weighing)'}</span>
                    </div>
                    <div className="tok-veh-info">
                      <Truck size={14} />
                      <b>{t.vehicleNumber}</b> • {t.farmerName}
                    </div>
                    <div className="tok-crop-spec">{t.crop} • Scale In Progress</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Stage 3: In Yard (Checked in & Waiting in Parking) */}
          <div className="token-stage-col yard-col glass-panel">
            <div className="stage-header">
              <div className="stage-title-wrap">
                <Layers size={18} className="yard-icon" />
                <h4>In Yard (Trolley Parking)</h4>
              </div>
              <span className="stage-count-badge blue">{inYardQueue.length}</span>
            </div>
            <div className="tokens-list">
              {inYardQueue.length === 0 ? (
                <div className="empty-stage-note">No vehicles currently waiting in yard.</div>
              ) : (
                inYardQueue.map((t, idx) => (
                  <div key={t.id} className="live-token-card yard-card">
                    <div className="tok-card-top">
                      <span className="tok-number">{t.tokenNumber}</span>
                      <span className="tok-wait-pill">Pos #{idx + 1} • ~{t.estimatedWaitMins}m wait</span>
                    </div>
                    <div className="tok-veh-info">
                      <Truck size={14} />
                      <b>{t.vehicleNumber}</b>
                    </div>
                    <div className="tok-crop-spec">{t.crop} ({t.estimatedQuantityQtl} Qtl) • Gate In: {t.gateCheckInTime}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Stage 4: Upcoming Scheduled Slots */}
          <div className="token-stage-col upcoming-col glass-panel">
            <div className="stage-header">
              <div className="stage-title-wrap">
                <Clock size={18} className="clock-icon" />
                <h4>Scheduled Next Batches</h4>
              </div>
              <span className="stage-count-badge gray">{upcomingScheduled.length}</span>
            </div>
            <div className="tokens-list">
              {upcomingScheduled.length === 0 ? (
                <div className="empty-stage-note">All booked slots arrived.</div>
              ) : (
                upcomingScheduled.map((t) => (
                  <div key={t.id} className="live-token-card upcoming-card">
                    <div className="tok-card-top">
                      <span className="tok-number">{t.tokenNumber}</span>
                      <span className="tok-slot-time">{t.scheduledSlot}</span>
                    </div>
                    <div className="tok-veh-info">
                      <b>{t.vehicleNumber}</b> • {t.farmerName}
                    </div>
                    <div className="tok-crop-spec">{t.crop} • {t.mandiName}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. 5-Step Procurement Process Explainer */}
      <section className="process-explainer-section">
        <div className="section-title-wrap text-center">
          <span className="badge badge-amber">End-to-End Transparency</span>
          <h2 className="section-title">The 5-Step KisanSetu Procurement Lifecycle</h2>
          <p className="section-subtitle">A seamless digital workflow eliminating wait times, middlemen, and paper delays.</p>
        </div>

        <div className="process-steps-grid">
          <div className="process-step-card glass-panel">
            <div className="step-num-badge">01</div>
            <h4>Slot Booking</h4>
            <p>Farmer reserves arrival slot online, selecting crop, estimated quintals, vehicle number, and preferred mandi.</p>
          </div>

          <div className="process-step-card glass-panel">
            <div className="step-num-badge">02</div>
            <h4>Digital QR Gate Pass</h4>
            <p>Instant token generated with QR code sent via SMS. Confirms arrival window with zero highway camping.</p>
          </div>

          <div className="process-step-card glass-panel">
            <div className="step-num-badge">03</div>
            <h4>Gate QR Verification</h4>
            <p>Security scans pass in 10 seconds. Vehicle allowed into designated parking yard without physical choke points.</p>
          </div>

          <div className="process-step-card glass-panel">
            <div className="step-num-badge">04</div>
            <h4>Dual Weighbridge</h4>
            <p>Automated Gross & Tare weighing. Moisture sensor calculates net weight and generates tamper-proof slip.</p>
          </div>

          <div className="process-step-card glass-panel">
            <div className="step-num-badge">05</div>
            <h4>Direct DBT Payout</h4>
            <p>FCI/Agency releases MSP funds directly to farmer's Aadhaar-linked bank account within 24–48 hours.</p>
          </div>
        </div>
      </section>

      {/* 6. Configured Government MSP Table */}
      <section className="msp-table-section glass-panel">
        <div className="box-header">
          <div>
            <span className="badge badge-green">Government of India Gazette 2026</span>
            <h3>Configured Minimum Support Prices (MSP)</h3>
            <p className="subtext">Official procurement rates with maximum daily farmer quota caps and moisture standards.</p>
          </div>
          <button onClick={onOpenBookModal} className="btn-primary">
            <Calendar size={16} />
            <span>Book MSP Slot</span>
          </button>
        </div>

        <div className="mandi-table-wrapper">
          <table className="dashboard-mandi-table">
            <thead>
              <tr>
                <th>Crop / Commodity</th>
                <th>MSP Rate</th>
                <th>Procurement Agency</th>
                <th>FAQ Moisture Tolerance</th>
                <th>Daily Quota / Farmer</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {officialMSPRates.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="commodity-name-cell">
                      <span className="comm-title">{item.crop}</span>
                      <span className="comm-cat">{item.season}</span>
                    </div>
                  </td>
                  <td>
                    <div className="price-cell">
                      <b>₹{item.mspRate.toLocaleString()}</b>
                      <span className="price-unit"> / Qtl</span>
                    </div>
                  </td>
                  <td>
                    <span className="agency-badge">{item.procurementAgency}</span>
                  </td>
                  <td>
                    <span className="moisture-badge">{item.faqToleranceMoisture}</span>
                  </td>
                  <td>
                    <b>{item.dailyQuotaPerFarmerQtl} Quintals</b>
                  </td>
                  <td>
                    <button onClick={onOpenBookModal} className="btn-secondary btn-sm-table">
                      Book Slot
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
