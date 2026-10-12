import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  Truck, 
  Clock, 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  X, 
  Save, 
  Globe, 
  Activity,
  ShieldCheck,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { configuredMandis, officialMSPRates } from '../../data/procurementData';
import { indiaAdministrativeDirectory } from '../../data/indiaAdministrativeDirectory';

const STORAGE_KEY = 'kisansetu_mandis';

const DEFAULT_CROPS = [
  'Wheat (गेहूं)',
  'Basmati Paddy (धान)',
  'Common Paddy / Rice (धान साधारण)',
  'Mustard (सरसों / राई)',
  'Cotton (कपास)',
  'Groundnut (मूंगफली)',
  'Soybean (सोयाबीन)',
  'Maize (मक्का)',
  'Gram / Chana (चना देसी)',
  'Coconut'
];

export default function AdminMandis({ mandis: propMandis, onUpdateMandi, onNotify }) {
  // Initialize from localStorage falling back to propMandis or configuredMandis
  const [mandisList, setMandisList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return propMandis && propMandis.length > 0 ? propMandis : configuredMandis;
  });

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Modal states: Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMandi, setEditingMandi] = useState(null); // null if adding new

  // Delete confirmation dialog
  const [mandiToDelete, setMandiToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    hindiName: '',
    state: '',
    district: '',
    taluk: '',
    totalBays: 4,
    openBays: 3,
    dailyCapacityTrolleys: 400,
    currentQueueCount: 0,
    avgWaitMinutes: 20,
    procuringCrops: ['Wheat (गेहूं)'],
    agency: 'Food Corporation of India (FCI) / State Agency',
    status: 'OPERATIONAL'
  });

  // Custom crop input in modal
  const [newCropInput, setNewCropInput] = useState('');

  // Synchronize storage and notify parent
  const persistMandis = (newList) => {
    setMandisList(newList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch {
      // storage error
    }
    if (onUpdateMandi) {
      onUpdateMandi(newList);
    }
  };

  // Top Stats calculations
  const stats = useMemo(() => {
    const total = mandisList.length;
    const operational = mandisList.filter((m) => m.status === 'OPERATIONAL').length;
    const congested = mandisList.filter((m) => m.status === 'CONGESTED').length;
    const maintenance = mandisList.filter((m) => m.status === 'MAINTENANCE').length;
    const totalBayCapacity = mandisList.reduce((acc, m) => acc + (Number(m.totalBays) || 0), 0);
    const totalDailyCapacity = mandisList.reduce((acc, m) => acc + (Number(m.dailyCapacityTrolleys) || 0), 0);

    return {
      total,
      operational,
      congested,
      maintenance,
      totalBayCapacity,
      totalDailyCapacity
    };
  }, [mandisList]);

  // Unique States present in mandis for filter dropdown
  const statesInList = useMemo(() => {
    const s = new Set(mandisList.map((m) => m.state).filter(Boolean));
    return Array.from(s).sort();
  }, [mandisList]);

  // Filtered Mandis
  const filteredMandis = useMemo(() => {
    return mandisList.filter((m) => {
      const matchesSearch = 
        m.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        (m.district && m.district.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
        (m.hindiName && m.hindiName.includes(searchTerm.trim()));
      
      const matchesState = filterState === 'ALL' || m.state === filterState;
      const matchesStatus = filterStatus === 'ALL' || m.status === filterStatus;

      return matchesSearch && matchesState && matchesStatus;
    });
  }, [mandisList, searchTerm, filterState, filterStatus]);

  // Modal: Open for Add
  const handleOpenAddModal = () => {
    const firstState = Object.keys(indiaAdministrativeDirectory)[0] || 'Punjab';
    const firstDist = Object.keys(indiaAdministrativeDirectory[firstState] || {})[0] || '';
    const firstTaluk = (indiaAdministrativeDirectory[firstState]?.[firstDist] || [])[0] || '';

    setEditingMandi(null);
    setFormData({
      name: '',
      hindiName: '',
      state: firstState,
      district: firstDist,
      taluk: firstTaluk,
      totalBays: 4,
      openBays: 4,
      dailyCapacityTrolleys: 450,
      currentQueueCount: 0,
      avgWaitMinutes: 15,
      procuringCrops: ['Wheat (गेहूं)'],
      agency: 'FCI / State Civil Supplies',
      status: 'OPERATIONAL'
    });
    setNewCropInput('');
    setIsModalOpen(true);
  };

  // Modal: Open for Edit
  const handleOpenEditModal = (mandi) => {
    setEditingMandi(mandi);
    setFormData({
      name: mandi.name || '',
      hindiName: mandi.hindiName || '',
      state: mandi.state || '',
      district: mandi.district || '',
      taluk: mandi.taluk || '',
      totalBays: mandi.totalBays ?? 3,
      openBays: mandi.openBays ?? 2,
      dailyCapacityTrolleys: mandi.dailyCapacityTrolleys ?? 400,
      currentQueueCount: mandi.currentQueueCount ?? 0,
      avgWaitMinutes: mandi.avgWaitMinutes ?? 20,
      procuringCrops: Array.isArray(mandi.procuringCrops) ? [...mandi.procuringCrops] : [],
      agency: mandi.agency || '',
      status: mandi.status || 'OPERATIONAL'
    });
    setNewCropInput('');
    setIsModalOpen(true);
  };

  // Modal: Cascading Form Handlers
  const handleFormStateChange = (st) => {
    const dists = Object.keys(indiaAdministrativeDirectory[st] || {});
    const firstDist = dists[0] || '';
    const taluks = indiaAdministrativeDirectory[st]?.[firstDist] || [];
    const firstTaluk = taluks[0] || '';

    setFormData((prev) => ({
      ...prev,
      state: st,
      district: firstDist,
      taluk: firstTaluk
    }));
  };

  const handleFormDistrictChange = (dist) => {
    const taluks = indiaAdministrativeDirectory[formData.state]?.[dist] || [];
    const firstTaluk = taluks[0] || '';

    setFormData((prev) => ({
      ...prev,
      district: dist,
      taluk: firstTaluk
    }));
  };

  // Toggle crop in procuring crops
  const handleToggleCrop = (cropName) => {
    setFormData((prev) => {
      const exists = prev.procuringCrops.includes(cropName);
      if (exists) {
        return {
          ...prev,
          procuringCrops: prev.procuringCrops.filter((c) => c !== cropName)
        };
      } else {
        return {
          ...prev,
          procuringCrops: [...prev.procuringCrops, cropName]
        };
      }
    });
  };

  const handleAddCustomCrop = () => {
    const trimmed = newCropInput.trim();
    if (!trimmed) return;
    if (!formData.procuringCrops.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        procuringCrops: [...prev.procuringCrops, trimmed]
      }));
    }
    setNewCropInput('');
  };

  // Form Submit
  const handleSaveMandi = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a mandi name');
      return;
    }

    if (editingMandi) {
      // Update existing
      const updated = mandisList.map((m) => {
        if (m.id === editingMandi.id) {
          return {
            ...m,
            ...formData,
            totalBays: Number(formData.totalBays),
            openBays: Number(formData.openBays),
            dailyCapacityTrolleys: Number(formData.dailyCapacityTrolleys),
            currentQueueCount: Number(formData.currentQueueCount),
            avgWaitMinutes: Number(formData.avgWaitMinutes)
          };
        }
        return m;
      });
      persistMandis(updated);
      if (onNotify) onNotify(`✓ Mandi "${formData.name}" updated successfully!`);
    } else {
      // Add new
      const newMandi = {
        id: `mandi-${Date.now()}`,
        ...formData,
        totalBays: Number(formData.totalBays),
        openBays: Number(formData.openBays),
        dailyCapacityTrolleys: Number(formData.dailyCapacityTrolleys),
        currentQueueCount: Number(formData.currentQueueCount),
        avgWaitMinutes: Number(formData.avgWaitMinutes)
      };
      const updated = [newMandi, ...mandisList];
      persistMandis(updated);
      if (onNotify) onNotify(`✓ New Mandi "${formData.name}" registered successfully!`);
    }

    setIsModalOpen(false);
  };

  // Delete Action
  const handleConfirmDelete = () => {
    if (!mandiToDelete) return;
    const updated = mandisList.filter((m) => m.id !== mandiToDelete.id);
    persistMandis(updated);
    if (onNotify) onNotify(`🗑️ Mandi "${mandiToDelete.name}" removed from registry.`);
    setMandiToDelete(null);
  };

  // Render status badge helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'OPERATIONAL':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.74rem',
            fontWeight: 800,
            background: '#dcfce7',
            color: '#15803d',
            border: '1px solid #bbf7d0'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16a34a' }} />
            OPERATIONAL
          </span>
        );
      case 'CONGESTED':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.74rem',
            fontWeight: 800,
            background: '#fee2e2',
            color: '#b91c1c',
            border: '1px solid #fecaca'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ef4444' }} />
            CONGESTED
          </span>
        );
      case 'MAINTENANCE':
      default:
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.74rem',
            fontWeight: 800,
            background: '#fef3c7',
            color: '#b45309',
            border: '1px solid #fde68a'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f59e0b' }} />
            MAINTENANCE
          </span>
        );
    }
  };

  return (
    <div className="admin-page-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Title & Add Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building2 style={{ color: '#16a34a' }} size={28} />
            APMC Mandi & Procurement Yard Registry
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
            Configure APMC grain yards, operational bay capacity, daily intake quotas, and procuring commodity agencies.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#16a34a',
            color: '#ffffff',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)'
          }}
        >
          <Plus size={18} />
          Register New Mandi
        </button>
      </div>

      {/* Stats Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        {/* Total Mandis */}
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
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: '#e0f2fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0369a1'
          }}>
            <Building2 size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Total APMC Mandis
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {stats.total}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 600, marginTop: '2px' }}>
              Across {statesInList.length} States
            </div>
          </div>
        </div>

        {/* Operational */}
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
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: '#dcfce7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#15803d'
          }}>
            <CheckCircle2 size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Operational
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#15803d', lineHeight: 1.1 }}>
              {stats.operational}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600, marginTop: '2px' }}>
              Normal Flow Active
            </div>
          </div>
        </div>

        {/* Congested */}
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
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: '#fee2e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#b91c1c'
          }}>
            <AlertTriangle size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Congested / High Load
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#b91c1c', lineHeight: 1.1 }}>
              {stats.congested}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 600, marginTop: '2px' }}>
              Buffer Yard Alert Active
            </div>
          </div>
        </div>

        {/* Bay Capacity */}
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
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: '#fef3c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#b45309'
          }}>
            <Layers size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Total Bay Capacity
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {stats.totalBayCapacity} Bays
            </div>
            <div style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 600, marginTop: '2px' }}>
              {stats.totalDailyCapacity.toLocaleString()} trolleys/day cap
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        background: '#ffffff',
        borderRadius: '14px',
        padding: '18px 22px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search mandi by name, district, or town..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.88rem',
              outline: 'none',
              backgroundColor: '#f8fafc',
              color: '#0f172a'
            }}
          />
        </div>

        {/* Filter by State */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={15} style={{ color: '#64748b' }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>State:</span>
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            style={{
              padding: '9px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#0f172a',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All States ({statesInList.length})</option>
            {statesInList.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '9px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#0f172a',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="OPERATIONAL">OPERATIONAL</option>
            <option value="CONGESTED">CONGESTED</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
          </select>
        </div>
      </div>

      {/* Mandis Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '22px' }}>
        {filteredMandis.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            padding: '50px 20px',
            textAlign: 'center',
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px dashed #cbd5e1'
          }}>
            <Building2 size={40} style={{ color: '#94a3b8', margin: '0 auto 12px' }} />
            <h4 style={{ margin: '0 0 6px', color: '#1e293b' }}>No APMC Mandis match your filter</h4>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>
              Try adjusting your search criteria or register a new Mandi above.
            </p>
          </div>
        ) : (
          filteredMandis.map((mandi) => {
            const openBays = mandi.openBays ?? mandi.totalBays;
            const utilizationPercent = mandi.totalBays > 0 ? Math.round(((mandi.totalBays - openBays) / mandi.totalBays) * 100) : 0;

            return (
              <div
                key={mandi.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                {/* Card Top Banner */}
                <div style={{
                  padding: '18px 20px',
                  borderBottom: '1px solid #f1f5f9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: '#f1f5f9',
                        color: '#475569'
                      }}>
                        {mandi.agency || 'APMC Yard'}
                      </span>
                    </div>

                    <h3 style={{
                      margin: '0 0 4px',
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      lineHeight: 1.3
                    }}>
                      {mandi.name}
                    </h3>

                    {mandi.hindiName && (
                      <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic', marginBottom: '4px' }}>
                        {mandi.hindiName}
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', color: '#15803d', fontWeight: 600 }}>
                      <MapPin size={13} />
                      <span>{mandi.taluk ? `${mandi.taluk}, ` : ''}{mandi.district}, {mandi.state}</span>
                    </div>
                  </div>

                  {renderStatusBadge(mandi.status)}
                </div>

                {/* Card Body Metrics */}
                <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Grid of 4 Key Stats */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '12px',
                    background: '#f8fafc',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #f1f5f9'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                        Weighbridge Bays
                      </div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                        <span style={{ color: '#15803d' }}>{openBays}</span> / {mandi.totalBays} Open
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                        Daily Capacity
                      </div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                        {mandi.dailyCapacityTrolleys} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b' }}>trolleys</span>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                        Queue In Yard
                      </div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: mandi.currentQueueCount > 30 ? '#dc2626' : '#0f172a', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Truck size={14} />
                        {mandi.currentQueueCount} Active
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                        Avg Wait Time
                      </div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: mandi.avgWaitMinutes > 25 ? '#d97706' : '#15803d', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} />
                        {mandi.avgWaitMinutes} mins
                      </div>
                    </div>
                  </div>

                  {/* Procuring Crops Chips */}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Procuring Commodities ({mandi.procuringCrops?.length || 0}):
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {(mandi.procuringCrops || []).map((crop) => (
                        <span
                          key={crop}
                          style={{
                            background: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            color: '#166534',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '6px'
                          }}
                        >
                          🌾 {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div style={{
                  padding: '12px 20px',
                  background: '#f8fafc',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    ID: <code>{mandi.id}</code>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleOpenEditModal(mandi)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        color: '#334155',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <Edit3 size={13} />
                      Edit
                    </button>

                    <button
                      onClick={() => setMandiToDelete(mandi)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #fecaca',
                        background: '#fef2f2',
                        color: '#b91c1c',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Mandi Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '18px',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 26px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f8fafc'
            }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  {editingMandi ? 'Edit APMC Mandi Details' : 'Register New APMC Mandi'}
                </h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                  Provide geographic location, operational capacity, and agency assignments.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form Scrollable */}
            <form onSubmit={handleSaveMandi} style={{ padding: '24px 26px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Name & Hindi Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                    Mandi Name (English) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Khanna Central Grain Market"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                    Hindi / Regional Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. खन्ना केंद्रीय अनाज मंडी"
                    value={formData.hindiName}
                    onChange={(e) => setFormData({ ...formData, hindiName: e.target.value })}
                    style={{
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Cascading State, District, Taluk */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                {/* State */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                    State / UT <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleFormStateChange(e.target.value)}
                    style={{
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.88rem',
                      backgroundColor: '#ffffff',
                      outline: 'none',
                      fontWeight: 600
                    }}
                  >
                    {Object.keys(indiaAdministrativeDirectory).sort().map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                    District <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => handleFormDistrictChange(e.target.value)}
                    style={{
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.88rem',
                      backgroundColor: '#ffffff',
                      outline: 'none',
                      fontWeight: 600
                    }}
                  >
                    {Object.keys(indiaAdministrativeDirectory[formData.state] || {}).sort().map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Taluk */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                    Taluk / Tehsil
                  </label>
                  <select
                    value={formData.taluk}
                    onChange={(e) => setFormData({ ...formData, taluk: e.target.value })}
                    style={{
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.88rem',
                      backgroundColor: '#ffffff',
                      outline: 'none',
                      fontWeight: 600
                    }}
                  >
                    {(indiaAdministrativeDirectory[formData.state]?.[formData.district] || []).map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Bays and Capacities */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                    Total Bays
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.totalBays}
                    onChange={(e) => setFormData({ ...formData, totalBays: e.target.value })}
                    style={{
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                    Open Bays
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={formData.totalBays}
                    value={formData.openBays}
                    onChange={(e) => setFormData({ ...formData, openBays: e.target.value })}
                    style={{
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                    Daily Trolleys
                  </label>
                  <input
                    type="number"
                    min="50"
                    step="50"
                    value={formData.dailyCapacityTrolleys}
                    onChange={(e) => setFormData({ ...formData, dailyCapacityTrolleys: e.target.value })}
                    style={{
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                    Status <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.88rem',
                      backgroundColor: '#ffffff',
                      outline: 'none',
                      fontWeight: 700
                    }}
                  >
                    <option value="OPERATIONAL">OPERATIONAL</option>
                    <option value="CONGESTED">CONGESTED</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                  </select>
                </div>
              </div>

              {/* Agency Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                  Procurement Agency / Authority
                </label>
                <input
                  type="text"
                  placeholder="e.g. PUNGRAIN / FCI, NAFED, HAFED, CCI"
                  value={formData.agency}
                  onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Multi-Select Procuring Crops */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                  Procuring Crops (Click chips to toggle multi-select)
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '120px', overflowY: 'auto', padding: '4px' }}>
                  {DEFAULT_CROPS.map((crop) => {
                    const isSelected = formData.procuringCrops.includes(crop);
                    return (
                      <button
                        type="button"
                        key={crop}
                        onClick={() => handleToggleCrop(crop)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '20px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          border: isSelected ? '1.5px solid #16a34a' : '1px solid #cbd5e1',
                          background: isSelected ? '#dcfce7' : '#f8fafc',
                          color: isSelected ? '#15803d' : '#475569',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {crop}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Crop row */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <input
                    type="text"
                    placeholder="Add other commodity (e.g. Turmeric, Jowar)..."
                    value={newCropInput}
                    onChange={(e) => setNewCropInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '7px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.82rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomCrop}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '6px',
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      color: '#334155',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Add Crop
                  </button>
                </div>
              </div>

              {/* Modal Actions */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '12px',
                paddingTop: '16px',
                borderTop: '1px solid #e2e8f0'
              }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '9px 22px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#16a34a',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)'
                  }}
                >
                  <Save size={15} />
                  {editingMandi ? 'Save Changes' : 'Register Mandi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {mandiToDelete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            maxWidth: '460px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Trash2 size={22} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>Confirm Mandi Deletion</h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>This action cannot be undone.</p>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
              Are you sure you want to remove <b>{mandiToDelete.name}</b> located in <b>{mandiToDelete.district}, {mandiToDelete.state}</b> from the active APMC registry?
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button
                onClick={() => setMandiToDelete(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#dc2626',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Delete Mandi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
