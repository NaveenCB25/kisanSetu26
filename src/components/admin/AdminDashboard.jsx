import React, { useState, useMemo } from 'react';
import { 
  Users, 
  CalendarDays, 
  Building2, 
  Clock, 
  Scale, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle, 
  IndianRupee, 
  Truck, 
  ArrowUpRight, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Activity, 
  FileText, 
  Layers, 
  Filter, 
  Search, 
  ShieldCheck, 
  CheckCircle,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { configuredMandis, officialMSPRates } from '../../data/procurementData';

// Palette for crops in charts
const CROP_COLORS = [
  '#16a34a', // emerald green
  '#2563eb', // royal blue
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#ea580c', // orange
  '#10b981', // teal
  '#6366f1', // indigo
];

export default function AdminDashboard({ 
  tokens = [], 
  receipts = [], 
  mspRates = officialMSPRates, 
  mandis = configuredMandis 
}) {
  const [tableSearch, setTableSearch] = useState('');
  const [selectedMandiFilter, setSelectedMandiFilter] = useState('ALL');
  const [selectedCropFilter, setSelectedCropFilter] = useState('ALL');

  // Fallbacks if props are undefined
  const safeTokens = useMemo(() => Array.isArray(tokens) ? tokens : [], [tokens]);
  const safeReceipts = useMemo(() => Array.isArray(receipts) ? receipts : [], [receipts]);
  const safeMandis = useMemo(() => Array.isArray(mandis) && mandis.length > 0 ? mandis : configuredMandis, [mandis]);

  // ----------------------------------------------------
  // ROW 1: STAT CARDS DATA
  // ----------------------------------------------------
  // 1. Total Unique Farmers
  const uniqueFarmerCount = useMemo(() => {
    const names = new Set();
    safeTokens.forEach((t) => {
      if (t.farmerName) names.add(t.farmerName.trim());
    });
    safeReceipts.forEach((r) => {
      if (r.farmerName) names.add(r.farmerName.trim());
    });
    return names.size;
  }, [safeTokens, safeReceipts]);

  // 2. Today's Bookings
  const todayBookingsCount = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayMatches = safeTokens.filter(
      (t) => t.scheduledDate === todayStr || t.scheduledDate === '2026-10-10'
    );
    return todayMatches.length > 0 ? todayMatches.length : safeTokens.length;
  }, [safeTokens]);

  // 3. Active Mandis (status === 'OPERATIONAL')
  const activeMandisCount = useMemo(() => {
    return safeMandis.filter((m) => m.status === 'OPERATIONAL').length;
  }, [safeMandis]);

  // 4. Pending Approvals (status === 'SCHEDULED')
  const pendingApprovalsCount = useMemo(() => {
    return safeTokens.filter((t) => t.status === 'SCHEDULED').length;
  }, [safeTokens]);

  // ----------------------------------------------------
  // ROW 2: CHARTS DATA
  // ----------------------------------------------------
  // Crop-wise procurement quantities from tokens
  const cropOverviewData = useMemo(() => {
    const map = {};
    safeTokens.forEach((t) => {
      const cropName = (t.crop || 'Unknown').split('(')[0].trim();
      const qty = Number(t.estimatedQuantityQtl) || 0;
      map[cropName] = (map[cropName] || 0) + qty;
    });

    // If tokens are empty, use fallback from mspRates
    if (Object.keys(map).length === 0) {
      mspRates.forEach((m) => {
        const cropName = m.crop.split('(')[0].trim();
        map[cropName] = 0;
      });
    }

    const items = Object.entries(map).map(([crop, quantity], index) => ({
      crop,
      quantity,
      color: CROP_COLORS[index % CROP_COLORS.length]
    }));

    const maxQuantity = Math.max(...items.map((i) => i.quantity), 1);
    const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

    return { items, maxQuantity, totalQuantity };
  }, [safeTokens, mspRates]);

  // Conic gradient string for Donut chart
  const donutGradient = useMemo(() => {
    const { items, totalQuantity } = cropOverviewData;
    if (totalQuantity === 0) {
      return 'conic-gradient(#cbd5e1 0% 100%)';
    }

    let currentAngle = 0;
    const gradientStops = [];

    items.forEach((item) => {
      const slicePct = (item.quantity / totalQuantity) * 100;
      const endAngle = currentAngle + slicePct;
      gradientStops.push(`${item.color} ${currentAngle.toFixed(1)}% ${endAngle.toFixed(1)}%`);
      currentAngle = endAngle;
    });

    return `conic-gradient(${gradientStops.join(', ')})`;
  }, [cropOverviewData]);

  // ----------------------------------------------------
  // ROW 3: RECENT BOOKINGS TABLE
  // ----------------------------------------------------
  const filteredBookings = useMemo(() => {
    return safeTokens.filter((token) => {
      const matchSearch = tableSearch === '' || 
        (token.tokenNumber && token.tokenNumber.toLowerCase().includes(tableSearch.toLowerCase())) ||
        (token.farmerName && token.farmerName.toLowerCase().includes(tableSearch.toLowerCase())) ||
        (token.vehicleNumber && token.vehicleNumber.toLowerCase().includes(tableSearch.toLowerCase())) ||
        (token.mandiName && token.mandiName.toLowerCase().includes(tableSearch.toLowerCase()));

      const matchMandi = selectedMandiFilter === 'ALL' || token.mandiName === selectedMandiFilter;
      const matchCrop = selectedCropFilter === 'ALL' || (token.crop && token.crop.includes(selectedCropFilter));

      return matchSearch && matchMandi && matchCrop;
    });
  }, [safeTokens, tableSearch, selectedMandiFilter, selectedCropFilter]);

  const recentBookings = useMemo(() => {
    return filteredBookings.slice(0, 10);
  }, [filteredBookings]);

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return (
          <span className="admin-status-badge badge-scheduled">
            <Clock size={12} />
            SCHEDULED
          </span>
        );
      case 'IN_YARD':
        return (
          <span className="admin-status-badge badge-in-yard">
            <Truck size={12} />
            IN_YARD
          </span>
        );
      case 'CALLED':
        return (
          <span className="admin-status-badge badge-called">
            <Activity size={12} />
            CALLED
          </span>
        );
      case 'AT_WEIGHBRIDGE':
        return (
          <span className="admin-status-badge badge-at-weighbridge">
            <Scale size={12} />
            AT_WEIGHBRIDGE
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="admin-status-badge badge-completed">
            <CheckCircle2 size={12} />
            COMPLETED
          </span>
        );
      default:
        return (
          <span className="admin-status-badge badge-default">
            {status || 'UNKNOWN'}
          </span>
        );
    }
  };

  // ----------------------------------------------------
  // FINANCIAL SUMMARY CALCULATIONS
  // ----------------------------------------------------
  const financialMetrics = useMemo(() => {
    const totalPayable = safeReceipts.reduce((sum, r) => sum + (Number(r.totalPayableAmount) || 0), 0);
    const totalQuintals = safeReceipts.reduce((sum, r) => sum + (Number(r.netQuintals) || 0), 0);
    const totalTonnes = totalQuintals * 0.1; // 1 Qtl = 0.1 MT
    const count = safeReceipts.length;
    const avgPayout = count > 0 ? Math.round(totalPayable / count) : 0;

    // Payment status counts
    const paymentBreakdown = {};
    safeReceipts.forEach((r) => {
      const statusKey = r.paymentStatus || 'Pending';
      paymentBreakdown[statusKey] = (paymentBreakdown[statusKey] || 0) + 1;
    });

    // Format in Cr: 1 Cr = 1,00,00,000 (10^7)
    const croreAmount = (totalPayable / 10000000).toFixed(2);

    return {
      totalPayable,
      croreAmount,
      totalQuintals,
      totalTonnes,
      avgPayout,
      paymentBreakdown,
      receiptCount: count
    };
  }, [safeReceipts]);

  // Unique Mandis for table filter dropdown
  const uniqueMandiNames = useMemo(() => {
    const set = new Set();
    safeTokens.forEach((t) => { if (t.mandiName) set.add(t.mandiName); });
    return Array.from(set);
  }, [safeTokens]);

  return (
    <div className="admin-dashboard-root">
      {/* Top Banner / Breadcrumb */}
      <div className="admin-header-card">
        <div className="admin-header-content">
          <div className="admin-header-title-box">
            <div className="admin-header-icon-wrapper">
              <Building2 size={24} className="text-white" />
            </div>
            <div>
              <h1 className="admin-page-title">District Administration Command Center</h1>
              <p className="admin-page-subtitle">
                Real-time MSP Procurement Monitoring, Queue Telemetry & DBT Disbursement Engine
              </p>
            </div>
          </div>
          <div className="admin-header-badges">
            <span className="live-status-pill">
              <span className="pulse-dot"></span>
              Live APMC Grid Active
            </span>
            <span className="season-status-pill">
              Rabi Season 2026
            </span>
          </div>
        </div>
      </div>

      {/* ====================================================
          ROW 1: STAT CARDS (4 Cards Grid)
          ==================================================== */}
      <section className="admin-stats-grid">
        {/* Card 1: Total Farmers */}
        <div className="admin-stat-card border-accent-green">
          <div className="admin-stat-card-top">
            <div className="admin-stat-label">Total Farmers</div>
            <div className="admin-stat-icon-wrapper icon-bg-green">
              <Users size={20} className="text-green-600" />
            </div>
          </div>
          <div className="admin-stat-number">{uniqueFarmerCount.toLocaleString()}</div>
          <div className="admin-stat-trend trend-positive">
            <TrendingUp size={14} />
            <span>+12%</span>
            <span className="trend-subtext">vs previous period</span>
          </div>
        </div>

        {/* Card 2: Today's Bookings */}
        <div className="admin-stat-card border-accent-blue">
          <div className="admin-stat-card-top">
            <div className="admin-stat-label">Today's Bookings</div>
            <div className="admin-stat-icon-wrapper icon-bg-blue">
              <CalendarDays size={20} className="text-blue-600" />
            </div>
          </div>
          <div className="admin-stat-number">{todayBookingsCount.toLocaleString()}</div>
          <div className="admin-stat-trend trend-neutral">
            <ArrowUpRight size={14} />
            <span>Active Queue</span>
            <span className="trend-subtext">{safeTokens.length} total issued</span>
          </div>
        </div>

        {/* Card 3: Active Mandis */}
        <div className="admin-stat-card border-accent-purple">
          <div className="admin-stat-card-top">
            <div className="admin-stat-label">Active Mandis</div>
            <div className="admin-stat-icon-wrapper icon-bg-purple">
              <Building2 size={20} className="text-purple-600" />
            </div>
          </div>
          <div className="admin-stat-number">
            {activeMandisCount}
            <span className="text-sm-total">/{safeMandis.length}</span>
          </div>
          <div className="admin-stat-trend trend-positive">
            <CheckCircle2 size={14} />
            <span>Operational</span>
            <span className="trend-subtext">all telemetry active</span>
          </div>
        </div>

        {/* Card 4: Pending Approvals */}
        <div className="admin-stat-card border-accent-amber">
          <div className="admin-stat-card-top">
            <div className="admin-stat-label">Pending Approvals</div>
            <div className="admin-stat-icon-wrapper icon-bg-amber">
              <Clock size={20} className="text-amber-600" />
            </div>
          </div>
          <div className="admin-stat-number">{pendingApprovalsCount.toLocaleString()}</div>
          <div className="admin-stat-trend trend-warning">
            <Clock size={14} />
            <span>Scheduled</span>
            <span className="trend-subtext">awaiting gate check-in</span>
          </div>
        </div>
      </section>

      {/* ====================================================
          ROW 2: TWO COLUMNS (Procurement Overview & Crop Split)
          ==================================================== */}
      <section className="admin-charts-grid">
        {/* Left Column: Pure CSS Bar Chart */}
        <div className="admin-card admin-chart-card">
          <div className="admin-card-header">
            <div className="admin-card-header-left">
              <div className="header-icon-circle icon-bg-green">
                <BarChart3 size={18} className="text-green-600" />
              </div>
              <div>
                <h3 className="admin-card-title">Procurement Overview</h3>
                <p className="admin-card-subtitle">Crop-wise booked and allocated volume in Quintals</p>
              </div>
            </div>
            <div className="admin-total-indicator">
              Total: <strong>{cropOverviewData.totalQuantity.toLocaleString()} Qtl</strong>
            </div>
          </div>

          <div className="admin-barchart-wrapper">
            {cropOverviewData.items.length === 0 ? (
              <div className="admin-empty-state">No crop procurement data available</div>
            ) : (
              <div className="admin-barchart-container">
                {cropOverviewData.items.map((item, idx) => {
                  const barHeightPct = Math.max(
                    8,
                    Math.round((item.quantity / cropOverviewData.maxQuantity) * 100)
                  );
                  return (
                    <div key={idx} className="admin-bar-group">
                      <div className="admin-bar-tooltip">
                        {item.quantity.toLocaleString()} Qtl
                      </div>
                      <div className="admin-bar-track">
                        <div 
                          className="admin-bar-fill" 
                          style={{ 
                            height: `${barHeightPct}%`,
                            backgroundColor: item.color 
                          }}
                        />
                      </div>
                      <div className="admin-bar-label" title={item.crop}>
                        {item.crop}
                      </div>
                      <div className="admin-bar-val">
                        {item.quantity} Q
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pure CSS Donut / Pie Chart */}
        <div className="admin-card admin-chart-card">
          <div className="admin-card-header">
            <div className="admin-card-header-left">
              <div className="header-icon-circle icon-bg-blue">
                <PieChartIcon size={18} className="text-blue-600" />
              </div>
              <div>
                <h3 className="admin-card-title">Crop-wise Distribution</h3>
                <p className="admin-card-subtitle">Volume share proportion across commodity arrivals</p>
              </div>
            </div>
          </div>

          <div className="admin-donut-wrapper">
            <div className="admin-donut-graphic-box">
              {/* Conic-gradient Donut Chart */}
              <div 
                className="admin-donut-circle"
                style={{ background: donutGradient }}
              >
                <div className="admin-donut-hole">
                  <div className="admin-donut-hole-number">
                    {cropOverviewData.totalQuantity.toLocaleString()}
                  </div>
                  <div className="admin-donut-hole-label">Total Qtl</div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="admin-donut-legend">
              {cropOverviewData.items.map((item, idx) => {
                const pct = cropOverviewData.totalQuantity > 0 
                  ? ((item.quantity / cropOverviewData.totalQuantity) * 100).toFixed(1)
                  : '0.0';
                return (
                  <div key={idx} className="admin-legend-item">
                    <span 
                      className="legend-color-dot" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="legend-label">{item.crop}</span>
                    <span className="legend-qty">{item.quantity} Qtl</span>
                    <span className="legend-pct">({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          ROW 3: RECENT BOOKINGS TABLE
          ==================================================== */}
      <section className="admin-card admin-table-section">
        <div className="admin-card-header table-header-flex">
          <div className="admin-card-header-left">
            <div className="header-icon-circle icon-bg-purple">
              <Layers size={18} className="text-purple-600" />
            </div>
            <div>
              <h3 className="admin-card-title">Recent Queue Bookings</h3>
              <p className="admin-card-subtitle">Showing latest 10 dispatch tokens across APMC yards</p>
            </div>
          </div>

          {/* Table Filters & Search */}
          <div className="admin-table-filters">
            <div className="admin-search-input-box">
              <Search size={14} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search token, farmer, vehicle..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="admin-search-field"
              />
            </div>

            {uniqueMandiNames.length > 0 && (
              <select 
                value={selectedMandiFilter} 
                onChange={(e) => setSelectedMandiFilter(e.target.value)}
                className="admin-select-filter"
              >
                <option value="ALL">All Mandis</option>
                {uniqueMandiNames.map((name, i) => (
                  <option key={i} value={name}>{name}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="admin-table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Token #</th>
                <th>Farmer Name</th>
                <th>Crop</th>
                <th>Quantity (Qtl)</th>
                <th>Mandi</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="admin-table-empty">
                    No booking tokens found matching current query.
                  </td>
                </tr>
              ) : (
                recentBookings.map((token) => (
                  <tr key={token.id || token.tokenNumber} className="admin-table-row">
                    <td className="font-semibold text-emerald-800">
                      <span className="token-code-tag">{token.tokenNumber}</span>
                    </td>
                    <td className="font-medium text-slate-900">
                      <div>{token.farmerName}</div>
                      {token.phone && (
                        <span className="text-muted-xs">{token.phone}</span>
                      )}
                    </td>
                    <td>
                      <span className="crop-pill-tag">
                        {token.crop || 'Wheat'}
                      </span>
                    </td>
                    <td className="font-semibold text-slate-800">
                      {token.estimatedQuantityQtl} Qtl
                    </td>
                    <td className="text-slate-600">
                      <div className="mandi-cell-name">{token.mandiName}</div>
                    </td>
                    <td>
                      {renderStatusBadge(token.status)}
                    </td>
                    <td className="text-slate-500 whitespace-nowrap">
                      {token.scheduledDate || 'Today'}
                      {token.scheduledSlot && (
                        <div className="text-muted-xs">{token.scheduledSlot}</div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ====================================================
          ROW 4: TWO COLUMNS (Mandi Status Cards & Activity Feed)
          ==================================================== */}
      <section className="admin-row-columns">
        {/* Left Column: Mandi Status Cards */}
        <div className="admin-card mandi-status-container">
          <div className="admin-card-header">
            <div className="admin-card-header-left">
              <div className="header-icon-circle icon-bg-purple">
                <Building2 size={18} className="text-purple-600" />
              </div>
              <div>
                <h3 className="admin-card-title">Mandi Operational Status</h3>
                <p className="admin-card-subtitle">Real-time yard capacity, active bays, and wait queues</p>
              </div>
            </div>
            <span className="mandi-count-pill">{safeMandis.length} Configured</span>
          </div>

          <div className="mandi-cards-list">
            {safeMandis.map((mandi) => {
              const queueCount = mandi.currentQueueCount ?? 0;
              const capacity = mandi.dailyCapacityTrolleys || 400;
              const loadPct = Math.min(100, Math.round((queueCount / capacity) * 100));
              const isOperational = mandi.status === 'OPERATIONAL';

              return (
                <div key={mandi.id || mandi.name} className="mandi-item-card">
                  <div className="mandi-item-header">
                    <div>
                      <h4 className="mandi-item-name">{mandi.name}</h4>
                      <p className="mandi-item-meta">
                        {mandi.district ? `${mandi.district}, ` : ''}{mandi.state || 'India'} • {mandi.agency || 'FCI / Mandi Board'}
                      </p>
                    </div>
                    <span className={`mandi-status-badge ${isOperational ? 'status-operational' : 'status-congested'}`}>
                      {mandi.status || 'OPERATIONAL'}
                    </span>
                  </div>

                  <div className="mandi-item-stats">
                    <div className="mandi-mini-stat">
                      <span className="stat-label">Queue</span>
                      <span className="stat-val text-slate-800">{queueCount} Trolleys</span>
                    </div>
                    <div className="mandi-mini-stat">
                      <span className="stat-label">Avg Wait</span>
                      <span className="stat-val text-amber-600">{mandi.avgWaitMinutes ?? 0} mins</span>
                    </div>
                    <div className="mandi-mini-stat">
                      <span className="stat-label">Bays</span>
                      <span className="stat-val text-emerald-700">{mandi.openBays ?? 3} / {mandi.totalBays ?? 4} Open</span>
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div className="mandi-capacity-box">
                    <div className="capacity-bar-header">
                      <span>Yard Capacity Utilization</span>
                      <span className="font-semibold">{loadPct}%</span>
                    </div>
                    <div className="capacity-track">
                      <div 
                        className={`capacity-fill ${loadPct > 80 ? 'fill-danger' : loadPct > 50 ? 'fill-warning' : 'fill-good'}`}
                        style={{ width: `${Math.max(loadPct, 4)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Recent Activity Feed */}
        <div className="admin-card activity-feed-container">
          <div className="admin-card-header">
            <div className="admin-card-header-left">
              <div className="header-icon-circle icon-bg-green">
                <Activity size={18} className="text-green-600" />
              </div>
              <div>
                <h3 className="admin-card-title">Recent Activity Timeline</h3>
                <p className="admin-card-subtitle">Verified weighment clearances & DBT payment triggers</p>
              </div>
            </div>
          </div>

          <div className="admin-activity-timeline">
            {safeReceipts.length === 0 ? (
              <div className="admin-empty-state">No procurement receipts recorded yet.</div>
            ) : (
              safeReceipts.slice(0, 7).map((receipt, index) => (
                <div key={receipt.slipNumber || index} className="activity-timeline-item">
                  <div className="activity-icon-node">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                  </div>
                  <div className="activity-details">
                    <div className="activity-top-line">
                      <span className="activity-slip">{receipt.slipNumber}</span>
                      <span className="activity-time">{receipt.timestamp || 'Today'}</span>
                    </div>
                    <div className="activity-farmer-line">
                      <strong>{receipt.farmerName}</strong> cleared <strong>{receipt.netQuintals} Qtl</strong> {receipt.crop}
                    </div>
                    <div className="activity-meta-bottom">
                      <span className="activity-amount">
                        ₹{Number(receipt.totalPayableAmount).toLocaleString('en-IN')}
                      </span>
                      <span className="activity-payment-badge">
                        {receipt.paymentStatus || 'DBT Approved'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ====================================================
          FINANCIAL SUMMARY ROW
          ==================================================== */}
      <section className="admin-card financial-summary-card">
        <div className="admin-card-header">
          <div className="admin-card-header-left">
            <div className="header-icon-circle icon-bg-green">
              <IndianRupee size={18} className="text-green-600" />
            </div>
            <div>
              <h3 className="admin-card-title">Financial & DBT Settlement Summary</h3>
              <p className="admin-card-subtitle">Public Financial Management System (PFMS) & MSP disbursements</p>
            </div>
          </div>
        </div>

        <div className="financial-kpi-grid">
          {/* Metric 1: Total Procurement Amount */}
          <div className="financial-kpi-box border-emerald">
            <div className="financial-kpi-label">Total Procurement Amount</div>
            <div className="financial-kpi-value text-emerald-700">
              ₹{financialMetrics.croreAmount} Cr
            </div>
            <div className="financial-kpi-subtitle">
              Exact: ₹{financialMetrics.totalPayable.toLocaleString('en-IN')}
            </div>
          </div>

          {/* Metric 2: Total Quantity in Tonnes */}
          <div className="financial-kpi-box border-blue">
            <div className="financial-kpi-label">Total Procured Volume</div>
            <div className="financial-kpi-value text-blue-700">
              {financialMetrics.totalTonnes.toFixed(2)} MT
            </div>
            <div className="financial-kpi-subtitle">
              {financialMetrics.totalQuintals.toLocaleString()} Quintals
            </div>
          </div>

          {/* Metric 3: Average MSP Payout */}
          <div className="financial-kpi-box border-purple">
            <div className="financial-kpi-label">Average Farmer Payout</div>
            <div className="financial-kpi-value text-purple-700">
              ₹{financialMetrics.avgPayout.toLocaleString('en-IN')}
            </div>
            <div className="financial-kpi-subtitle">
              Across {financialMetrics.receiptCount} verified weighment slips
            </div>
          </div>

          {/* Metric 4: Payment Status Breakdown */}
          <div className="financial-kpi-box border-amber">
            <div className="financial-kpi-label">DBT Payment Status Breakdown</div>
            <div className="payment-breakdown-tags">
              {Object.keys(financialMetrics.paymentBreakdown).length === 0 ? (
                <span className="status-tag">No records yet</span>
              ) : (
                Object.entries(financialMetrics.paymentBreakdown).map(([status, count], i) => (
                  <div key={i} className="payment-status-pill-item">
                    <span className="pill-dot"></span>
                    <span className="pill-name">{status}:</span>
                    <span className="pill-count">{count}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
