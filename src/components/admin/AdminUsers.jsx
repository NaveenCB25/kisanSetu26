import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  UserCheck,
  UserPlus,
  ShieldCheck,
  Scale,
  User,
  Search,
  Filter,
  Edit2,
  Trash2,
  Clock,
  History,
  AlertTriangle,
  X,
  Check,
  Calendar,
  Lock,
  Mail,
  Phone,
  RefreshCw,
  ShieldAlert
} from 'lucide-react';
import {
  getAllUsers,
  registerUser,
  updateUser,
  deleteUser,
  getActivityLogs
} from '../../data/authData';

export default function AdminUsers({ currentUser, onNotify }) {
  // Navigation tabs: 'users' | 'logs'
  const [activeTab, setActiveTab] = useState('users');

  // Users state
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Form state for Add User
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'farmer',
    status: 'Active'
  });

  // Form state for Edit User
  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    role: 'farmer',
    status: 'Active'
  });

  // Activity Logs state
  const [logs, setLogs] = useState([]);
  const [logSearch, setLogSearch] = useState('');
  const [logStartDate, setLogStartDate] = useState('');
  const [logEndDate, setLogEndDate] = useState('');

  // Initial load
  const refreshUsersList = () => {
    const list = getAllUsers();
    setUsers(list);
  };

  const refreshLogsList = () => {
    const logList = getActivityLogs();
    setLogs(logList);
  };

  useEffect(() => {
    refreshUsersList();
    refreshLogsList();
  }, []);

  // Summary counts
  const roleStats = useMemo(() => {
    let adminCount = 0;
    let staffCount = 0;
    let farmerCount = 0;
    let activeCount = 0;

    users.forEach((u) => {
      if (u.role === 'admin') adminCount++;
      else if (u.role === 'staff') staffCount++;
      else if (u.role === 'farmer') farmerCount++;

      if (u.status === 'Active') activeCount++;
    });

    return {
      adminCount,
      staffCount,
      farmerCount,
      totalCount: users.length,
      activeCount
    };
  }, [users]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.phone && u.phone.toLowerCase().includes(q));

      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      const matchStatus = statusFilter === 'all' || u.status === statusFilter;

      return matchQuery && matchRole && matchStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Filtered Activity Logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const q = logSearch.toLowerCase().trim();
      const matchText =
        !q ||
        (log.action && log.action.toLowerCase().includes(q)) ||
        (log.user && log.user.toLowerCase().includes(q)) ||
        (log.role && log.role.toLowerCase().includes(q));

      let matchDate = true;
      if (logStartDate) {
        matchDate = matchDate && log.timestamp >= logStartDate;
      }
      if (logEndDate) {
        matchDate = matchDate && log.timestamp <= logEndDate + ' 23:59:59';
      }

      return matchText && matchDate;
    });
  }, [logs, logSearch, logStartDate, logEndDate]);

  // Handlers for Add User
  const handleOpenAddModal = () => {
    setAddForm({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'farmer',
      status: 'Active'
    });
    setShowAddModal(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!addForm.name || !addForm.phone) {
      if (onNotify) onNotify('Please enter a valid user name and phone number.');
      return;
    }

    const currentActorName = currentUser?.name || 'Administrator';
    registerUser(addForm, currentActorName);
    refreshUsersList();
    refreshLogsList();
    setShowAddModal(false);

    if (onNotify) {
      onNotify(`✓ User "${addForm.name}" created successfully as [${addForm.role.toUpperCase()}]!`);
    }
  };

  // Handlers for Edit User
  const handleOpenEditModal = (user) => {
    setUserToEdit(user);
    setEditForm({
      id: user.id,
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'farmer',
      status: user.status || 'Active'
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editForm.id) return;

    const currentActorName = currentUser?.name || 'Administrator';
    updateUser(editForm.id, {
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      role: editForm.role,
      status: editForm.status
    }, currentActorName);

    refreshUsersList();
    refreshLogsList();
    setShowEditModal(false);

    if (onNotify) {
      onNotify(`✓ User profile "${editForm.name}" updated successfully.`);
    }
  };

  // Handlers for Delete User
  const handleOpenDeleteModal = (user) => {
    // Check if user is self
    const isSelf = currentUser && (currentUser.id === user.id || (currentUser.email && currentUser.email === user.email));
    if (isSelf) {
      if (onNotify) {
        onNotify('⚠️ You cannot delete your currently authenticated administrator account!');
      }
      return;
    }
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    const currentActorName = currentUser?.name || 'Administrator';

    deleteUser(userToDelete.id, currentActorName);
    refreshUsersList();
    refreshLogsList();
    setShowDeleteModal(false);

    if (onNotify) {
      onNotify(`✓ User "${userToDelete.name}" deleted from system.`);
    }
  };

  return (
    <div className="admin-users-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-title">
            <Users className="title-icon text-green-700" size={26} />
            User & Role Management
          </h2>
          <p className="admin-subtitle">
            Configure role-based access control, APMC staff operators, registered farmers, and audit activity logs.
          </p>
        </div>

        <div className="admin-header-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleOpenAddModal}
          >
            <UserPlus size={16} />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* Role Summary KPI Cards */}
      <div className="report-kpi-grid mb-6">
        <div className="kpi-card">
          <div className="kpi-icon-wrap bg-slate-100 text-slate-800">
            <ShieldCheck size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Administrators</span>
            <span className="kpi-value">{roleStats.adminCount}</span>
            <span className="kpi-subtext">Full District Access</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap bg-blue-50 text-blue-700">
            <Scale size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Mandi Staff Operators</span>
            <span className="kpi-value">{roleStats.staffCount}</span>
            <span className="kpi-subtext">Gate, Weighing & Slip</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap bg-green-50 text-green-700">
            <User size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Registered Farmers</span>
            <span className="kpi-value">{roleStats.farmerCount}</span>
            <span className="kpi-subtext">Kisan Verified Accounts</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap bg-emerald-50 text-emerald-800">
            <UserCheck size={22} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Total Active Users</span>
            <span className="kpi-value">{roleStats.activeCount} <small className="text-gray-500">/ {roleStats.totalCount}</small></span>
            <span className="kpi-subtext">Verified Profiles</span>
          </div>
        </div>
      </div>

      {/* Main Content Tabs (Users vs Activity Logs) */}
      <div className="reports-control-panel card">
        <div className="report-categories-tabs">
          <button
            type="button"
            className={`category-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={17} />
            <span>User Directory ({users.length})</span>
          </button>
          <button
            type="button"
            className={`category-tab ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            <History size={17} />
            <span>Activity Audit Logs ({logs.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="card report-section-card mt-4">
          {/* Filter Bar */}
          <div className="users-filter-bar">
            {/* Search Input */}
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Role Filter */}
            <div className="filter-dropdown-wrap">
              <label className="filter-lbl">Role:</label>
              <select
                className="select-input"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Administrators</option>
                <option value="staff">Mandi Staff</option>
                <option value="farmer">Farmers</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="filter-dropdown-wrap">
              <label className="filter-lbl">Status:</label>
              <select
                className="select-input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-icon-only"
              onClick={refreshUsersList}
              title="Refresh list"
            >
              <RefreshCw size={15} />
            </button>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Contact Details</th>
                  <th>Assigned Role</th>
                  <th>Account Status</th>
                  <th>Created Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No users match the search filters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const isSelf = currentUser && (currentUser.id === user.id || currentUser.email === user.email);

                    return (
                      <tr key={user.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className={`user-avatar-badge role-${user.role}`}>
                              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 flex items-center gap-2">
                                <span>{user.name}</span>
                                {isSelf && (
                                  <span className="badge badge-self">Current User</span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">{user.designation || 'System User'}</div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="contact-details-cell">
                            {user.email && (
                              <div className="contact-item">
                                <Mail size={13} className="text-gray-400" />
                                <span>{user.email}</span>
                              </div>
                            )}
                            {user.phone && (
                              <div className="contact-item">
                                <Phone size={13} className="text-gray-400" />
                                <span>{user.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        <td>
                          <span className={`role-badge role-${user.role}`}>
                            {user.role === 'admin' && <ShieldCheck size={13} />}
                            {user.role === 'staff' && <Scale size={13} />}
                            {user.role === 'farmer' && <User size={13} />}
                            <span>{user.role ? user.role.toUpperCase() : 'FARMER'}</span>
                          </span>
                        </td>

                        <td>
                          <span className={`status-badge ${user.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                            {user.status === 'Active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        <td className="text-gray-600 font-mono text-xs">
                          {user.createdAt || '2026-09-01'}
                        </td>

                        <td className="text-right">
                          <div className="action-buttons-group justify-end">
                            <button
                              type="button"
                              className="btn-action btn-edit"
                              onClick={() => handleOpenEditModal(user)}
                              title="Edit user"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              type="button"
                              className={`btn-action btn-delete ${isSelf ? 'opacity-30 cursor-not-allowed' : ''}`}
                              onClick={() => handleOpenDeleteModal(user)}
                              disabled={isSelf}
                              title={isSelf ? 'Cannot delete your own account' : 'Delete user'}
                            >
                              <Trash2 size={15} />
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
        </div>
      )}

      {/* TAB 2: ACTIVITY LOGS */}
      {activeTab === 'logs' && (
        <div className="card report-section-card mt-4">
          <div className="section-card-header">
            <div>
              <h3 className="section-title">Audit Trail & Security Timeline</h3>
              <p className="section-desc">Immutable history of administrative actions, weighbridge tickets, and master changes</p>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={refreshLogsList}
            >
              <RefreshCw size={14} />
              <span>Refresh Logs</span>
            </button>
          </div>

          {/* Log Filters */}
          <div className="users-filter-bar mb-4">
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Filter logs by action keyword or user..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
              />
              {logSearch && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setLogSearch('')}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="date-inputs">
              <div className="input-with-icon">
                <Calendar size={14} className="input-icon" />
                <input
                  type="date"
                  className="date-input"
                  value={logStartDate}
                  onChange={(e) => setLogStartDate(e.target.value)}
                  placeholder="From Date"
                />
              </div>
              <span className="date-sep">to</span>
              <div className="input-with-icon">
                <Calendar size={14} className="input-icon" />
                <input
                  type="date"
                  className="date-input"
                  value={logEndDate}
                  onChange={(e) => setLogEndDate(e.target.value)}
                  placeholder="To Date"
                />
              </div>
            </div>
          </div>

          {/* Timeline List */}
          <div className="activity-timeline">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No activity logs match the selected filter parameters.
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="timeline-item">
                  <div className={`timeline-icon-dot role-${log.role || 'admin'}`}>
                    <Clock size={14} />
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="timeline-action">{log.action}</span>
                      <span className="timeline-time">{log.timestamp}</span>
                    </div>
                    <div className="timeline-user">
                      <span>Performed by:</span>
                      <b>{log.user}</b>
                      <span className={`role-badge-mini role-${log.role || 'admin'}`}>
                        {log.role ? log.role.toUpperCase() : 'ADMIN'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD USER */}
      {showAddModal && (
        <div className="modal-overlay" role="presentation" onMouseDown={() => setShowAddModal(false)}>
          <div
            className="modal-content auth-modal animate-fade"
            role="dialog"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-header-title">
                <UserPlus size={22} className="modal-icon-green" />
                <div>
                  <h3>Add New User</h3>
                  <p>Register an admin, APMC staff member, or farmer</p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowAddModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="modal-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sardar Baldev Singh"
                  required
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+91 98765 43210"
                    required
                    value={addForm.phone}
                    onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="user@kisansetu.gov.in"
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Temporary Password *</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Set initial login password"
                  required
                  value={addForm.password}
                  onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Assigned System Role *</label>
                  <select
                    className="form-input"
                    value={addForm.role}
                    onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                  >
                    <option value="farmer">Farmer (Portal Access)</option>
                    <option value="staff">Staff (Mandi Weighbridge Operator)</option>
                    <option value="admin">Administrator (Full Control)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    className="form-input"
                    value={addForm.status}
                    onChange={(e) => setAddForm({ ...addForm, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions-bar">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT USER */}
      {showEditModal && userToEdit && (
        <div className="modal-overlay" role="presentation" onMouseDown={() => setShowEditModal(false)}>
          <div
            className="modal-content auth-modal animate-fade"
            role="dialog"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-header-title">
                <Edit2 size={22} className="modal-icon-green" />
                <div>
                  <h3>Edit User Account</h3>
                  <p>Modify role permissions and user status</p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowEditModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="modal-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Role</label>
                  <select
                    className="form-input"
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  >
                    <option value="farmer">Farmer</option>
                    <option value="staff">Staff Operator</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    className="form-input"
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions-bar">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {showDeleteModal && userToDelete && (
        <div className="modal-overlay" role="presentation" onMouseDown={() => setShowDeleteModal(false)}>
          <div
            className="modal-content auth-modal animate-fade"
            role="dialog"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-header-title">
                <AlertTriangle size={24} className="text-red-600" />
                <div>
                  <h3 className="text-red-700">Confirm Deletion</h3>
                  <p>Permanent action: removing access credentials</p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 text-gray-700 space-y-3">
              <p>
                Are you sure you want to permanently delete user account:
              </p>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="font-bold text-red-900">{userToDelete.name}</div>
                <div className="text-xs text-red-700">{userToDelete.email || userToDelete.phone} • Role: [{userToDelete.role.toUpperCase()}]</div>
              </div>
              <p className="text-xs text-gray-500">
                This user will no longer be able to sign in or perform queue operations. All past weighed slips will remain associated in logs.
              </p>
            </div>

            <div className="modal-actions-bar">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmDelete}
              >
                <Trash2 size={16} />
                <span>Permanently Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
