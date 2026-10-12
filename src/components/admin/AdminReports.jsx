import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Filter,
  TrendingUp,
  BarChart3,
  Layers,
  MapPin,
  Building2,
  Wheat,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  FileSpreadsheet,
  DollarSign,
  Scale
} from 'lucide-react';
import { configuredMandis, officialMSPRates } from '../../data/procurementData';

export default function AdminReports({
  tokens = [],
  receipts = [],
  mspRates = officialMSPRates,
  mandis = configuredMandis
}) {
  // Report Period Tab: 'daily', 'weekly', 'monthly'
  const [reportType, setReportType] = useState('daily');
  
  // Category Tab: 'summary', 'district', 'mandi', 'crop'
  const [activeCategory, setActiveCategory] = useState('summary');

  // Date Range Picker
  const todayStr = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(todayStr);

  // Sorting state for tables
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'

  // Handle Preset changes for Daily / Weekly / Monthly
  const handleReportTypeChange = (type) => {
    setReportType(type);
    const today = new Date();
    const end = today.toISOString().split('T')[0];
    let start = end;

    if (type === 'daily') {
      start = end;
    } else if (type === 'weekly') {
      const past7 = new Date();
      past7.setDate(today.getDate() - 7);
      start = past7.toISOString().split('T')[0];
    } else if (type === 'monthly') {
      const past30 = new Date();
      past30.setDate(today.getDate() - 30);
      start = past30.toISOString().split('T')[0];
    }
    setStartDate(start);
    setEndDate(end);
  };

  // Filter Tokens & Receipts based on selected date range
  const { filteredTokens, filteredReceipts } = useMemo(() => {
    const start = startDate ? new Date(startDate).getTime() : 0;
    const end = endDate ? new Date(endDate + 'T23:59:59').getTime() : Infinity;

    const fTokens = tokens.filter((t) => {
      if (!t.scheduledDate) return true;
      const tTime = new Date(t.scheduledDate).getTime();
      return isNaN(tTime) || (tTime >= start && tTime <= end);
    });

    const fReceipts = receipts.filter((r) => {
      // Receipts have either timestamp or slipNumber; default to include if within range
      return true;
    });

    return { filteredTokens: fTokens, filteredReceipts: fReceipts };
  }, [tokens, receipts, startDate, endDate]);

  // 1. Procurement Summary Calculations
  const summaryMetrics = useMemo(() => {
    const totalBookings = filteredTokens.length;
    
    // Sum net quintals from receipts
    const totalQtyProcured = filteredReceipts.reduce((acc, r) => acc + (Number(r.netQuintals) || 0), 0);
    
    // Sum total payable amount
    const totalAmountDisbursed = filteredReceipts.reduce((acc, r) => acc + (Number(r.totalPayableAmount) || 0), 0);
    
    // Unique farmers in receipts
    const uniqueFarmers = new Set(filteredReceipts.map((r) => r.farmerName || r.farmerAadhaarLast4)).size;
    const avgPayoutPerFarmer = uniqueFarmers > 0 ? Math.round(totalAmountDisbursed / uniqueFarmers) : 0;

    // Status breakdown from tokens
    const statusCounts = {
      SCHEDULED: 0,
      IN_YARD: 0,
      CALLED: 0,
      AT_WEIGHBRIDGE: 0,
      COMPLETED: 0
    };

    filteredTokens.forEach((t) => {
      const st = t.status || 'SCHEDULED';
      if (statusCounts[st] !== undefined) {
        statusCounts[st] += 1;
      } else {
        statusCounts[st] = (statusCounts[st] || 0) + 1;
      }
    });

    return {
      totalBookings,
      totalQtyProcured,
      totalAmountDisbursed,
      avgPayoutPerFarmer,
      statusCounts,
      uniqueFarmers
    };
  }, [filteredTokens, filteredReceipts]);

  // 2. District-wise Report Data
  const districtData = useMemo(() => {
    const groups = {};

    filteredTokens.forEach((tok) => {
      const district = tok.district || 'Unassigned District';
      if (!groups[district]) {
        groups[district] = {
          district,
          totalBookings: 0,
          totalQty: 0,
          totalAmount: 0,
          totalWaitMins: 0,
          completedCount: 0
        };
      }
      groups[district].totalBookings += 1;
      groups[district].totalQty += (Number(tok.estimatedQuantityQtl) || 0);
      groups[district].totalWaitMins += (Number(tok.estimatedWaitMins) || 0);
      if (tok.status === 'COMPLETED') {
        groups[district].completedCount += 1;
      }
    });

    // Also factor receipts if any matching district tokens
    filteredReceipts.forEach((r) => {
      // Find matching token district
      const matchingTok = tokens.find((t) => t.tokenNumber === r.tokenNumber);
      const district = matchingTok?.district || 'Ludhiana'; // default district
      if (groups[district]) {
        groups[district].totalAmount += (Number(r.totalPayableAmount) || 0);
      }
    });

    return Object.values(groups).map((item) => ({
      ...item,
      avgWaitTime: item.totalBookings > 0 ? Math.round(item.totalWaitMins / item.totalBookings) : 0
    }));
  }, [filteredTokens, filteredReceipts, tokens]);

  // 3. Mandi-wise Report Data
  const mandiData = useMemo(() => {
    const groups = {};

    // Initialize with all mandis or tokens
    mandis.forEach((m) => {
      groups[m.name] = {
        mandiName: m.name,
        district: m.district,
        state: m.state,
        totalBookings: 0,
        totalQty: 0,
        totalAmount: 0,
        totalWaitMins: 0,
        statusCounts: {
          SCHEDULED: 0,
          IN_YARD: 0,
          CALLED: 0,
          AT_WEIGHBRIDGE: 0,
          COMPLETED: 0
        }
      };
    });

    filteredTokens.forEach((tok) => {
      const mandiKey = tok.mandiName || (mandis[0]?.name || 'Central Mandi');
      if (!groups[mandiKey]) {
        groups[mandiKey] = {
          mandiName: mandiKey,
          district: tok.district || '',
          state: '',
          totalBookings: 0,
          totalQty: 0,
          totalAmount: 0,
          totalWaitMins: 0,
          statusCounts: { SCHEDULED: 0, IN_YARD: 0, CALLED: 0, AT_WEIGHBRIDGE: 0, COMPLETED: 0 }
        };
      }
      groups[mandiKey].totalBookings += 1;
      groups[mandiKey].totalQty += (Number(tok.estimatedQuantityQtl) || 0);
      groups[mandiKey].totalWaitMins += (Number(tok.estimatedWaitMins) || 0);
      const st = tok.status || 'SCHEDULED';
      groups[mandiKey].statusCounts[st] = (groups[mandiKey].statusCounts[st] || 0) + 1;
    });

    filteredReceipts.forEach((r) => {
      const mandiKey = r.mandiName || (mandis[0]?.name || 'Central Mandi');
      if (groups[mandiKey]) {
        groups[mandiKey].totalAmount += (Number(r.totalPayableAmount) || 0);
      }
    });

    return Object.values(groups).map((item) => ({
      ...item,
      avgWaitTime: item.totalBookings > 0 ? Math.round(item.totalWaitMins / item.totalBookings) : 0
    }));
  }, [filteredTokens, filteredReceipts, mandis]);

  // 4. Crop-wise Report Data
  const cropData = useMemo(() => {
    const groups = {};

    // Initialize with official MSP rates
    mspRates.forEach((cropObj) => {
      groups[cropObj.crop] = {
        cropName: cropObj.crop,
        mspRate: cropObj.mspRate,
        totalQty: 0,
        totalAmount: 0,
        farmerSet: new Set(),
        bookingsCount: 0
      };
    });

    // Populate from tokens
    filteredTokens.forEach((tok) => {
      const c = tok.crop || 'Wheat (गेहूं)';
      if (!groups[c]) {
        groups[c] = {
          cropName: c,
          mspRate: 2275,
          totalQty: 0,
          totalAmount: 0,
          farmerSet: new Set(),
          bookingsCount: 0
        };
      }
      groups[c].bookingsCount += 1;
      groups[c].farmerSet.add(tok.farmerName || tok.phone);
    });

    // Populate from receipts for actual procurement & amount
    filteredReceipts.forEach((r) => {
      const c = r.crop || 'Wheat (गेहूं)';
      if (!groups[c]) {
        groups[c] = {
          cropName: c,
          mspRate: r.mspRate || 2275,
          totalQty: 0,
          totalAmount: 0,
          farmerSet: new Set(),
          bookingsCount: 0
        };
      }
      groups[c].totalQty += (Number(r.netQuintals) || 0);
      groups[c].totalAmount += (Number(r.totalPayableAmount) || 0);
      if (r.farmerName) {
        groups[c].farmerSet.add(r.farmerName);
      }
    });

    return Object.values(groups).map((item) => ({
      ...item,
      farmerCount: item.farmerSet.size
    }));
  }, [filteredTokens, filteredReceipts, mspRates]);

  // Sorting Helper
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getSortedData = (dataList) => {
    if (!sortField) return dataList;
    return [...dataList].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      const strA = String(valA || '').toLowerCase();
      const strB = String(valB || '').toLowerCase();
      if (strA < strB) return sortOrder === 'asc' ? -1 : 1;
      if (strA > strB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // Export CSV Functionality
  const exportToCSV = (format = 'csv') => {
    let headers = [];
    let rows = [];
    const reportTitle = `${activeCategory.toUpperCase()}_REPORT`;

    if (activeCategory === 'summary') {
      headers = ['Metric Name', 'Value', 'Unit / Details'];
      rows = [
        ['Report Period', `${startDate} to ${endDate}`, 'Date Range'],
        ['Report Frequency', reportType.toUpperCase(), 'Interval'],
        ['Total Bookings', summaryMetrics.totalBookings, 'Tokens'],
        ['Total Quantity Procured', summaryMetrics.totalQtyProcured.toFixed(2), 'Quintals (Qtl)'],
        ['Total Amount Disbursed', `₹ ${summaryMetrics.totalAmountDisbursed.toLocaleString('en-IN')}`, 'Direct Benefit Transfer'],
        ['Unique Farmers Paid', summaryMetrics.uniqueFarmers, 'Farmers'],
        ['Average MSP Payout', `₹ ${summaryMetrics.avgPayoutPerFarmer.toLocaleString('en-IN')}`, '₹ per Farmer'],
        ['Tokens: Scheduled', summaryMetrics.statusCounts.SCHEDULED || 0, 'Status Count'],
        ['Tokens: In Yard', summaryMetrics.statusCounts.IN_YARD || 0, 'Status Count'],
        ['Tokens: Called / Active', summaryMetrics.statusCounts.CALLED || 0, 'Status Count'],
        ['Tokens: At Weighbridge', summaryMetrics.statusCounts.AT_WEIGHBRIDGE || 0, 'Status Count'],
        ['Tokens: Completed', summaryMetrics.statusCounts.COMPLETED || 0, 'Status Count']
      ];
    } else if (activeCategory === 'district') {
      headers = ['District', 'Total Bookings', 'Total Quantity (Qtl)', 'Total Disbursed (INR)', 'Avg Wait Time (Mins)'];
      rows = districtData.map((d) => [
        `"${d.district}"`,
        d.totalBookings,
        d.totalQty.toFixed(2),
        d.totalAmount,
        `${d.avgWaitTime} mins`
      ]);
    } else if (activeCategory === 'mandi') {
      headers = ['Mandi Name', 'District', 'Bookings', 'Total Quantity (Qtl)', 'Amount Disbursed (INR)', 'Avg Processing Time (Mins)', 'Scheduled', 'In Yard', 'Completed'];
      rows = mandiData.map((m) => [
        `"${m.mandiName}"`,
        `"${m.district}"`,
        m.totalBookings,
        m.totalQty.toFixed(2),
        m.totalAmount,
        `${m.avgWaitTime} mins`,
        m.statusCounts.SCHEDULED || 0,
        m.statusCounts.IN_YARD || 0,
        m.statusCounts.COMPLETED || 0
      ]);
    } else if (activeCategory === 'crop') {
      headers = ['Crop Name', 'MSP Rate (INR/Qtl)', 'Total Qty Procured (Qtl)', 'Total Amount (INR)', 'Farmers Count', 'Bookings'];
      rows = cropData.map((c) => [
        `"${c.cropName}"`,
        c.mspRate,
        c.totalQty.toFixed(2),
        c.totalAmount,
        c.farmerCount,
        c.bookingsCount
      ]);
    }

    const separator = format === 'excel' ? '\t' : ',';
    const csvContent = [
      headers.join(separator),
      ...rows.map((row) => row.join(separator))
    ].join('\r\n');

    const mimeType = format === 'excel' 
      ? 'application/vnd.ms-excel;charset=utf-8;' 
      : 'text/csv;charset=utf-8;';
    const extension = format === 'excel' ? 'xls' : 'csv';

    const blob = new Blob([csvContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `kisansetu_${activeCategory}_${reportType}_${startDate}_to_${endDate}.${extension}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="admin-reports-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-title">
            <FileText className="title-icon text-green-700" size={26} />
            Procurement Analytics & Intelligence Reports
          </h2>
          <p className="admin-subtitle">
            Official government reports, district procurement summaries, and MSP disbursement breakdowns.
          </p>
        </div>

        {/* Global Export & Print Actions */}
        <div className="admin-header-actions no-print">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => exportToCSV('csv')}
            title="Download CSV for statistical processing"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => exportToCSV('excel')}
            title="Download formatted spreadsheet for MS Excel"
          >
            <FileSpreadsheet size={16} />
            <span>Export Excel</span>
          </button>

          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handlePrint}
            title="Print or Save as PDF"
          >
            <Printer size={16} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Report Frequency & Date Range Picker */}
      <div className="reports-control-panel card no-print">
        <div className="control-row">
          {/* Report Frequency Tabs */}
          <div className="report-type-selector">
            <span className="control-label">Period Frequency:</span>
            <div className="filter-button-group">
              <button
                type="button"
                className={`filter-btn ${reportType === 'daily' ? 'active' : ''}`}
                onClick={() => handleReportTypeChange('daily')}
              >
                Daily Report
              </button>
              <button
                type="button"
                className={`filter-btn ${reportType === 'weekly' ? 'active' : ''}`}
                onClick={() => handleReportTypeChange('weekly')}
              >
                Weekly Report
              </button>
              <button
                type="button"
                className={`filter-btn ${reportType === 'monthly' ? 'active' : ''}`}
                onClick={() => handleReportTypeChange('monthly')}
              >
                Monthly Report
              </button>
            </div>
          </div>

          {/* Date Range Inputs */}
          <div className="date-range-picker">
            <span className="control-label">Date Range:</span>
            <div className="date-inputs">
              <div className="input-with-icon">
                <Calendar size={14} className="input-icon" />
                <input
                  type="date"
                  className="date-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <span className="date-sep">to</span>
              <div className="input-with-icon">
                <Calendar size={14} className="input-icon" />
                <input
                  type="date"
                  className="date-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category Navigation Tabs */}
        <div className="report-categories-tabs">
          <button
            type="button"
            className={`category-tab ${activeCategory === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveCategory('summary')}
          >
            <TrendingUp size={17} />
            <span>Procurement Summary</span>
          </button>
          <button
            type="button"
            className={`category-tab ${activeCategory === 'district' ? 'active' : ''}`}
            onClick={() => setActiveCategory('district')}
          >
            <MapPin size={17} />
            <span>District-wise</span>
          </button>
          <button
            type="button"
            className={`category-tab ${activeCategory === 'mandi' ? 'active' : ''}`}
            onClick={() => setActiveCategory('mandi')}
          >
            <Building2 size={17} />
            <span>Mandi-wise</span>
          </button>
          <button
            type="button"
            className={`category-tab ${activeCategory === 'crop' ? 'active' : ''}`}
            onClick={() => setActiveCategory('crop')}
          >
            <Wheat size={17} />
            <span>Crop-wise</span>
          </button>
        </div>
      </div>

      {/* PRINT-ONLY HEADER */}
      <div className="print-report-header only-print">
        <div className="print-brand">🌾 KisanSetu — Unified National Agriculture Procurement System</div>
        <div className="print-meta">
          <h2>Official Procurement Audit & Operations Report</h2>
          <p>Scope: <b>{activeCategory.toUpperCase()}</b> • Frequency: <b>{reportType.toUpperCase()}</b> • Period: <b>{startDate}</b> to <b>{endDate}</b></p>
          <p>Generated on: {new Date().toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* VIEW 1: PROCUREMENT SUMMARY */}
      {activeCategory === 'summary' && (
        <div className="report-content-view">
          {/* Top KPI Cards */}
          <div className="report-kpi-grid">
            <div className="kpi-card">
              <div className="kpi-icon-wrap bg-green-50 text-green-700">
                <Layers size={22} />
              </div>
              <div className="kpi-details">
                <span className="kpi-label">Total Bookings</span>
                <span className="kpi-value">{summaryMetrics.totalBookings}</span>
                <span className="kpi-subtext">Registered Queue Tokens</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon-wrap bg-blue-50 text-blue-700">
                <Scale size={22} />
              </div>
              <div className="kpi-details">
                <span className="kpi-label">Total Quantity Procured</span>
                <span className="kpi-value">{summaryMetrics.totalQtyProcured.toFixed(1)} <small>Qtl</small></span>
                <span className="kpi-subtext">Verified Gross-to-Net Weights</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon-wrap bg-amber-50 text-amber-700">
                <DollarSign size={22} />
              </div>
              <div className="kpi-details">
                <span className="kpi-label">Amount Disbursed</span>
                <span className="kpi-value">₹ {summaryMetrics.totalAmountDisbursed.toLocaleString('en-IN')}</span>
                <span className="kpi-subtext">Direct Benefit Transfer (PFMS)</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon-wrap bg-emerald-50 text-emerald-800">
                <CheckCircle2 size={22} />
              </div>
              <div className="kpi-details">
                <span className="kpi-label">Avg Payout / Farmer</span>
                <span className="kpi-value">₹ {summaryMetrics.avgPayoutPerFarmer.toLocaleString('en-IN')}</span>
                <span className="kpi-subtext">Across {summaryMetrics.uniqueFarmers} Participating Farmers</span>
              </div>
            </div>
          </div>

          {/* Status Breakdown Section */}
          <div className="card report-section-card">
            <div className="section-card-header">
              <div>
                <h3 className="section-title">Token Pipeline & Yard Status Breakdown</h3>
                <p className="section-desc">Real-time status tracking for all tokens in selected period</p>
              </div>
              <span className="badge badge-success">{summaryMetrics.totalBookings} Total Tokens</span>
            </div>

            <div className="status-breakdown-grid">
              <div className="status-stat-pill status-scheduled">
                <div className="pill-head">
                  <span className="pill-dot"></span>
                  <span className="pill-label">SCHEDULED</span>
                </div>
                <div className="pill-number">{summaryMetrics.statusCounts.SCHEDULED || 0}</div>
                <div className="pill-percent">
                  {summaryMetrics.totalBookings > 0 ? Math.round(((summaryMetrics.statusCounts.SCHEDULED || 0) / summaryMetrics.totalBookings) * 100) : 0}% of queue
                </div>
              </div>

              <div className="status-stat-pill status-yard">
                <div className="pill-head">
                  <span className="pill-dot"></span>
                  <span className="pill-label">IN YARD</span>
                </div>
                <div className="pill-number">{summaryMetrics.statusCounts.IN_YARD || 0}</div>
                <div className="pill-percent">
                  {summaryMetrics.totalBookings > 0 ? Math.round(((summaryMetrics.statusCounts.IN_YARD || 0) / summaryMetrics.totalBookings) * 100) : 0}% of queue
                </div>
              </div>

              <div className="status-stat-pill status-called">
                <div className="pill-head">
                  <span className="pill-dot"></span>
                  <span className="pill-label">CALLED / ACTIVE</span>
                </div>
                <div className="pill-number">{summaryMetrics.statusCounts.CALLED || 0}</div>
                <div className="pill-percent">
                  {summaryMetrics.totalBookings > 0 ? Math.round(((summaryMetrics.statusCounts.CALLED || 0) / summaryMetrics.totalBookings) * 100) : 0}% of queue
                </div>
              </div>

              <div className="status-stat-pill status-weigh">
                <div className="pill-head">
                  <span className="pill-dot"></span>
                  <span className="pill-label">AT WEIGHBRIDGE</span>
                </div>
                <div className="pill-number">{summaryMetrics.statusCounts.AT_WEIGHBRIDGE || 0}</div>
                <div className="pill-percent">
                  {summaryMetrics.totalBookings > 0 ? Math.round(((summaryMetrics.statusCounts.AT_WEIGHBRIDGE || 0) / summaryMetrics.totalBookings) * 100) : 0}% of queue
                </div>
              </div>

              <div className="status-stat-pill status-completed">
                <div className="pill-head">
                  <span className="pill-dot"></span>
                  <span className="pill-label">COMPLETED</span>
                </div>
                <div className="pill-number">{summaryMetrics.statusCounts.COMPLETED || 0}</div>
                <div className="pill-percent">
                  {summaryMetrics.totalBookings > 0 ? Math.round(((summaryMetrics.statusCounts.COMPLETED || 0) / summaryMetrics.totalBookings) * 100) : 0}% of queue
                </div>
              </div>
            </div>
          </div>

          {/* Tokens Detail Table */}
          <div className="card report-section-card">
            <div className="section-card-header">
              <h3 className="section-title">Transactions in Scope</h3>
              <span className="badge badge-outline">{filteredTokens.length} Tokens</span>
            </div>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Token #</th>
                    <th>Farmer Name</th>
                    <th>Mandi</th>
                    <th>Crop</th>
                    <th>Vehicle</th>
                    <th>Date / Slot</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTokens.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-6 text-gray-500">No token records found for this period.</td>
                    </tr>
                  ) : (
                    filteredTokens.map((tok) => (
                      <tr key={tok.id || tok.tokenNumber}>
                        <td><span className="token-tag font-bold">{tok.tokenNumber}</span></td>
                        <td>
                          <div className="font-semibold text-gray-800">{tok.farmerName}</div>
                          <div className="text-xs text-gray-500">{tok.phone}</div>
                        </td>
                        <td>{tok.mandiName}</td>
                        <td><span className="crop-pill">{tok.crop}</span></td>
                        <td>{tok.vehicleNumber}</td>
                        <td>
                          <div>{tok.scheduledDate}</div>
                          <small className="text-gray-500">{tok.scheduledSlot}</small>
                        </td>
                        <td>
                          <span className={`status-badge status-${(tok.status || 'SCHEDULED').toLowerCase()}`}>
                            {tok.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: DISTRICT-WISE REPORT */}
      {activeCategory === 'district' && (
        <div className="report-content-view card report-section-card">
          <div className="section-card-header">
            <div>
              <h3 className="section-title">District-wise Aggregated Procurement</h3>
              <p className="section-desc">Performance summary grouped by administrative districts</p>
            </div>
            <div className="badge badge-success">{districtData.length} Districts Active</div>
          </div>

          <div className="table-responsive">
            <table className="admin-table sortable-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('district')} className="cursor-pointer">
                    <div className="th-content">
                      <span>District Name</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th onClick={() => handleSort('totalBookings')} className="cursor-pointer text-right">
                    <div className="th-content justify-end">
                      <span>Total Bookings</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th onClick={() => handleSort('totalQty')} className="cursor-pointer text-right">
                    <div className="th-content justify-end">
                      <span>Total Quantity (Qtl)</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th onClick={() => handleSort('totalAmount')} className="cursor-pointer text-right">
                    <div className="th-content justify-end">
                      <span>Total Disbursed (₹)</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th onClick={() => handleSort('avgWaitTime')} className="cursor-pointer text-right">
                    <div className="th-content justify-end">
                      <span>Avg Wait Time</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th className="text-center">Completion Rate</th>
                </tr>
              </thead>
              <tbody>
                {getSortedData(districtData).length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">No district procurement records in selected date range.</td>
                  </tr>
                ) : (
                  getSortedData(districtData).map((item) => {
                    const compRate = item.totalBookings > 0 ? Math.round((item.completedCount / item.totalBookings) * 100) : 0;
                    return (
                      <tr key={item.district}>
                        <td className="font-semibold text-gray-900">
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-green-600" />
                            <span>{item.district}</span>
                          </div>
                        </td>
                        <td className="text-right font-medium">{item.totalBookings}</td>
                        <td className="text-right font-medium">{item.totalQty.toFixed(1)} Qtl</td>
                        <td className="text-right font-bold text-green-700">₹ {item.totalAmount.toLocaleString('en-IN')}</td>
                        <td className="text-right">
                          <span className="badge badge-time">
                            <Clock size={12} />
                            {item.avgWaitTime} mins
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="progress-bar-container">
                            <div className="progress-bar-fill" style={{ width: `${compRate}%` }}></div>
                            <span className="progress-bar-text">{compRate}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: MANDI-WISE REPORT */}
      {activeCategory === 'mandi' && (
        <div className="report-content-view card report-section-card">
          <div className="section-card-header">
            <div>
              <h3 className="section-title">Mandi-wise Procurement & Bay Capacity Report</h3>
              <p className="section-desc">Operational bottlenecks, queue loads, and financial payouts per APMC Yard</p>
            </div>
            <div className="badge badge-success">{mandiData.length} Mandis Configured</div>
          </div>

          <div className="table-responsive">
            <table className="admin-table sortable-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('mandiName')} className="cursor-pointer">
                    <div className="th-content">
                      <span>Mandi Name</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th>District</th>
                  <th onClick={() => handleSort('totalBookings')} className="cursor-pointer text-right">
                    <div className="th-content justify-end">
                      <span>Total Bookings</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th onClick={() => handleSort('totalQty')} className="cursor-pointer text-right">
                    <div className="th-content justify-end">
                      <span>Total Qty (Qtl)</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th onClick={() => handleSort('totalAmount')} className="cursor-pointer text-right">
                    <div className="th-content justify-end">
                      <span>Amount Disbursed (₹)</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th onClick={() => handleSort('avgWaitTime')} className="cursor-pointer text-right">
                    <div className="th-content justify-end">
                      <span>Avg Processing Time</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th>Status Breakdown</th>
                </tr>
              </thead>
              <tbody>
                {getSortedData(mandiData).length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-500">No mandi records in this period.</td>
                  </tr>
                ) : (
                  getSortedData(mandiData).map((m) => (
                    <tr key={m.mandiName}>
                      <td className="font-semibold text-gray-900">
                        <div className="flex items-center gap-2">
                          <Building2 size={16} className="text-green-700" />
                          <span>{m.mandiName}</span>
                        </div>
                      </td>
                      <td className="text-gray-600">{m.district || '—'}</td>
                      <td className="text-right font-medium">{m.totalBookings}</td>
                      <td className="text-right font-medium">{m.totalQty.toFixed(1)} Qtl</td>
                      <td className="text-right font-bold text-green-700">₹ {m.totalAmount.toLocaleString('en-IN')}</td>
                      <td className="text-right">
                        <span className="badge badge-time">
                          <Clock size={12} />
                          {m.avgWaitTime} mins
                        </span>
                      </td>
                      <td>
                        <div className="status-mini-pills">
                          <span title="Scheduled" className="mini-pill status-scheduled">{m.statusCounts.SCHEDULED || 0} Sch</span>
                          <span title="In Yard" className="mini-pill status-yard">{m.statusCounts.IN_YARD || 0} Yard</span>
                          <span title="Called / At Weighbridge" className="mini-pill status-weigh">{(m.statusCounts.CALLED || 0) + (m.statusCounts.AT_WEIGHBRIDGE || 0)} Proc</span>
                          <span title="Completed" className="mini-pill status-completed">{m.statusCounts.COMPLETED || 0} Done</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 4: CROP-WISE REPORT */}
      {activeCategory === 'crop' && (
        <div className="report-content-view card report-section-card">
          <div className="section-card-header">
            <div>
              <h3 className="section-title">Crop-wise MSP Procurement & Farmer Reach</h3>
              <p className="section-desc">Commodity distribution, official benchmark pricing, and farmer participation</p>
            </div>
            <div className="badge badge-success">{cropData.length} Crops Monitored</div>
          </div>

          <div className="table-responsive">
            <table className="admin-table sortable-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('cropName')} className="cursor-pointer">
                    <div className="th-content">
                      <span>Crop Name</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th onClick={() => handleSort('mspRate')} className="cursor-pointer text-right">
                    <div className="th-content justify-end">
                      <span>MSP Rate (₹/Qtl)</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th onClick={() => handleSort('totalQty')} className="cursor-pointer text-right">
                    <div className="th-content justify-end">
                      <span>Total Qty Procured</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th onClick={() => handleSort('totalAmount')} className="cursor-pointer text-right">
                    <div className="th-content justify-end">
                      <span>Total Value (₹)</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th onClick={() => handleSort('farmerCount')} className="cursor-pointer text-right">
                    <div className="th-content justify-end">
                      <span>Farmers Participated</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th onClick={() => handleSort('bookingsCount')} className="cursor-pointer text-right">
                    <div className="th-content justify-end">
                      <span>Bookings</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {getSortedData(cropData).length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">No crop records found.</td>
                  </tr>
                ) : (
                  getSortedData(cropData).map((crop) => (
                    <tr key={crop.cropName}>
                      <td className="font-semibold text-gray-900">
                        <div className="flex items-center gap-2">
                          <Wheat size={16} className="text-amber-600" />
                          <span>{crop.cropName}</span>
                        </div>
                      </td>
                      <td className="text-right font-medium text-gray-700">₹ {crop.mspRate.toLocaleString('en-IN')}</td>
                      <td className="text-right font-bold text-gray-900">{crop.totalQty.toFixed(1)} Qtl</td>
                      <td className="text-right font-bold text-green-700">₹ {crop.totalAmount.toLocaleString('en-IN')}</td>
                      <td className="text-right font-semibold">{crop.farmerCount} Farmers</td>
                      <td className="text-right font-medium text-gray-600">{crop.bookingsCount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
