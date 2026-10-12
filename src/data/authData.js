// KisanSetu Auth & User Management Data Store

const USERS_STORAGE_KEY = 'kisansetu_users';
const LOGS_STORAGE_KEY = 'kisansetu_activity_logs';
const SESSION_STORAGE_KEY = 'kisansetu_session';

export const ROLES = Object.freeze({ ADMIN: 'admin', PROCUREMENT_OFFICER: 'staff', FARMER: 'farmer' });

// Kept as a small store boundary so layout components do not access browser
// storage directly. It is safe when storage is unavailable (private mode/SSR).
export const clearSession = () => {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem('kisansetu_access_token');
  } catch (err) {
    console.warn('Failed to clear session:', err);
  }
};

export const saveSession = (user) => {
  try { localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user)); } catch (err) { console.warn('Failed to save session:', err); }
};

export const getSession = () => {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY));
    return session?.id && session?.role ? session : null;
  } catch { return null; }
};

export const initialUsers = [
  {
    id: 'usr-admin-1',
    name: 'Dr. Ramesh Chandra',
    designation: 'District Agriculture Officer (DAO)',
    email: 'admin@kisansetu.gov.in',
    phone: '+91 98765 00001',
    role: 'admin',
    status: 'Active',
    createdAt: '2026-09-01'
  },
  {
    id: 'usr-staff-1',
    name: 'Rajesh Cheema',
    designation: 'Weighbridge Senior Operator',
    email: 'cheema.staff@punjab.gov.in',
    phone: '+91 98150 12345',
    role: 'staff',
    status: 'Active',
    createdAt: '2026-09-15'
  },
  {
    id: 'usr-staff-2',
    name: 'K. L. Sharma',
    designation: 'APMC Quality Inspector',
    email: 'klsharma@hafed.gov.in',
    phone: '+91 97280 67890',
    role: 'staff',
    status: 'Active',
    createdAt: '2026-09-20'
  },
  {
    id: 'usr-farmer-1',
    name: 'Sardar Baldev Singh',
    designation: 'Registered Progressive Farmer',
    email: 'baldev.singh@gmail.com',
    phone: '+91 98765 43210',
    role: 'farmer',
    status: 'Active',
    createdAt: '2026-10-01'
  },
  {
    id: 'usr-farmer-2',
    name: 'Gurpreet Singh Dhillon',
    designation: 'Kisan Credit Card Holder',
    email: 'gurpreet.dhillon@yahoo.com',
    phone: '+91 98144 56789',
    role: 'farmer',
    status: 'Active',
    createdAt: '2026-10-05'
  },
  {
    id: 'usr-farmer-3',
    name: 'Rameshwar Patil',
    designation: 'Farmer Member - FPO',
    email: 'rameshwar.patil@agrimail.in',
    phone: '+91 94231 87654',
    role: 'farmer',
    status: 'Inactive',
    createdAt: '2026-10-08'
  }
];

export const initialActivityLogs = [
  {
    id: 'act-101',
    timestamp: '2026-10-11 09:30:15',
    action: 'Administrator logged into District Portal',
    user: 'Dr. Ramesh Chandra',
    role: 'admin'
  },
  {
    id: 'act-102',
    timestamp: '2026-10-11 08:52:10',
    action: 'Issued Weighment Slip REC-2026-00841 for 96.0 Qtl Wheat',
    user: 'Rajesh Cheema',
    role: 'staff'
  },
  {
    id: 'act-103',
    timestamp: '2026-10-10 16:30:00',
    action: 'Updated MSP Ceiling Quota for Rabi 2026 crops',
    user: 'Dr. Ramesh Chandra',
    role: 'admin'
  },
  {
    id: 'act-104',
    timestamp: '2026-10-10 11:20:45',
    action: 'Registered new Mandi Weighbridge Operator account',
    user: 'Dr. Ramesh Chandra',
    role: 'admin'
  },
  {
    id: 'act-105',
    timestamp: '2026-10-09 14:15:30',
    action: 'Exported District-wise Procurement Summary (CSV)',
    user: 'Dr. Ramesh Chandra',
    role: 'admin'
  },
  {
    id: 'act-106',
    timestamp: '2026-10-08 17:05:12',
    action: 'Modified user account status for Rameshwar Patil to Inactive',
    user: 'Dr. Ramesh Chandra',
    role: 'admin'
  }
];

