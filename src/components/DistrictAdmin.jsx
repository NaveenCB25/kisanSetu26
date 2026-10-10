import React, { useState } from 'react';
import { 
  Building2, 
  TrendingUp, 
  AlertTriangle, 
  Scale, 
  Truck, 
  Clock, 
  CheckCircle2, 
  Settings, 
  ShieldCheck, 
  FileSpreadsheet, 
  Layers, 
  Edit3, 
  Save, 
  Database
} from 'lucide-react';
import { 
  configuredMandis, 
  officialMSPRates, 
  bottleneckAnalytics, 
  auditLogs 
} from '../data/procurementData';

export default function DistrictAdmin({ mspRates, onUpdateMSP }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'bottlenecks', 'config', 'audit'
  const [editingCropId, setEditingCropId] = useState(null);
  const [tempRate, setTempRate] = useState(2275);
  const [tempQuota, setTempQuota] = useState(150);

  const handleEditRate = (crop) => {
    setEditingCropId(crop.id);
    setTempRate(crop.mspRate);
    setTempQuota(crop.dailyQuotaPerFarmerQtl);
  };

  const handleSaveRate = (cropId) => {
    const updated = mspRates.map((c) => {
      if (c.id === cropId) {
        return {
          ...c,
          mspRate: Number(tempRate),
          dailyQuotaPerFarmerQtl: Number(tempQuota)
        };
      }
      return c;
    });
    onUpdateMSP(updated);
    setEditingCropId(null);
  };

  return (
    <div className="district-admin-page animate-fade">
      {/* Header */}
      <div className="portal-header-bar glass-panel admin-header">
        <div>
          <div className="header-badge-row">
            <span className="badge badge-blue">District Collector & APMC Monitoring</span>
            <span className="badge badge-green">Ludhiana & Karnal Agri Division</span>
          </div>
          <h2>District Agricultural Procurement & Queue Analytics</h2>
          <p className="console-sub">Live monitoring of 5 APMC procurement centers, automated weighbridges, and DBT fund disbursement.</p>
        </div>

        <div className="admin-header-actions">
          <button onClick={() => alert('Procurement report exported to Excel / CSV.')} className="btn-secondary">
            <FileSpreadsheet size={16} />
            <span>Export Gazette Report</span>
          </button>
        </div>
      </div>

      {/* District KPI Summary Cards */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card glass-panel">
          <span className="kpi-lbl">Today's Procurement</span>
          <div className="kpi-val highlight">
            {bottleneckAnalytics.todayDistrictProcuredTonnes.toLocaleString()} MT
          </div>
          <span className="kpi-sub">Target: {bottleneckAnalytics.dailyDistrictProcurementTargetTonnes.toLocaleString()} MT (67.4%)</span>
        </div>

        <div className="admin-kpi-card glass-panel">
          <span className="kpi-lbl">Total DBT Disbursed Today</span>
          <div className="kpi-val rupee-val">
            ₹{bottleneckAnalytics.totalDbtDisbursedTodayCrores} Crores
          </div>
          <span className="kpi-sub">Direct to Farmers' Bank Accounts</span>
        </div>

        <div className="admin-kpi-card glass-panel">
          <span className="kpi-lbl">Farmers Processed Today</span>
          <div className="kpi-val">
            {bottleneckAnalytics.totalFarmersProcessedToday} Cultivators
          </div>
          <span className="kpi-sub">Zero Queues Outside Mandi Gates</span>
        </div>

        <div className="admin-kpi-card glass-panel">
          <span className="kpi-lbl">Active Trolleys in Yards</span>
          <div className="kpi-val">
            {bottleneckAnalytics.activeTrolleysInAllMandis} Trolleys
          </div>
          <span className="kpi-sub">Across 5 District Mandis</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="farmer-tabs-bar">
        <button 
          onClick={() => setActiveTab('overview')} 
          className={`farmer-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
        >
          <span>Mandi Congestion & Telemetry</span>
        </button>
        <button 
          onClick={() => setActiveTab('bottlenecks')} 
          className={`farmer-tab-btn ${activeTab === 'bottlenecks' ? 'active' : ''}`}
        >
          <span>Bottleneck Cycle Times</span>
        </button>
        <button 
          onClick={() => setActiveTab('config')} 
          className={`farmer-tab-btn ${activeTab === 'config' ? 'active' : ''}`}
        >
          <span>Crop MSP & Daily Quotas</span>
        </button>
        <button 
          onClick={() => setActiveTab('audit')} 
          className={`farmer-tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
        >
          <span>Operational Audit Trail</span>
        </button>
      </div>

      {/* Tab 1: Mandi Congestion & Telemetry */}
      {activeTab === 'overview' && (
        <div className="admin-tab-content animate-fade">
          <div className="mandis-admin-table-wrap glass-panel">
            <h3 className="admin-sec-title">Mandi-Wise Queue Telemetry & Capacity</h3>
            <table className="dashboard-mandi-table">
              <thead>
                <tr>
                  <th>Mandi Name</th>
                  <th>District / State</th>
                  <th>Open Bays</th>
                  <th>Queue Length</th>
                  <th>Avg Wait Time</th>
                  <th>Capacity Utilization</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {configuredMandis.map((m) => {
                  const percent = Math.round((m.currentQueueCount / m.dailyCapacityTrolleys) * 100);
                  const isHigh = percent > 60;
                  return (
                    <tr key={m.id}>
                      <td><b>{m.name}</b></td>
                      <td>{m.district}, {m.state}</td>
                      <td><b>{m.openBays} of {m.totalBays}</b> Bays</td>
                      <td>
                        <span className="trolleys-cnt">
                          <Truck size={14} /> {m.currentQueueCount} Trolleys
                        </span>
                      </td>
                      <td>{m.avgWaitMinutes} mins</td>
                      <td>
                        <div className="capacity-inline-bar">
                          <div 
                            className={`c-fill ${isHigh ? 'high' : 'normal'}`}
                            style={{ width: `${Math.min(percent * 2, 100)}%` }}
                          ></div>
                          <span className="c-text">{percent}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-pill ${m.status === 'CONGESTED' ? 'congested' : 'smooth'}`}>
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Bottleneck Cycle Times */}
      {activeTab === 'bottlenecks' && (
        <div className="admin-tab-content animate-fade">
          <div className="bottlenecks-grid">
            <div className="bottleneck-card glass-panel">
              <div className="b-icon-wrap blue">
                <ShieldCheck size={26} />
              </div>
              <h4>Stage 1: Gate QR Verification</h4>
              <div className="b-time">{bottleneckAnalytics.gateVerificationAvgMins} Mins</div>
              <p>Average time taken per vehicle from arrival at outer barrier to gate pass QR scan verification.</p>
              <div className="b-metric-status normal">✓ Within Optimal Threshold (&lt; 5 mins)</div>
            </div>

            <div className="bottleneck-card glass-panel">
              <div className="b-icon-wrap green">
                <Scale size={26} />
              </div>
              <h4>Stage 2: Weighbridge Bay Cycle</h4>
              <div className="b-time">{bottleneckAnalytics.weighbridgeGrossTareAvgMins} Mins</div>
              <p>Total time spent on electronic scale: gross weight tare verification and sensor calibration.</p>
              <div className="b-metric-status normal">✓ Smooth Scale Flow (&lt; 10 mins)</div>
            </div>

            <div className="bottleneck-card glass-panel">
              <div className="b-icon-wrap amber">
                <Layers size={26} />
              </div>
              <h4>Stage 3: Unloading & Sieve Quality</h4>
              <div className="b-time">{bottleneckAnalytics.unloadingAndInspectionAvgMins} Mins</div>
              <p>Manual trolley dumping onto grain heaps, moisture meter check, and foreign matter sieving.</p>
              <div className="b-metric-status alert">⚠️ Potential Bottleneck (Labor Dependent)</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Crop MSP & Daily Quotas */}
      {activeTab === 'config' && (
        <div className="admin-tab-content animate-fade">
          <div className="msp-config-box glass-panel">
            <h3 className="admin-sec-title">Configured MSP Rates & Farmer Quota Controls</h3>
            <p className="admin-subtext">Changes made here automatically update slot booking estimates and weighbridge payout receipts.</p>

            <table className="dashboard-mandi-table">
              <thead>
                <tr>
                  <th>Crop</th>
                  <th>Agency</th>
                  <th>MSP Rate (₹/Qtl)</th>
                  <th>Daily Quota / Farmer (Qtl)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {mspRates.map((crop) => {
                  const isEditing = editingCropId === crop.id;
                  return (
                    <tr key={crop.id}>
                      <td><b>{crop.crop}</b></td>
                      <td>{crop.procurementAgency}</td>
                      <td>
                        {isEditing ? (
                          <input 
                            type="number"
                            value={tempRate}
                            onChange={(e) => setTempRate(Number(e.target.value))}
                            className="form-input form-input-sm"
                          />
                        ) : (
                          <b>₹{crop.mspRate.toLocaleString()}</b>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input 
                            type="number"
                            value={tempQuota}
                            onChange={(e) => setTempQuota(Number(e.target.value))}
                            className="form-input form-input-sm"
                          />
                        ) : (
                          <span>{crop.dailyQuotaPerFarmerQtl} Qtl</span>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <button onClick={() => handleSaveRate(crop.id)} className="btn-primary btn-sm-table">
                            <Save size={14} />
                            <span>Save</span>
                          </button>
                        ) : (
                          <button onClick={() => handleEditRate(crop)} className="btn-secondary btn-sm-table">
                            <Edit3 size={14} />
                            <span>Modify</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Operational Audit Trail */}
      {activeTab === 'audit' && (
        <div className="admin-tab-content animate-fade">
          <div className="audit-trail-box glass-panel">
            <h3 className="admin-sec-title">Cryptographic Operational Audit Log</h3>
            <p className="admin-subtext">Timestamped immutable ledger of all gate passes, scale weighments, and PFMS transfers.</p>

            <div className="audit-items-list">
              {auditLogs.map((log) => (
                <div key={log.id} className="audit-log-item">
                  <div className="audit-time-pill">{log.time}</div>
                  <div className="audit-event-desc">{log.event}</div>
                  <span className="badge badge-green">VERIFIED</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
