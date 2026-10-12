import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  MapPin,
  Building2,
  Wheat,
  CalendarDays,
  Scale,
  FileBarChart,
  ShieldCheck,
  Settings2,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  User as UserIcon
} from 'lucide-react';
import { clearSession } from '../../data/authData';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'farmers', label: 'Farmers', icon: Users },
  { id: 'locations', label: 'Locations', icon: MapPin },
  { id: 'mandis', label: 'APMC Mandis', icon: Building2 },
  { id: 'crops', label: 'Crops & MSP', icon: Wheat },
  { id: 'bookings', label: 'Bookings', icon: CalendarDays },
  { id: 'procurement', label: 'Procurement', icon: Scale },
  { id: 'reports', label: 'Reports', icon: FileBarChart },
  { id: 'users', label: 'User Roles', icon: ShieldCheck },
  { id: 'settings', label: 'Settings', icon: Settings2 }
];

export default function AdminLayout({
  currentUser,
  currentPage = 'dashboard',
  onNavigate,
  onLogout,
  children
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    clearSession();
    if (onLogout) {
      onLogout();
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const activeItem = NAV_ITEMS.find((item) => item.id === currentPage) || NAV_ITEMS[0];

  return (
    <div className={`ks-admin-container ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="ks-admin-mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`ks-admin-sidebar ${isCollapsed ? 'collapsed' : ''} ${
          mobileMenuOpen ? 'mobile-open' : ''
        }`}
      >
        {/* Brand header */}
        <div className="ks-sidebar-header">
          <div className="ks-sidebar-brand" onClick={() => onNavigate && onNavigate('dashboard')}>
            <div className="ks-sidebar-logo-icon">
              <Wheat size={22} color="#ffffff" />
            </div>
            {!isCollapsed && (
              <div className="ks-sidebar-brand-text">
                <span className="ks-brand-title">KisanSetu</span>
                <span className="ks-brand-subtitle">Admin Panel</span>
              </div>
            )}
          </div>
          <button
            type="button"
            className="ks-sidebar-collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          <button
            type="button"
            className="ks-sidebar-mobile-close"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="ks-sidebar-nav">
          <ul className="ks-nav-list">
            {NAV_ITEMS.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentPage === item.id;
              return (
                <li key={item.id} className="ks-nav-item">
                  <button
                    type="button"
                    className={`ks-nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      if (onNavigate) onNavigate(item.id);
                      setMobileMenuOpen(false);
                    }}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <IconComponent className="ks-nav-icon" size={20} />
                    {!isCollapsed && <span className="ks-nav-label">{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info & Logout footer */}
        <div className="ks-sidebar-footer">
          <div className="ks-sidebar-user">
            <div className="ks-user-avatar" title={currentUser?.name || 'User'}>
              {getInitials(currentUser?.name)}
            </div>
            {!isCollapsed && (
              <div className="ks-user-info">
                <div className="ks-user-name" title={currentUser?.name}>
                  {currentUser?.name || 'Administrator'}
                </div>
                <div className="ks-user-badge">
                  <Shield size={11} />
                  <span>{currentUser?.role?.toUpperCase() || 'ADMIN'}</span>
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            className="ks-logout-btn"
            onClick={handleLogout}
            title="Sign Out"
          >
            <LogOut size={18} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="ks-admin-main-wrapper">
        {/* Top Header Bar */}
        <header className="ks-admin-header">
          <div className="ks-header-left">
            <button
              type="button"
              className="ks-mobile-hamburger"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <Menu size={22} />
            </button>
            <h1 className="ks-header-page-title">{activeItem.label}</h1>
          </div>

          <div className="ks-header-center">
            <div className="ks-header-search">
              <Search size={18} className="ks-header-search-icon" />
              <input
                type="text"
                placeholder="Search mandis, farmers, tokens, bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="ks-header-right">
            <button
              type="button"
              className="ks-header-icon-btn"
              title="Notifications"
            >
              <Bell size={20} />
              <span className="ks-notification-indicator" />
            </button>

            <div className="ks-header-profile">
              <div className="ks-header-avatar">
                {getInitials(currentUser?.name)}
              </div>
              <div className="ks-header-user-meta">
                <span className="ks-header-user-name">
                  {currentUser?.name || 'Administrator'}
                </span>
                <span className="ks-header-user-role">
                  {currentUser?.role || 'admin'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="ks-admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