// Helper to get all users
export const getAllUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read users from localStorage:', err);
  }
  // Initialize with initialUsers
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
  } catch {}
  return initialUsers;
};

// Helper to save all users
export const saveAllUsers = (users) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users to localStorage:', err);
  }
};

// Activity logs
export const getActivityLogs = () => {
  try {
    const raw = localStorage.getItem(LOGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read activity logs:', err);
  }
  try {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(initialActivityLogs));
  } catch {}
  return initialActivityLogs;
};

export const logActivity = (action, user = 'Admin', role = 'admin') => {
  try {
    const logs = getActivityLogs();
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    const newLog = {
      id: `act-${Date.now()}`,
      timestamp: formattedDate,
      action,
      user: typeof user === 'string' ? user : (user?.name || 'Administrator'),
      role: typeof user === 'object' && user?.role ? user.role : role
    };
    const updated = [newLog, ...logs];
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to log activity:', err);
    return [];
  }
};

// Register/Add User
export const registerUser = (userData, actorName = 'Administrator') => {
  const users = getAllUsers();
  const identifier = String(userData.email || userData.phone || '').trim().toLowerCase();
  if (identifier && users.some((user) => String(user.email || '').trim().toLowerCase() === identifier || String(user.phone || '').replace(/\D/g, '') === identifier.replace(/\D/g, ''))) {
    return { success: false, error: 'An account with this email or mobile number already exists.' };
  }
  const newUser = {
    id: `usr-${Date.now()}`,
    name: userData.name || 'New User',
    designation: userData.designation || (userData.role === 'admin' ? 'System Administrator' : userData.role === 'staff' ? 'Mandi Operator' : 'Farmer Member'),
    email: userData.email || '',
    phone: userData.phone || '',
    role: userData.role || 'farmer',
    password: userData.password || '',
    status: userData.status || 'Active',
    createdAt: new Date().toISOString().split('T')[0]
  };

  const updatedUsers = [newUser, ...users];
  saveAllUsers(updatedUsers);
  logActivity(`Added new user ${newUser.name} with role [${newUser.role.toUpperCase()}]`, actorName, 'admin');
  return { success: true, user: newUser };
};

export const authenticateUser = (identifier, password) => {
  const normalizedIdentifier = String(identifier || '').trim().toLowerCase();
  const user = getAllUsers().find((candidate) => {
    const email = String(candidate.email || '').trim().toLowerCase();
    const phone = String(candidate.phone || '').replace(/\D/g, '');
    return email === normalizedIdentifier || phone === normalizedIdentifier.replace(/\D/g, '');
  });
  const demoPasswords = { 'admin@kisansetu.gov.in': 'Admin@123', 'cheema.staff@punjab.gov.in': 'Staff@123', '9876543210': 'Farmer@123' };
  const expectedPassword = user?.password || demoPasswords[normalizedIdentifier];
  if (!user || expectedPassword !== password) return { success: false, error: 'Invalid email/mobile number or password.' };
  if (user.status && user.status !== 'Active') return { success: false, error: 'This account is inactive. Contact an administrator.' };
  logActivity('Logged in to KisanSetu', user, user.role);
  return { success: true, user: { ...user, password: undefined } };
};

// Update User
export const updateUser = (userId, changes, actorName = 'Administrator') => {
  const users = getAllUsers();
  let updatedUser = null;
  const updatedUsers = users.map((user) => {
    if (user.id === userId) {
      updatedUser = { ...user, ...changes };
      return updatedUser;
    }
    return user;
  });

  if (updatedUser) {
    saveAllUsers(updatedUsers);
    logActivity(`Updated user profile: ${updatedUser.name} (${updatedUser.role})`, actorName, 'admin');
  }
  return updatedUser;
};

// Delete User
export const deleteUser = (userId, actorName = 'Administrator') => {
  const users = getAllUsers();
  const target = users.find((u) => u.id === userId);
  const updatedUsers = users.filter((u) => u.id !== userId);
  saveAllUsers(updatedUsers);
  if (target) {
    logActivity(`Removed user account: ${target.name} (${target.email || target.phone})`, actorName, 'admin');
  }
  return updatedUsers;
};
