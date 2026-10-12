import React, { useMemo, useState } from 'react';
import { Bell, Check, Save, Wheat } from 'lucide-react';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminLocations from './admin/AdminLocations';
import AdminMandis from './admin/AdminMandis';
import AdminProcurement from './admin/AdminProcurement';
import AdminReports from './admin/AdminReports';
import AdminUsers from './admin/AdminUsers';
import { configuredMandis } from '../data/procurementData';
import { initialUsers } from '../data/authData';

function CropSettings({ mspRates, onUpdateMSP, onNotify }) {
  const [rates, setRates] = useState(() => mspRates.map((rate) => ({ ...rate })));

  const updateRate = (index, field, value) => {
    setRates((current) => current.map((rate, i) => i === index ? { ...rate, [field]: field === 'mspRate' || field === 'dailyQuotaPerFarmerQtl' ? Number(value) : value } : rate));
  };

  const save = () => {
    onUpdateMSP?.(rates);
    onNotify?.('MSP rates and farmer quantity limits have been saved.');
  };

  return (
    <section className="admin-settings-page">
      <div className="admin-proc-header">
        <div className="admin-proc-header-titles">
          <div className="admin-proc-icon-title"><Wheat size={22} /><span>Crops & MSP Settings</span></div>
          <p className="admin-proc-subtitle">Manage crop support prices, FAQ quality limits, agencies and per-farmer daily caps.</p>
        </div>
        <button type="button" className="btn-proc-header btn-proc-export" onClick={save}><Save size={16} /> Save changes</button>
      </div>
      <div className="admin-proc-table-card admin-settings-table-wrap">
        <div className="admin-proc-table-responsive"><table className="admin-proc-table">
          <thead><tr><th>Crop</th><th>MSP / Quintal</th><th>Season</th><th>Quality threshold</th><th>Agency</th><th>Daily cap (Qtl)</th></tr></thead>
          <tbody>{rates.map((rate, index) => <tr key={rate.id || rate.crop}>
            <td className="font-semibold">{rate.crop}</td>
            <td><input className="admin-inline-input" type="number" min="0" value={rate.mspRate ?? ''} onChange={(e) => updateRate(index, 'mspRate', e.target.value)} /></td>
            <td><input className="admin-inline-input" value={rate.season ?? ''} onChange={(e) => updateRate(index, 'season', e.target.value)} /></td>
            <td><input className="admin-inline-input" value={rate.faqToleranceMoisture ?? ''} onChange={(e) => updateRate(index, 'faqToleranceMoisture', e.target.value)} /></td>
            <td><input className="admin-inline-input" value={rate.procurementAgency ?? ''} onChange={(e) => updateRate(index, 'procurementAgency', e.target.value)} /></td>
            <td><input className="admin-inline-input" type="number" min="0" value={rate.dailyQuotaPerFarmerQtl ?? ''} onChange={(e) => updateRate(index, 'dailyQuotaPerFarmerQtl', e.target.value)} /></td>
          </tr>)}</tbody>
        </table></div>
      </div>
    </section>
  );
}

function Settings({ onNotify }) {
  const [alerts, setAlerts] = useState({ booking: true, quality: true, payment: true });
  return <section className="admin-settings-page">
    <div className="admin-proc-header"><div className="admin-proc-header-titles"><div className="admin-proc-icon-title"><Bell size={22} /><span>Notification Settings</span></div><p className="admin-proc-subtitle">Choose operational events that should raise an in-app notification.</p></div></div>
    <div className="admin-settings-card">{Object.entries({ booking: 'Booking approvals and slot changes', quality: 'Quality-check exceptions and rejections', payment: 'Payment status and settlement updates' }).map(([key, label]) => <label className="admin-toggle-row" key={key}><span>{label}</span><input type="checkbox" checked={alerts[key]} onChange={(e) => setAlerts({ ...alerts, [key]: e.target.checked })} /></label>)}<button type="button" className="btn-proc-primary" onClick={() => onNotify?.('Notification preferences saved.')}><Check size={16} /> Save preferences</button></div>
  </section>;
}

export default function DistrictAdmin({ tokens = [], receipts = [], mspRates = [], onUpdateMSP, onUpdateToken, onUpdateReceipt, onNotify, onLogout }) {
  const [page, setPage] = useState('dashboard');
  const [mandis, setMandis] = useState(configuredMandis);
  const currentUser = useMemo(() => initialUsers.find((user) => user.role === 'admin') || initialUsers[0], []);
  const shared = { tokens, receipts, mspRates, mandis };
  let content;
  switch (page) {
    case 'farmers': case 'users': content = <AdminUsers currentUser={currentUser} onNotify={onNotify} />; break;
    case 'locations': content = <AdminLocations onNotify={onNotify} />; break;
    case 'mandis': content = <AdminMandis mandis={mandis} onUpdateMandi={setMandis} onNotify={onNotify} />; break;
    case 'crops': content = <CropSettings mspRates={mspRates} onUpdateMSP={onUpdateMSP} onNotify={onNotify} />; break;
    case 'bookings': case 'procurement': content = <AdminProcurement {...shared} onUpdateToken={onUpdateToken} onUpdateReceipt={onUpdateReceipt} onNotify={onNotify} />; break;
    case 'reports': content = <AdminReports {...shared} />; break;
    case 'settings': content = <Settings onNotify={onNotify} />; break;
    default: content = <AdminDashboard {...shared} />;
  }
  return <AdminLayout currentUser={currentUser} currentPage={page} onNavigate={setPage} onLogout={onLogout}>{content}</AdminLayout>;
}
