import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Building2, 
  Layers, 
  Search, 
  ChevronRight, 
  Globe, 
  Copy, 
  Check, 
  Filter, 
  ArrowUpDown, 
  RotateCcw,
  Compass,
  CheckCircle2,
  Navigation,
  Info
} from 'lucide-react';
import { indiaAdministrativeDirectory } from '../../data/indiaAdministrativeDirectory';

export default function AdminLocations({ onNotify }) {
  // Cascading dropdown states
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTaluk, setSelectedTaluk] = useState('');

  // Table search & filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name'); // 'name', 'districts', 'taluks'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Expanded state in summary table
  const [expandedState, setExpandedState] = useState(null);
  const [copiedPath, setCopiedPath] = useState(false);

  // 1. Overall stats calculation (Memoized)
  const { totalStates, totalDistricts, totalTaluks, stateSummaries } = useMemo(() => {
    const states = Object.keys(indiaAdministrativeDirectory || {});
    let districtsCount = 0;
    let taluksCount = 0;

    const summaries = states.map((st) => {
      const districtsObj = indiaAdministrativeDirectory[st] || {};
      const dNames = Object.keys(districtsObj);
      let tCount = 0;
      dNames.forEach((d) => {
        tCount += (districtsObj[d] || []).length;
      });
      districtsCount += dNames.length;
      taluksCount += tCount;

      return {
        state: st,
        districtCount: dNames.length,
        talukCount: tCount,
        districts: dNames
      };
    });

    return {
      totalStates: states.length,
      totalDistricts: districtsCount,
      totalTaluks: taluksCount,
      stateSummaries: summaries
    };
  }, []);

  // Sorted list of state names for dropdown
  const allStateNames = useMemo(() => {
    return Object.keys(indiaAdministrativeDirectory || {}).sort((a, b) => a.localeCompare(b));
  }, []);

  // Districts for currently selected state
  const availableDistricts = useMemo(() => {
    if (!selectedState || !indiaAdministrativeDirectory[selectedState]) return [];
    return Object.keys(indiaAdministrativeDirectory[selectedState]).sort((a, b) => a.localeCompare(b));
  }, [selectedState]);

  // Taluks for currently selected district
  const availableTaluks = useMemo(() => {
    if (!selectedState || !selectedDistrict || !indiaAdministrativeDirectory[selectedState]?.[selectedDistrict]) {
      return [];
    }
    return (indiaAdministrativeDirectory[selectedState][selectedDistrict] || []).slice().sort((a, b) => a.localeCompare(b));
  }, [selectedState, selectedDistrict]);

  // Handlers for cascading dropdowns
  const handleStateChange = (e) => {
    const val = e.target.value;
    setSelectedState(val);
    setSelectedDistrict('');
    setSelectedTaluk('');
  };

  const handleDistrictChange = (e) => {
    const val = e.target.value;
    setSelectedDistrict(val);
    setSelectedTaluk('');
  };

  const handleTalukChange = (e) => {
    setSelectedTaluk(e.target.value);
  };

  const handleReset = () => {
    setSelectedState('');
    setSelectedDistrict('');
    setSelectedTaluk('');
    if (onNotify) onNotify('Location filters reset to default');
  };

  // Quick select from table
  const handleSelectFromTable = (stateName) => {
    setSelectedState(stateName);
    setSelectedDistrict('');
    setSelectedTaluk('');
    window.scrollTo({ top: 120, behavior: 'smooth' });
    if (onNotify) onNotify(`Selected state: ${stateName}`);
  };

  // Copy full breadcrumb path
  const handleCopyPath = () => {
    const path = [selectedState, selectedDistrict, selectedTaluk].filter(Boolean).join(' > ');
    if (!path) return;
    navigator.clipboard?.writeText(path).then(() => {
      setCopiedPath(true);
      setTimeout(() => setCopiedPath(false), 2000);
      if (onNotify) onNotify(`Copied to clipboard: ${path}`);
    }).catch(() => {});
  };

  // Filtered and sorted state summaries for table
  const filteredSummaries = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    let result = stateSummaries;

    if (query) {
      result = result.filter((item) => {
        const stateMatch = item.state.toLowerCase().includes(query);
        const districtMatch = item.districts.some((d) => d.toLowerCase().includes(query));
        return stateMatch || districtMatch;
      });
    }

    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') {
        cmp = a.state.localeCompare(b.state);
      } else if (sortField === 'districts') {
        cmp = a.districtCount - b.districtCount;
      } else if (sortField === 'taluks') {
        cmp = a.talukCount - b.talukCount;
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [stateSummaries, searchTerm, sortField, sortOrder]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredSummaries.length / itemsPerPage) || 1;
  const paginatedSummaries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSummaries.slice(start, start + itemsPerPage);
  }, [filteredSummaries, currentPage, itemsPerPage]);

  const handleSortToggle = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="admin-page-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Compass className="text-green-600" style={{ color: '#16a34a' }} size={28} />
            India Administrative Directory & Locations
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
            Official Local Government Directory (LGD) registry for State, District, and Sub-District / Taluk jurisdiction mapping.
          </p>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
        {/* Total States */}
        <div style={{
          background: '#ffffff',
          borderRadius: '14px',
          padding: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            background: '#dcfce7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#15803d'
          }}>
            <Globe size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              States & UTs
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginTop: '2px' }}>
              {totalStates}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600, marginTop: '4px' }}>
              National Coverage (LGD)
            </div>
          </div>
        </div>

        {/* Total Districts */}
        <div style={{
          background: '#ffffff',
          borderRadius: '14px',
          padding: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            background: '#e0f2fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0369a1'
          }}>
            <Building2 size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Districts
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginTop: '2px' }}>
              {totalDistricts.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600, marginTop: '4px' }}>
              Revenue District Divisions
            </div>
          </div>
        </div>

        {/* Total Taluks */}
        <div style={{
          background: '#ffffff',
          borderRadius: '14px',
          padding: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            background: '#fef3c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#b45309'
          }}>
            <Layers size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Taluks / Tehsils
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginTop: '2px' }}>
              {totalTaluks.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 600, marginTop: '4px' }}>
              Sub-District Administrative Units
            </div>
          </div>
        </div>
      </div>

      {/* Cascading Location Explorer Box */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '26px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Navigation size={20} style={{ color: '#16a34a' }} />
              Cascading Location Explorer
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
              Select a State to dynamically populate corresponding Districts, then choose a District to explore its Taluks/Tehsils.
            </p>
          </div>

          {(selectedState || selectedDistrict || selectedTaluk) && (
            <button
              onClick={handleReset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                color: '#475569',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={14} />
              Reset Selection
            </button>
          )}
        </div>

        {/* Dropdowns row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '22px' }}>
          {/* 1. State Dropdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={15} style={{ color: '#16a34a' }} />
              1. Select State / UT <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              value={selectedState}
              onChange={handleStateChange}
              style={{
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                fontSize: '0.92rem',
                color: '#0f172a',
                outline: 'none',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <option value="">-- Choose State / Union Territory ({allStateNames.length}) --</option>
              {allStateNames.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* 2. District Dropdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={15} style={{ color: selectedState ? '#0284c7' : '#94a3b8' }} />
              2. Select District {selectedState && `(${availableDistricts.length})`}
            </label>
            <select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              disabled={!selectedState}
              style={{
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                backgroundColor: selectedState ? '#f8fafc' : '#f1f5f9',
                fontSize: '0.92rem',
                color: selectedState ? '#0f172a' : '#94a3b8',
                outline: 'none',
                fontWeight: 600,
                cursor: selectedState ? 'pointer' : 'not-allowed'
              }}
            >
              <option value="">
                {selectedState ? `-- Choose District (${availableDistricts.length}) --` : '← Select a State first'}
              </option>
              {availableDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Taluk / Tehsil Dropdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={15} style={{ color: selectedDistrict ? '#d97706' : '#94a3b8' }} />
              3. Select Taluk / Tehsil {selectedDistrict && `(${availableTaluks.length})`}
            </label>
            <select
              value={selectedTaluk}
              onChange={handleTalukChange}
              disabled={!selectedDistrict}
              style={{
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                backgroundColor: selectedDistrict ? '#f8fafc' : '#f1f5f9',
                fontSize: '0.92rem',
                color: selectedDistrict ? '#0f172a' : '#94a3b8',
                outline: 'none',
                fontWeight: 600,
                cursor: selectedDistrict ? 'pointer' : 'not-allowed'
              }}
            >
              <option value="">
                {selectedDistrict ? `-- Choose Taluk / Sub-District (${availableTaluks.length}) --` : '← Select a District first'}
              </option>
              {availableTaluks.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Breadcrumb Path Banner */}
        <div style={{
          background: selectedState ? '#f0fdf4' : '#f8fafc',
          border: `1.5px solid ${selectedState ? '#86efac' : '#e2e8f0'}`,
          borderRadius: '12px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Hierarchy Path:
            </span>

            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.88rem',
              fontWeight: selectedState ? 700 : 500,
              color: selectedState ? '#15803d' : '#94a3b8'
            }}>
              <Globe size={14} />
              {selectedState || 'All India'}
            </span>

            <ChevronRight size={15} style={{ color: '#94a3b8' }} />

            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.88rem',
              fontWeight: selectedDistrict ? 700 : 500,
              color: selectedDistrict ? '#0369a1' : '#94a3b8'
            }}>
              <Building2 size={14} />
              {selectedDistrict || 'Any District'}
            </span>

            <ChevronRight size={15} style={{ color: '#94a3b8' }} />

            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.88rem',
              fontWeight: selectedTaluk ? 700 : 500,
              color: selectedTaluk ? '#b45309' : '#94a3b8'
            }}>
              <Layers size={14} />
              {selectedTaluk || 'Any Taluk / Tehsil'}
            </span>
          </div>

          {selectedState && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handleCopyPath}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: '#ffffff',
                  border: '1px solid #86efac',
                  color: '#166534',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {copiedPath ? <Check size={13} /> : <Copy size={13} />}
                {copiedPath ? 'Copied' : 'Copy Path'}
              </button>
            </div>
          )}
        </div>

        {/* Selected location details preview */}
        {selectedState && (
          <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                {selectedDistrict ? (
                  <>Taluks in <span style={{ color: '#0369a1' }}>{selectedDistrict}</span> ({availableTaluks.length}):</>
                ) : (
                  <>Districts in <span style={{ color: '#15803d' }}>{selectedState}</span> ({availableDistricts.length}):</>
                )}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Click to explore further
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '140px', overflowY: 'auto', padding: '4px' }}>
              {selectedDistrict ? (
                availableTaluks.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTaluk(t)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: selectedTaluk === t ? 700 : 500,
                      background: selectedTaluk === t ? '#d97706' : '#fef3c7',
                      color: selectedTaluk === t ? '#ffffff' : '#92400e',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Layers size={11} />
                    {t}
                  </button>
                ))
              ) : (
                availableDistricts.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDistrict(d)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 500,
                      background: '#e0f2fe',
                      color: '#075985',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Building2 size={11} />
                    {d}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* States & Districts Summary Table */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        overflow: 'hidden'
      }}>
        {/* Table header bar with search */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          background: '#fafafa'
        }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
              State & District Directory Breakdown
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
              Showing {filteredSummaries.length} administrative regions with district & taluk totals
            </p>
          </div>

          {/* Search box */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            minWidth: '280px'
          }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search state or district..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                backgroundColor: '#ffffff',
                outline: 'none',
                color: '#0f172a'
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  border: 'none',
                  background: 'none',
                  color: '#94a3b8',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Table container */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0' }}>
                <th style={{ padding: '12px 20px', fontWeight: 700, color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  #
                </th>
                <th
                  onClick={() => handleSortToggle('name')}
                  style={{ padding: '12px 20px', fontWeight: 700, color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    State / Union Territory
                    <ArrowUpDown size={13} style={{ color: sortField === 'name' ? '#16a34a' : '#94a3b8' }} />
                  </div>
                </th>
                <th
                  onClick={() => handleSortToggle('districts')}
                  style={{ padding: '12px 20px', fontWeight: 700, color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Districts Count
                    <ArrowUpDown size={13} style={{ color: sortField === 'districts' ? '#16a34a' : '#94a3b8' }} />
                  </div>
                </th>
                <th
                  onClick={() => handleSortToggle('taluks')}
                  style={{ padding: '12px 20px', fontWeight: 700, color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Taluks / Tehsils Count
                    <ArrowUpDown size={13} style={{ color: sortField === 'taluks' ? '#16a34a' : '#94a3b8' }} />
                  </div>
                </th>
                <th style={{ padding: '12px 20px', fontWeight: 700, color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  Sample Districts
                </th>
                <th style={{ padding: '12px 20px', fontWeight: 700, color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase', textAlign: 'right' }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedSummaries.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
                    No matching states or districts found for "{searchTerm}".
                  </td>
                </tr>
              ) : (
                paginatedSummaries.map((item, idx) => {
                  const isCurrentSelected = selectedState === item.state;
                  const isExpanded = expandedState === item.state;
                  const rowNumber = (currentPage - 1) * itemsPerPage + idx + 1;

                  return (
                    <React.Fragment key={item.state}>
                      <tr
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          backgroundColor: isCurrentSelected ? '#f0fdf4' : 'transparent',
                          transition: 'background-color 0.15s ease'
                        }}
                      >
                        <td style={{ padding: '14px 20px', color: '#64748b', fontWeight: 600, fontSize: '0.8rem' }}>
                          {rowNumber}
                        </td>
                        <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0f172a' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: isCurrentSelected ? '#16a34a' : '#cbd5e1'
                            }} />
                            {item.state}
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            background: '#e0f2fe',
                            color: '#0369a1',
                            fontWeight: 700,
                            fontSize: '0.82rem'
                          }}>
                            {item.districtCount} Districts
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            background: '#fef3c7',
                            color: '#b45309',
                            fontWeight: 700,
                            fontSize: '0.82rem'
                          }}>
                            {item.talukCount} Taluks
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px', color: '#64748b', fontSize: '0.82rem' }}>
                          {item.districts.slice(0, 3).join(', ')}
                          {item.districts.length > 3 && ` +${item.districts.length - 3} more`}
                        </td>
                        <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              onClick={() => setExpandedState(isExpanded ? null : item.state)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                background: isExpanded ? '#e2e8f0' : '#ffffff',
                                color: '#334155',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              {isExpanded ? 'Hide List' : 'View Districts'}
                            </button>
                            <button
                              onClick={() => handleSelectFromTable(item.state)}
                              style={{
                                padding: '6px 14px',
                                borderRadius: '6px',
                                border: 'none',
                                background: '#16a34a',
                                color: '#ffffff',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              Select
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable row showing all districts in this state */}
                      {isExpanded && (
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                          <td colSpan={6} style={{ padding: '16px 24px' }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                              All {item.districts.length} Districts of {item.state}:
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {item.districts.map((dist) => {
                                const talukList = indiaAdministrativeDirectory[item.state]?.[dist] || [];
                                return (
                                  <span
                                    key={dist}
                                    style={{
                                      background: '#ffffff',
                                      border: '1px solid #e2e8f0',
                                      padding: '4px 8px',
                                      borderRadius: '6px',
                                      fontSize: '0.76rem',
                                      color: '#1e293b',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                  >
                                    <MapPin size={10} style={{ color: '#16a34a' }} />
                                    <b>{dist}</b>
                                    <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>({talukList.length} taluks)</span>
                                  </span>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            background: '#ffffff'
          }}>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Showing Page <b>{currentPage}</b> of <b>{totalPages}</b> ({filteredSummaries.length} total entries)
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: currentPage === 1 ? '#f1f5f9' : '#ffffff',
                  color: currentPage === 1 ? '#94a3b8' : '#334155',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                .map((p, index, array) => {
                  const showEllipsis = index > 0 && p - array[index - 1] > 1;
                  return (
                    <React.Fragment key={p}>
                      {showEllipsis && <span style={{ padding: '6px 8px', color: '#94a3b8' }}>...</span>}
                      <button
                        onClick={() => setCurrentPage(p)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: p === currentPage ? 'none' : '1px solid #cbd5e1',
                          background: p === currentPage ? '#16a34a' : '#ffffff',
                          color: p === currentPage ? '#ffffff' : '#334155',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  );
                })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: currentPage === totalPages ? '#f1f5f9' : '#ffffff',
                  color: currentPage === totalPages ? '#94a3b8' : '#334155',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
