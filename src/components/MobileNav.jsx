import React from 'react';
import { Sprout, TrendingUp, ShoppingBag, Stethoscope, CloudSun, Landmark, Tractor } from 'lucide-react';
import { translations } from '../data/translations';

export default function MobileNav({ activeTab, setActiveTab, currentLang }) {
  const t = translations[currentLang] || translations.en;

  const items = [
    { id: 'dashboard', label: 'Home', icon: Sprout },
    { id: 'mandi', label: 'Mandi', icon: TrendingUp },
    { id: 'marketplace', label: 'Bazaar', icon: ShoppingBag },
    { id: 'doctor', label: 'Doctor', icon: Stethoscope },
    { id: 'weather', label: 'Weather', icon: CloudSun }
  ];

  return (
    <nav className="mobile-bottom-nav">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`mobile-tab-btn ${isActive ? 'active' : ''}`}
            aria-label={item.label}
          >
            <div className="tab-icon-wrap">
              <Icon size={20} />
            </div>
            <span className="tab-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
