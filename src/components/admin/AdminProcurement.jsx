import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  RotateCw,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  Truck,
  Phone,
  Calendar,
  Clock,
  MapPin,
  Scale,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserCheck,
  Eye,
  XCircle,
  IndianRupee,
  Layers
} from 'lucide-react';

export default function AdminProcurement({
  tokens = [],
  receipts = [],
  mspRates = [],
  mandis = [],
  onUpdateToken,
  onUpdateReceipt,
  onNotify
}) {
  // --- Filter States ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedMandi, setSelectedMandi] = useState('ALL');
  const [selectedCrop, setSelectedCrop] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState('');

  // --- Sort & Pagination States ---
  const [sortField, setSortField] = useState('tokenNumber');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- Detail Modal & Action Sub-Modals ---
  const [selectedTokenDetail, setSelectedTokenDetail] = useState(null);
  const [rejectModalToken, setRejectModalToken] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rescheduleModalToken, setRescheduleModalToken] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlot, setRescheduleSlot] = useState('');
  const [completeModalToken, setCompleteModalToken] = useState(null);
  const [completionGrossWeight, setCompletionGrossWeight] = useState(12500);
  const [completionTareWeight, setCompletionTareWeight] = useState(3500);
  const [completionMoisture, setCompletionMoisture] = useState(11.0);

  // --- Derive Options from Data ---
  const statesList = useMemo(() => {
    const states = new Set();
    mandis.forEach((m) => {
      if (m.state) states.add(m.state);
    });
    return Array.from(states).sort();
  }, [mandis]);

  const mandisForState = useMemo(() => {
    if (selectedState === 'ALL') return mandis;
    return mandis.filter((m) => m.state === selectedState);
  }, [mandis, selectedState]);

  const cropsList = useMemo(() => {
    const crops = new Set();
    mspRates.forEach((r) => {
      if (r.crop) crops.add(r.crop);
    });
    // Fallback: also include any crops present in tokens
    tokens.forEach((t) => {
      if (t.crop) crops.add(t.crop);
    });
    return Array.from(crops).sort();
  }, [mspRates, tokens]);

  // MSP Helper map
  const getCropRate = (cropName) => {
    const rateObj = mspRates.find((m) => m.crop === cropName || (cropName && m.crop && cropName.includes(m.crop.split(' ')[0])));
    return rateObj ? rateObj.mspRate : 2275;
  };

  // --- Summary Stats ---
  const stats = useMemo(() => {
    const total = tokens.length;
    const inYard = tokens.filter((t) => t.status === 'IN_YARD').length;
    const atWeighbridge = tokens.filter((t) => t.status === 'AT_WEIGHBRIDGE').length;
    const completed = tokens.filter((t) => t.status === 'COMPLETED').length;
    const pending = tokens.filter((t) => t.status === 'SCHEDULED' || t.status === 'CALLED').length;
    return { total, inYard, atWeighbridge, completed, pending };
  }, [tokens]);

  // --- Filter Handlers ---
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedMandi('ALL'); // Reset dependent filter
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedState('ALL');
    setSelectedMandi('ALL');
    setSelectedCrop('ALL');
    setSelectedStatus('ALL');
    setSelectedDate('');
    setCurrentPage(1);
  };

  // --- Filter and Sort Tokens ---
  const filteredTokens = useMemo(() => {
    return tokens.filter((t) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesToken = t.tokenNumber?.toLowerCase().includes(query);
        const matchesName = t.farmerName?.toLowerCase().includes(query);
        const matchesVehicle = t.vehicleNumber?.toLowerCase().includes(query);
        const matchesPhone = t.phone?.toLowerCase().includes(query);
        if (!matchesToken && !matchesName && !matchesVehicle && !matchesPhone) {
          return false;
        }
      }

      // State Filter (derive via mandi)
      if (selectedState !== 'ALL') {
        const mandiObj = mandis.find((m) => m.id === t.mandiId || m.name === t.mandiName);
        if (!mandiObj || mandiObj.state !== selectedState) {
          return false;
        }
      }

      // Mandi Filter
      if (selectedMandi !== 'ALL') {
        const matchesMandi = t.mandiId === selectedMandi || t.mandiName === selectedMandi;
        if (!matchesMandi) return false;
      }

      // Crop Filter
      if (selectedCrop !== 'ALL' && t.crop !== selectedCrop) {
        return false;
      }

      // Status Filter
      if (selectedStatus !== 'ALL' && t.status !== selectedStatus) {
        return false;
      }

      // Date Filter
      if (selectedDate && t.scheduledDate !== selectedDate) {
        return false;
      }

      return true;
    });
  }, [tokens, searchQuery, selectedState, selectedMandi, selectedCrop, selectedStatus, selectedDate, mandis]);

  // Sort
  const sortedTokens = useMemo(() => {
    return [...filteredTokens].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Custom field extractions
      if (sortField === 'mspRate') {
        valA = getCropRate(a.crop);
        valB = getCropRate(b.crop);
      } else if (sortField === 'location') {
        valA = `${a.district || ''} ${a.village || ''}`.trim();
        valB = `${b.district || ''} ${b.village || ''}`.trim();
      }

      if (valA === undefined || valA === null) valA = '';
      if (valB === undefined || valB === null) valB = '';

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();

      if (strA < strB) return sortDirection === 'asc' ? -1 : 1;
      if (strA > strB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredTokens, sortField, sortDirection, mspRates]);

  // Pagination
  const totalPages = Math.ceil(sortedTokens.length / itemsPerPage) || 1;
  const paginatedTokens = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedTokens.slice(start, start + itemsPerPage);
  }, [sortedTokens, currentPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} className="sort-icon-neutral" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp size={14} className="sort-icon-active" />
    ) : (
      <ArrowDown size={14} className="sort-icon-active" />
    );
  };

  // --- Status Badge Helper ---
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return (
          <span className="proc-status-badge badge-scheduled">
            <Clock size={12} /> SCHEDULED
          </span>
        );
      case 'IN_YARD':
        return (
          <span className="proc-status-badge badge-in-yard">
            <Truck size={12} /> IN YARD
          </span>
        );
      case 'CALLED':
        return (
          <span className="proc-status-badge badge-called">
            <UserCheck size={12} /> CALLED
          </span>
        );
      case 'AT_WEIGHBRIDGE':
        return (
          <span className="proc-status-badge badge-weighbridge">
            <Scale size={12} /> AT WEIGHBRIDGE
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="proc-status-badge badge-completed">
            <CheckCircle2 size={12} /> COMPLETED
          </span>
        );
      case 'REJECTED':
        return (
          <span className="proc-status-badge badge-rejected">
            <XCircle size={12} /> REJECTED
          </span>
        );
      default:
        return <span className="proc-status-badge badge-default">{status || 'UNKNOWN'}</span>;
    }
  };

  // --- Actions ---
  const handleApprove = (token) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (onUpdateToken) {
      onUpdateToken(token.id, {
        status: 'IN_YARD',
        gateCheckInTime: timeNow,
        estimatedWaitMins: 15
      });
    }
    if (onNotify) {
      onNotify(`✓ Token ${token.tokenNumber} marked IN_YARD at ${timeNow}!`);
    }
    if (selectedTokenDetail && selectedTokenDetail.id === token.id) {
      setSelectedTokenDetail((prev) => ({
        ...prev,
        status: 'IN_YARD',
        gateCheckInTime: timeNow
      }));
    }
  };

  const handleCallToBay = (token) => {
    const bayName = token.currentBay || 'Bay 1 (Assigned)';
    if (onUpdateToken) {
      onUpdateToken(token.id, {
        status: 'CALLED',
        currentBay: bayName,
        estimatedWaitMins: 3
      });
    }
    if (onNotify) {
      onNotify(`📢 Token ${token.tokenNumber} called to ${bayName}!`);
    }
    if (selectedTokenDetail && selectedTokenDetail.id === token.id) {
      setSelectedTokenDetail((prev) => ({
        ...prev,
        status: 'CALLED',
        currentBay: bayName
      }));
    }
  };

  const handleStartWeighment = (token) => {
    const weighBay = token.currentBay?.replace('Assigned', 'Gross Weighing') || 'Bay 1 (Gross Weighing)';
    if (onUpdateToken) {
      onUpdateToken(token.id, {
        status: 'AT_WEIGHBRIDGE',
        currentBay: weighBay,
        estimatedWaitMins: 0
      });
    }
    if (onNotify) {
      onNotify(`⚖️ Token ${token.tokenNumber} moved to weighbridge (${weighBay})!`);
    }
    if (selectedTokenDetail && selectedTokenDetail.id === token.id) {
      setSelectedTokenDetail((prev) => ({
        ...prev,
        status: 'AT_WEIGHBRIDGE',
        currentBay: weighBay
      }));
    }
  };

  const handleOpenCompleteModal = (token) => {
    setCompleteModalToken(token);
    // prefill realistic weights based on estimated quantity
    const estKg = (token.estimatedQuantityQtl || 50) * 100;
    const tare = 3500;
    setCompletionGrossWeight(estKg + tare);
    setCompletionTareWeight(tare);
    setCompletionMoisture(11.2);
  };

  const handleConfirmCompletion = (e) => {
    e.preventDefault();
    if (!completeModalToken) return;

    const gross = Number(completionGrossWeight) || 0;
    const tare = Number(completionTareWeight) || 0;
    const netKg = Math.max(0, gross - tare);
    const netQtl = Number((netKg / 100).toFixed(2));
    const rate = getCropRate(completeModalToken.crop);
    const payable = Math.round(netQtl * rate);

    const slipNumber = `REC-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newReceipt = {
      slipNumber,
      tokenNumber: completeModalToken.tokenNumber,
      farmerName: completeModalToken.farmerName,
      farmerAadhaarLast4: completeModalToken.farmerAadhaarLast4 || '4920',
      phone: completeModalToken.phone,
      mandiName: completeModalToken.mandiName || 'Central Grain Market',
      crop: completeModalToken.crop,
      vehicleNumber: completeModalToken.vehicleNumber,
      grossWeightKg: gross,
      tareWeightKg: tare,
      netWeightKg: netKg,
      netQuintals: netQtl,
      moisturePercent: Number(completionMoisture) || 11.0,
      deductionQuintals: 0,
      finalPayableQuintals: netQtl,
      mspRate: rate,
      totalPayableAmount: payable,
      procurementAgency: 'FCI / State Civil Supplies',
      weighbridgeOperator: 'Mandi Admin Console',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      paymentStatus: 'DBT Approved (PFMS Sent)',
      bankAccountEnding: '•••• 6672',
      dbtReferenceId: `DBT-${Math.floor(100000 + Math.random() * 900000)}`
    };

    if (onUpdateToken) {
      onUpdateToken(completeModalToken.id, {
        status: 'COMPLETED',
        currentBay: 'Weighed & Cleared',
        estimatedWaitMins: 0
      });
    }

    if (onUpdateReceipt) {
      onUpdateReceipt(slipNumber, newReceipt);
    }

    if (onNotify) {
      onNotify(`🎉 Token ${completeModalToken.tokenNumber} completed! Receipt #${slipNumber} issued.`);
    }

    if (selectedTokenDetail && selectedTokenDetail.id === completeModalToken.id) {
      setSelectedTokenDetail((prev) => ({
        ...prev,
        status: 'COMPLETED',
        currentBay: 'Weighed & Cleared'
      }));
    }

    setCompleteModalToken(null);
  };

  const handleOpenReject = (token) => {
    setRejectModalToken(token);
    setRejectReason('');
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectModalToken) return;

    if (onUpdateToken) {
      onUpdateToken(rejectModalToken.id, {
        status: 'REJECTED',
        rejectionReason: rejectReason || 'Document / Quality Non-compliance',
        estimatedWaitMins: 0
      });
    }

    if (onNotify) {
      onNotify(`⚠️ Token ${rejectModalToken.tokenNumber} has been rejected.`);
    }

    if (selectedTokenDetail && selectedTokenDetail.id === rejectModalToken.id) {
      setSelectedTokenDetail((prev) => ({
        ...prev,
        status: 'REJECTED',
        rejectionReason: rejectReason || 'Document / Quality Non-compliance'
      }));
    }

    setRejectModalToken(null);
    setRejectReason('');
  };

  const handleOpenReschedule = (token) => {
    setRescheduleModalToken(token);
    setRescheduleDate(token.scheduledDate || '');
    setRescheduleSlot(token.scheduledSlot || '10:00 AM - 12:00 PM');
  };

  const handleConfirmReschedule = (e) => {
    e.preventDefault();
    if (!rescheduleModalToken) return;

    if (onUpdateToken) {
      onUpdateToken(rescheduleModalToken.id, {
        scheduledDate: rescheduleDate,
        scheduledSlot: rescheduleSlot
      });
    }

    if (onNotify) {
      onNotify(`📅 Token ${rescheduleModalToken.tokenNumber} rescheduled to ${rescheduleDate} (${rescheduleSlot})`);
    }

    if (selectedTokenDetail && selectedTokenDetail.id === rescheduleModalToken.id) {
      setSelectedTokenDetail((prev) => ({
        ...prev,
        scheduledDate: rescheduleDate,
        scheduledSlot: rescheduleSlot
      }));
    }

    setRescheduleModalToken(null);
  };

  // --- Export to CSV ---
  const handleExportCSV = () => {
    if (!filteredTokens.length) {
      if (onNotify) onNotify('No records available to export.');
      return;
    }

    const headers = [
      'Booking ID',
      'Farmer Name',
      'Mobile',
      'Village',
      'District',
      'Mandi',
      'Crop',
      'Estimated Quantity (Qtl)',
      'MSP Rate (INR)',
      'Scheduled Date',
      'Arrival Slot',
      'Vehicle Number',
      'Status',
      'Current Bay'
    ];

    const rows = filteredTokens.map((t) => [
      `"${t.tokenNumber || ''}"`,
      `"${t.farmerName || ''}"`,
      `"${t.phone || ''}"`,
      `"${t.village || ''}"`,
      `"${t.district || ''}"`,
      `"${t.mandiName || ''}"`,
      `"${t.crop || ''}"`,
      `"${t.estimatedQuantityQtl || 0}"`,
      `"${getCropRate(t.crop)}"`,
      `"${t.scheduledDate || ''}"`,
      `"${t.scheduledSlot || ''}"`,
      `"${t.vehicleNumber || ''}"`,
      `"${t.status || ''}"`,
      `"${t.currentBay || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `KisanSetu_Procurement_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (onNotify) {
      onNotify(`✓ Successfully exported ${filteredTokens.length} records to CSV!`);
    }
  };

  // Find related receipt for detail modal
  const tokenReceipt = useMemo(() => {
    if (!selectedTokenDetail) return null;
    return receipts.find((r) => r.tokenNumber === selectedTokenDetail.tokenNumber);
  }, [selectedTokenDetail, receipts]);

  return (
    <div className="admin-procurement-page">
      {/* 1. Header Section */}
      <div className="admin-proc-header">
        <div className="admin-proc-header-titles">
          <div className="admin-proc-icon-title">
            <div className="admin-proc-title-badge">
              <Layers size={22} />
            </div>
            <div>
              <h1 className="admin-proc-title">Procurement Management</h1>
              <p className="admin-proc-subtitle">
                Centralized monitoring, queue authorization & dispatch lifecycle operations
              </p>
            </div>
          </div>
        </div>

        <div className="admin-proc-header-actions">
          <button
            type="button"
            className="btn-proc-header btn-proc-export"
            onClick={handleExportCSV}
            title="Download CSV of current filtered data"
          >
            <Download size={16} />
            <span>Export Data</span>
          </button>
          <button
            type="button"
            className="btn-proc-header btn-proc-refresh"
            onClick={() => {
              if (onNotify) onNotify('🔄 Procurement records refreshed');
            }}
            title="Reload latest view"
          >
            <RotateCw size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary Stats Bar */}
      <div className="admin-proc-stats-grid">
        <div className="admin-proc-stat-card stat-total">
          <div className="stat-card-label">Total Bookings</div>
          <div className="stat-card-value">{stats.total}</div>
          <div className="stat-card-hint">All registered tokens</div>
        </div>
        <div className="admin-proc-stat-card stat-inyard">
          <div className="stat-card-label">In Yard</div>
          <div className="stat-card-value">{stats.inYard}</div>
          <div className="stat-card-hint">Vehicles waiting inside mandi</div>
        </div>
        <div className="admin-proc-stat-card stat-weighbridge">
          <div className="stat-card-label">At Weighbridge</div>
          <div className="stat-card-value">{stats.atWeighbridge}</div>
          <div className="stat-card-hint">Currently at gross/tare scales</div>
        </div>
        <div className="admin-proc-stat-card stat-completed">
          <div className="stat-card-label">Completed</div>
          <div className="stat-card-value">{stats.completed}</div>
          <div className="stat-card-hint">Weighed & DBT registered</div>
        </div>
        <div className="admin-proc-stat-card stat-pending">
          <div className="stat-card-label">Pending / In-Transit</div>
          <div className="stat-card-value">{stats.pending}</div>
          <div className="stat-card-hint">Scheduled or called to bays</div>
        </div>
      </div>

      {/* 2. Filters Bar */}
      <div className="admin-proc-filter-container">
        <div className="admin-proc-filter-row">
          {/* Search */}
          <div className="proc-filter-group proc-search-group">
            <label className="proc-filter-label">Search</label>
            <div className="proc-search-input-wrapper">
              <Search size={16} className="proc-search-icon" />
              <input
                type="text"
                className="proc-search-input"
                placeholder="Search token, farmer, vehicle, phone..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="proc-search-clear-btn"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* State Filter */}
          <div className="proc-filter-group">
            <label className="proc-filter-label">State</label>
            <select
              className="proc-filter-select"
              value={selectedState}
              onChange={handleStateChange}
            >
              <option value="ALL">All States</option>
              {statesList.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* Mandi Filter */}
          <div className="proc-filter-group">
            <label className="proc-filter-label">Mandi</label>
            <select
              className="proc-filter-select"
              value={selectedMandi}
              onChange={(e) => {
                setSelectedMandi(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Mandis</option>
              {mandisForState.map((m) => (
                <option key={m.id || m.name} value={m.id || m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Crop Filter */}
          <div className="proc-filter-group">
            <label className="proc-filter-label">Crop</label>
            <select
              className="proc-filter-select"
              value={selectedCrop}
              onChange={(e) => {
                setSelectedCrop(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Crops</option>
              {cropsList.map((crop) => (
                <option key={crop} value={crop}>
                  {crop}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="proc-filter-group">
            <label className="proc-filter-label">Status</label>
            <select
              className="proc-filter-select"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="IN_YARD">IN_YARD</option>
              <option value="CALLED">CALLED</option>
              <option value="AT_WEIGHBRIDGE">AT_WEIGHBRIDGE</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="proc-filter-group">
            <label className="proc-filter-label">Scheduled Date</label>
            <input
              type="date"
              className="proc-filter-input-date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Clear Filters Button */}
          <div className="proc-filter-group proc-clear-group">
            <label className="proc-filter-label invisible-label">Action</label>
            <button
              type="button"
              className="btn-proc-clear-filter"
              onClick={handleClearFilters}
              title="Reset all search filters"
            >
              <Filter size={14} />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Data Table */}
      <div className="admin-proc-table-card">
        <div className="admin-proc-table-header-info">
          <span className="proc-results-count">
            Showing <strong>{sortedTokens.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</strong> -{' '}
            <strong>{Math.min(currentPage * itemsPerPage, sortedTokens.length)}</strong> of{' '}
            <strong>{sortedTokens.length}</strong> bookings
          </span>
          {sortedTokens.length !== tokens.length && (
            <span className="proc-filtered-note">
              (Filtered from {tokens.length} total)
            </span>
          )}
        </div>

        <div className="admin-proc-table-responsive">
          <table className="admin-proc-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('tokenNumber')} className="sortable-th">
                  <div className="th-content">
                    <span>Booking ID</span>
                    {getSortIcon('tokenNumber')}
                  </div>
                </th>
                <th onClick={() => handleSort('farmerName')} className="sortable-th">
                  <div className="th-content">
                    <span>Farmer Name</span>
                    {getSortIcon('farmerName')}
                  </div>
                </th>
                <th onClick={() => handleSort('phone')} className="sortable-th">
                  <div className="th-content">
                    <span>Mobile</span>
                    {getSortIcon('phone')}
                  </div>
                </th>
                <th onClick={() => handleSort('location')} className="sortable-th">
                  <div className="th-content">
                    <span>Location</span>
                    {getSortIcon('location')}
                  </div>
                </th>
                <th onClick={() => handleSort('crop')} className="sortable-th">
                  <div className="th-content">
                    <span>Crop</span>
                    {getSortIcon('crop')}
                  </div>
                </th>
                <th onClick={() => handleSort('estimatedQuantityQtl')} className="sortable-th">
                  <div className="th-content">
                    <span>Quantity</span>
                    {getSortIcon('estimatedQuantityQtl')}
                  </div>
                </th>
                <th onClick={() => handleSort('mspRate')} className="sortable-th">
                  <div className="th-content">
                    <span>MSP Rate</span>
                    {getSortIcon('mspRate')}
                  </div>
                </th>
                <th onClick={() => handleSort('scheduledSlot')} className="sortable-th">
                  <div className="th-content">
                    <span>Arrival Slot</span>
                    {getSortIcon('scheduledSlot')}
                  </div>
                </th>
                <th onClick={() => handleSort('vehicleNumber')} className="sortable-th">
                  <div className="th-content">
                    <span>Vehicle No.</span>
                    {getSortIcon('vehicleNumber')}
                  </div>
                </th>
                <th onClick={() => handleSort('status')} className="sortable-th">
                  <div className="th-content">
                    <span>Status</span>
                    {getSortIcon('status')}
                  </div>
                </th>
                <th className="actions-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTokens.length === 0 ? (
                <tr>
                  <td colSpan={11} className="proc-empty-td">
                    <div className="proc-empty-state">
                      <AlertTriangle size={32} className="proc-empty-icon" />
                      <p className="proc-empty-title">No procurement bookings found</p>
                      <p className="proc-empty-desc">
                        Try modifying search parameters or clear the active filters.
                      </p>
                      <button
                        type="button"
                        className="btn-proc-clear-filter mt-2"
                        onClick={handleClearFilters}
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedTokens.map((token) => {
                  const rate = getCropRate(token.crop);
                  return (
                    <tr
                      key={token.id}
                      className="proc-table-row"
                      onClick={() => setSelectedTokenDetail(token)}
                    >
                      <td className="font-semibold text-green-800">
                        <span className="token-number-cell">{token.tokenNumber}</span>
                      </td>
                      <td>
                        <div className="farmer-name-cell font-medium text-gray-900">
                          {token.farmerName}
                        </div>
                        {token.farmerAadhaarLast4 && (
                          <div className="aadhaar-hint">UID: •••• {token.farmerAadhaarLast4}</div>
                        )}
                      </td>
                      <td className="whitespace-nowrap text-gray-600">{token.phone}</td>
                      <td>
                        <div className="location-cell">
                          <span className="district-tag">{token.district || 'Dist.'}</span>
                          <span className="village-tag">{token.village || 'Village'}</span>
                        </div>
                      </td>
                      <td>
                        <span className="crop-pill">{token.crop}</span>
                      </td>
                      <td className="font-semibold text-gray-800">
                        {token.estimatedQuantityQtl} Qtl
                      </td>
                      <td className="font-semibold text-emerald-700 whitespace-nowrap">
                        ₹ {rate.toLocaleString('en-IN')} / Qtl
                      </td>
                      <td>
                        <div className="slot-cell">
                          <span className="slot-time">{token.scheduledSlot}</span>
                          <span className="slot-date">{token.scheduledDate}</span>
                        </div>
                      </td>
                      <td className="font-mono text-xs uppercase font-semibold text-gray-700">
                        {token.vehicleNumber}
                      </td>
                      <td>{renderStatusBadge(token.status)}</td>
                      <td
                        className="action-cell"
                        onClick={(e) => e.stopPropagation() /* Prevent row click modal */}
                      >
                        <div className="row-action-buttons">
                          {token.status === 'SCHEDULED' && (
                            <button
                              type="button"
                              className="btn-proc-act btn-proc-approve"
                              onClick={() => handleApprove(token)}
                              title="Verify at gate & allow yard entry"
                            >
                              <CheckCircle size={14} />
                              <span>Approve</span>
                            </button>
                          )}

                          {token.status === 'IN_YARD' && (
                            <button
                              type="button"
                              className="btn-proc-act btn-proc-call"
                              onClick={() => handleCallToBay(token)}
                              title="Call vehicle to inspection bay"
                            >
                              <UserCheck size={14} />
                              <span>Call Bay</span>
                            </button>
                          )}

                          {token.status === 'CALLED' && (
                            <button
                              type="button"
                              className="btn-proc-act btn-proc-weigh"
                              onClick={() => handleStartWeighment(token)}
                              title="Admit to weighbridge station"
                            >
                              <Scale size={14} />
                              <span>Weigh</span>
                            </button>
                          )}

                          {token.status === 'AT_WEIGHBRIDGE' && (
                            <button
                              type="button"
                              className="btn-proc-act btn-proc-complete"
                              onClick={() => handleOpenCompleteModal(token)}
                              title="Record tare/gross & finalize slip"
                            >
                              <CheckCircle2 size={14} />
                              <span>Complete</span>
                            </button>
                          )}

                          {token.status !== 'COMPLETED' && token.status !== 'REJECTED' && (
                            <>
                              <button
                                type="button"
                                className="btn-proc-act-icon btn-proc-reschedule"
                                onClick={() => handleOpenReschedule(token)}
                                title="Reschedule Date & Time"
                              >
                                <Calendar size={14} />
                              </button>
                              <button
                                type="button"
                                className="btn-proc-act-icon btn-proc-reject"
                                onClick={() => handleOpenReject(token)}
                                title="Reject entry"
                              >
                                <XCircle size={14} />
                              </button>
                            </>
                          )}

                          <button
                            type="button"
                            className="btn-proc-act-icon btn-proc-view"
                            onClick={() => setSelectedTokenDetail(token)}
                            title="View Full Booking Details"
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="proc-pagination-bar">
          <div className="proc-pagination-info">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </div>
          <div className="proc-pagination-controls">
            <button
              type="button"
              className="proc-page-btn"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>
            <div className="proc-page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`proc-page-num-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="proc-page-btn"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Detailed Booking View (Modal/Panel) */}
      {selectedTokenDetail && (
        <div className="proc-modal-backdrop" onClick={() => setSelectedTokenDetail(null)}>
          <div
            className="proc-modal-container proc-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="proc-modal-header">
              <div className="proc-modal-title-wrap">
                <span className="proc-modal-tag">Booking Dossier</span>
                <h2 className="proc-modal-title">
                  Token #{selectedTokenDetail.tokenNumber}
                </h2>
              </div>
              <button
                type="button"
                className="proc-modal-close"
                onClick={() => setSelectedTokenDetail(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="proc-modal-body">
              {/* Timeline / Progress Tracker */}
              <div className="proc-timeline-card">
                <h4 className="proc-section-heading">Procurement Lifecycle Progress</h4>
                <div className="proc-timeline-bar">
                  {[
                    { key: 'SCHEDULED', label: '1. Scheduled' },
                    { key: 'IN_YARD', label: '2. Gate Check-In' },
                    { key: 'CALLED', label: '3. Called to Bay' },
                    { key: 'AT_WEIGHBRIDGE', label: '4. Weighment' },
                    { key: 'COMPLETED', label: '5. Completed' }
                  ].map((step, idx) => {
                    const statusSequence = ['SCHEDULED', 'IN_YARD', 'CALLED', 'AT_WEIGHBRIDGE', 'COMPLETED'];
                    const currentIdx = statusSequence.indexOf(selectedTokenDetail.status);
                    const isPassed = currentIdx >= idx;
                    const isCurrent = currentIdx === idx;
                    const isRejected = selectedTokenDetail.status === 'REJECTED';

                    return (
                      <div
                        key={step.key}
                        className={`proc-timeline-step ${
                          isRejected
                            ? 'rejected'
                            : isCurrent
                            ? 'active'
                            : isPassed
                            ? 'completed'
                            : 'pending'
                        }`}
                      >
                        <div className="step-circle">
                          {isPassed ? <CheckCircle size={14} /> : idx + 1}
                        </div>
                        <div className="step-label">{step.label}</div>
                      </div>
                    );
                  })}
                </div>
                {selectedTokenDetail.status === 'REJECTED' && (
                  <div className="rejection-alert-box">
                    <AlertTriangle size={18} />
                    <div>
                      <strong>Booking Rejected:</strong>{' '}
                      {selectedTokenDetail.rejectionReason || 'Non-compliance with FAQ standards'}
                    </div>
                  </div>
                )}
              </div>

              {/* Farmer & Lot Details Grid */}
              <div className="proc-details-grid">
                <div className="proc-detail-card">
                  <div className="proc-card-heading">
                    <UserCheck size={16} /> Farmer Information
                  </div>
                  <div className="proc-data-row">
                    <span className="proc-data-label">Farmer Full Name</span>
                    <span className="proc-data-val font-semibold">{selectedTokenDetail.farmerName}</span>
                  </div>
                  <div className="proc-data-row">
                    <span className="proc-data-label">Contact Mobile</span>
                    <span className="proc-data-val">{selectedTokenDetail.phone}</span>
                  </div>
                  <div className="proc-data-row">
                    <span className="proc-data-label">Aadhaar (Last 4)</span>
                    <span className="proc-data-val">•••• {selectedTokenDetail.farmerAadhaarLast4 || 'N/A'}</span>
                  </div>
                  <div className="proc-data-row">
                    <span className="proc-data-label">Village / District</span>
                    <span className="proc-data-val">
                      {selectedTokenDetail.village}, {selectedTokenDetail.district}
                    </span>
                  </div>
                </div>

                <div className="proc-detail-card">
                  <div className="proc-card-heading">
                    <Truck size={16} /> Lot & Vehicle Logistics
                  </div>
                  <div className="proc-data-row">
                    <span className="proc-data-label">Procurement Mandi</span>
                    <span className="proc-data-val">{selectedTokenDetail.mandiName}</span>
                  </div>
                  <div className="proc-data-row">
                    <span className="proc-data-label">Crop Commodity</span>
                    <span className="proc-data-val font-semibold">{selectedTokenDetail.crop}</span>
                  </div>
                  <div className="proc-data-row">
                    <span className="proc-data-label">Declared Quantity</span>
                    <span className="proc-data-val">{selectedTokenDetail.estimatedQuantityQtl} Quintals</span>
                  </div>
                  <div className="proc-data-row">
                    <span className="proc-data-label">Vehicle Registration</span>
                    <span className="proc-data-val font-mono">{selectedTokenDetail.vehicleNumber}</span>
                  </div>
                  <div className="proc-data-row">
                    <span className="proc-data-label">Vehicle Type</span>
                    <span className="proc-data-val">{selectedTokenDetail.vehicleType || 'Tractor Trolley'}</span>
                  </div>
                </div>

                <div className="proc-detail-card">
                  <div className="proc-card-heading">
                    <Clock size={16} /> Slot & Gate Tracking
                  </div>
                  <div className="proc-data-row">
                    <span className="proc-data-label">Scheduled Date</span>
                    <span className="proc-data-val">{selectedTokenDetail.scheduledDate}</span>
                  </div>
                  <div className="proc-data-row">
                    <span className="proc-data-label">Time Window</span>
                    <span className="proc-data-val">{selectedTokenDetail.scheduledSlot}</span>
                  </div>
                  <div className="proc-data-row">
                    <span className="proc-data-label">Gate Check-In Time</span>
                    <span className="proc-data-val">{selectedTokenDetail.gateCheckInTime || 'Awaiting Gate Entry'}</span>
                  </div>
                  <div className="proc-data-row">
                    <span className="proc-data-label">Assigned Bay</span>
                    <span className="proc-data-val">{selectedTokenDetail.currentBay || 'Pending Bay Assignment'}</span>
                  </div>
                </div>

                <div className="proc-detail-card">
                  <div className="proc-card-heading">
                    <IndianRupee size={16} /> Official MSP Value
                  </div>
                  <div className="proc-data-row">
                    <span className="proc-data-label">Applicable MSP Rate</span>
                    <span className="proc-data-val font-semibold text-emerald-700">
                      ₹ {getCropRate(selectedTokenDetail.crop).toLocaleString('en-IN')} / Qtl
                    </span>
                  </div>
                  <div className="proc-data-row">
                    <span className="proc-data-label">Estimated Lot Value</span>
                    <span className="proc-data-val font-bold text-gray-900">
                      ₹ {(getCropRate(selectedTokenDetail.crop) * (selectedTokenDetail.estimatedQuantityQtl || 0)).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="proc-data-row">
                    <span className="proc-data-label">Disbursement Mode</span>
                    <span className="proc-data-val">Direct DBT (Aadhaar PFMS)</span>
                  </div>
                  <div className="proc-data-row">
                    <span className="proc-data-label">Procurement Season</span>
                    <span className="proc-data-val">Rabi / Kharif 2026</span>
                  </div>
                </div>
              </div>

              {/* Completed Receipt Card if Completed */}
              {tokenReceipt && (
                <div className="proc-completed-receipt-card">
                  <div className="receipt-banner-header">
                    <FileText size={20} />
                    <div>
                      <h4 className="receipt-banner-title">
                        Electronic Weighment Slip ({tokenReceipt.slipNumber})
                      </h4>
                      <p className="receipt-banner-sub">
                        Operator: {tokenReceipt.weighbridgeOperator} | Timestamp: {tokenReceipt.timestamp}
                      </p>
                    </div>
                  </div>

                  <div className="receipt-metrics-grid">
                    <div className="receipt-metric-item">
                      <div className="rec-lbl">Gross Weight</div>
                      <div className="rec-val">{tokenReceipt.grossWeightKg?.toLocaleString()} kg</div>
                    </div>
                    <div className="receipt-metric-item">
                      <div className="rec-lbl">Tare Weight</div>
                      <div className="rec-val">{tokenReceipt.tareWeightKg?.toLocaleString()} kg</div>
                    </div>
                    <div className="receipt-metric-item">
                      <div className="rec-lbl">Net Weight</div>
                      <div className="rec-val text-green-700">{tokenReceipt.netWeightKg?.toLocaleString()} kg</div>
                    </div>
                    <div className="receipt-metric-item">
                      <div className="rec-lbl">Net Quintals</div>
                      <div className="rec-val">{tokenReceipt.netQuintals} Qtl</div>
                    </div>
                    <div className="receipt-metric-item">
                      <div className="rec-lbl">Moisture %</div>
                      <div className="rec-val">{tokenReceipt.moisturePercent}%</div>
                    </div>
                    <div className="receipt-metric-item highlight-total">
                      <div className="rec-lbl">Total DBT Payable</div>
                      <div className="rec-val font-bold text-emerald-800">
                        ₹ {tokenReceipt.totalPayableAmount?.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <div className="receipt-footer-dbt">
                    <span className="dbt-tag">
                      <strong>Payment Status:</strong> {tokenReceipt.paymentStatus}
                    </span>
                    <span className="dbt-ref">
                      <strong>Ref:</strong> {tokenReceipt.dbtReferenceId} ({tokenReceipt.bankAccountEnding})
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="proc-modal-footer">
              <div className="modal-footer-left">
                {renderStatusBadge(selectedTokenDetail.status)}
              </div>
              <div className="modal-footer-right">
                {selectedTokenDetail.status === 'SCHEDULED' && (
                  <button
                    type="button"
                    className="btn-proc-act btn-proc-approve"
                    onClick={() => handleApprove(selectedTokenDetail)}
                  >
                    <CheckCircle size={16} /> Approve & Check-In
                  </button>
                )}
                {selectedTokenDetail.status === 'IN_YARD' && (
                  <button
                    type="button"
                    className="btn-proc-act btn-proc-call"
                    onClick={() => handleCallToBay(selectedTokenDetail)}
                  >
                    <UserCheck size={16} /> Call to Bay
                  </button>
                )}
                {selectedTokenDetail.status === 'CALLED' && (
                  <button
                    type="button"
                    className="btn-proc-act btn-proc-weigh"
                    onClick={() => handleStartWeighment(selectedTokenDetail)}
                  >
                    <Scale size={16} /> Start Weighment
                  </button>
                )}
                {selectedTokenDetail.status === 'AT_WEIGHBRIDGE' && (
                  <button
                    type="button"
                    className="btn-proc-act btn-proc-complete"
                    onClick={() => handleOpenCompleteModal(selectedTokenDetail)}
                  >
                    <CheckCircle2 size={16} /> Finalize Weighment
                  </button>
                )}
                <button
                  type="button"
                  className="btn-proc-modal-close"
                  onClick={() => setSelectedTokenDetail(null)}
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Reject Confirmation Modal */}
      {rejectModalToken && (
        <div className="proc-modal-backdrop" onClick={() => setRejectModalToken(null)}>
          <div className="proc-submodal-box" onClick={(e) => e.stopPropagation()}>
            <div className="proc-submodal-header text-red-700">
              <AlertTriangle size={22} />
              <h3>Reject Booking #{rejectModalToken.tokenNumber}</h3>
            </div>
            <form onSubmit={handleConfirmReject}>
              <div className="proc-submodal-body">
                <p className="text-sm text-gray-700 mb-3">
                  Are you sure you want to reject procurement entry for{' '}
                  <strong>{rejectModalToken.farmerName}</strong> (Vehicle: {rejectModalToken.vehicleNumber})?
                </p>
                <div className="proc-field-block">
                  <label className="proc-field-label">Rejection Reason *</label>
                  <select
                    className="proc-field-select"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    required
                  >
                    <option value="">Select a reason...</option>
                    <option value="High Moisture (Exceeds FAQ Tolerance Limit)">
                      High Moisture (Exceeds FAQ Tolerance Limit)
                    </option>
                    <option value="Foreign Matter / Infestation Detected">
                      Foreign Matter / Infestation Detected
                    </option>
                    <option value="Discrepancy in Land / Identity Documentation">
                      Discrepancy in Land / Identity Documentation
                    </option>
                    <option value="Daily Farmer Procurement Quota Exceeded">
                      Daily Farmer Procurement Quota Exceeded
                    </option>
                    <option value="Mandi Operating Hours Concluded">
                      Mandi Operating Hours Concluded
                    </option>
                  </select>
                </div>
              </div>
              <div className="proc-submodal-footer">
                <button
                  type="button"
                  className="btn-proc-cancel"
                  onClick={() => setRejectModalToken(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-proc-danger">
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Reschedule Modal */}
      {rescheduleModalToken && (
        <div className="proc-modal-backdrop" onClick={() => setRescheduleModalToken(null)}>
          <div className="proc-submodal-box" onClick={(e) => e.stopPropagation()}>
            <div className="proc-submodal-header text-emerald-800">
              <Calendar size={22} />
              <h3>Reschedule Slot: #{rescheduleModalToken.tokenNumber}</h3>
            </div>
            <form onSubmit={handleConfirmReschedule}>
              <div className="proc-submodal-body">
                <p className="text-sm text-gray-700 mb-3">
                  Assign a new procurement date and time slot for{' '}
                  <strong>{rescheduleModalToken.farmerName}</strong>.
                </p>
                <div className="proc-field-block mb-3">
                  <label className="proc-field-label">New Date</label>
                  <input
                    type="date"
                    className="proc-field-input"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    required
                  />
                </div>
                <div className="proc-field-block">
                  <label className="proc-field-label">Time Window</label>
                  <select
                    className="proc-field-select"
                    value={rescheduleSlot}
                    onChange={(e) => setRescheduleSlot(e.target.value)}
                  >
                    <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                    <option value="01:30 PM - 03:30 PM">01:30 PM - 03:30 PM</option>
                    <option value="03:30 PM - 05:30 PM">03:30 PM - 05:30 PM</option>
                  </select>
                </div>
              </div>
              <div className="proc-submodal-footer">
                <button
                  type="button"
                  className="btn-proc-cancel"
                  onClick={() => setRescheduleModalToken(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-proc-primary">
                  Save Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Completion Form Modal */}
      {completeModalToken && (
        <div className="proc-modal-backdrop" onClick={() => setCompleteModalToken(null)}>
          <div className="proc-submodal-box proc-submodal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="proc-submodal-header text-emerald-800">
              <CheckCircle2 size={22} />
              <h3>Record Weighment & Issue Receipt</h3>
            </div>
            <form onSubmit={handleConfirmCompletion}>
              <div className="proc-submodal-body">
                <div className="proc-lot-summary mb-3">
                  <span><strong>Farmer:</strong> {completeModalToken.farmerName}</span>
                  <span><strong>Token:</strong> {completeModalToken.tokenNumber}</span>
                  <span><strong>Crop:</strong> {completeModalToken.crop}</span>
                </div>

                <div className="proc-modal-form-grid">
                  <div className="proc-field-block">
                    <label className="proc-field-label">Gross Weight (kg)</label>
                    <input
                      type="number"
                      className="proc-field-input"
                      value={completionGrossWeight}
                      onChange={(e) => setCompletionGrossWeight(Number(e.target.value))}
                      required
                    />
                  </div>
                  <div className="proc-field-block">
                    <label className="proc-field-label">Tare Weight (kg)</label>
                    <input
                      type="number"
                      className="proc-field-input"
                      value={completionTareWeight}
                      onChange={(e) => setCompletionTareWeight(Number(e.target.value))}
                      required
                    />
                  </div>
                  <div className="proc-field-block">
                    <label className="proc-field-label">Moisture Content (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="proc-field-input"
                      value={completionMoisture}
                      onChange={(e) => setCompletionMoisture(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                {/* Live Calculated Stats */}
                <div className="proc-completion-calc-card">
                  <div className="calc-row">
                    <span>Net Weight:</span>
                    <strong>{Math.max(0, completionGrossWeight - completionTareWeight).toLocaleString()} kg</strong>
                  </div>
                  <div className="calc-row">
                    <span>Net Quintals:</span>
                    <strong>{((Math.max(0, completionGrossWeight - completionTareWeight)) / 100).toFixed(2)} Qtl</strong>
                  </div>
                  <div className="calc-row">
                    <span>MSP Rate:</span>
                    <strong>₹ {getCropRate(completeModalToken.crop).toLocaleString('en-IN')} / Qtl</strong>
                  </div>
                  <div className="calc-row calc-total-row">
                    <span>Total DBT Payable:</span>
                    <strong className="text-emerald-800">
                      ₹ {Math.round(((Math.max(0, completionGrossWeight - completionTareWeight)) / 100) * getCropRate(completeModalToken.crop)).toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>
              </div>
              <div className="proc-submodal-footer">
                <button
                  type="button"
                  className="btn-proc-cancel"
                  onClick={() => setCompleteModalToken(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-proc-primary">
                  Generate Electronic Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
