import React, { useState } from 'react';
import {
  LogIn,
  UserPlus,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Wheat,
  Shield,
  User,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { saveSession, ROLES } from '../data/authData';
import { authApi, setToken } from '../services/api';
import { t } from '../data/i18n';

export default function LoginPage({ onLoginSuccess, currentLang = 'en' }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState(ROLES.ADMIN);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState(ROLES.FARMER);

  // Inline validation state
  const [fieldErrors, setFieldErrors] = useState({});

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setErrorMessage('');
    setSuccessMessage('');
    setFieldErrors({});
  };

  const validateLogin = () => {
    const errors = {};
    if (!loginIdentifier.trim()) {
      errors.loginIdentifier = 'Email or Mobile Number is required';
    }
    if (!loginPassword) {
      errors.loginPassword = 'Password is required';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegister = () => {
    const errors = {};
    if (!regName.trim()) {
      errors.regName = 'Full name is required';
    }
    const cleanPhone = regPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.regPhone = 'Valid 10-digit mobile number required';
    }
    if (regEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) {
      errors.regEmail = 'Please enter a valid email address';
    }
    if (!regPassword || regPassword.length < 6) {
      errors.regPassword = 'Password must be at least 6 characters';
    }
    if (regPassword !== regConfirmPassword) {
      errors.regConfirmPassword = 'Passwords do not match';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateLogin()) return;

    setLoading(true);

    try {
      const res = await authApi.login(loginIdentifier, loginPassword);
      if (res.user) {
        // Check if role matches selected role (if role check is preferred)
        if (loginRole && res.user.role !== loginRole && res.user.role !== ROLES.ADMIN) {
          setLoading(false);
          setErrorMessage(`Access restricted: This account has role '${res.user.role}', not '${loginRole}'.`);
          return;
        }

        setToken(res.token); saveSession(res.user);
        setSuccessMessage(`Welcome back, ${res.user.name}! Redirecting...`);
        setLoading(false); if (onLoginSuccess) onLoginSuccess(res.user);
      }
    } catch (error) { setLoading(false); setErrorMessage(error.message); }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateRegister()) return;

    setLoading(true);

    try {
      const res = await authApi.register({
        name: regName,
        phone: regPhone.replace(/\D/g, '').slice(-10),
        email: regEmail,
        password: regPassword,
        role: regRole
      });

      if (res.user) {
        setToken(res.token); saveSession(res.user);
        setSuccessMessage('Account created successfully! Redirecting...');
        setLoading(false); if (onLoginSuccess) onLoginSuccess(res.user);
      }
    } catch (error) { setLoading(false); setErrorMessage(error.message); }
  };

  const fillDemoCredentials = (role) => {
    if (role === 'admin') {
      setLoginIdentifier('admin@kisansetu.gov.in');
      setLoginPassword('Admin@123');
      setLoginRole(ROLES.ADMIN);
    } else if (role === 'staff') {
      setLoginIdentifier('cheema.staff@punjab.gov.in');
      setLoginPassword('Staff@123');
      setLoginRole(ROLES.PROCUREMENT_OFFICER);
    } else {
      setLoginIdentifier('9876543210');
      setLoginPassword('Farmer@123');
      setLoginRole(ROLES.FARMER);
    }
    setFieldErrors({});
    setErrorMessage('');
  };

  return (
    <div className="ks-auth-page">
      <div className="ks-auth-container">
        {/* Card Header & Brand */}
        <div className="ks-auth-header">
          <div className="ks-auth-logo-badge">
            <Wheat className="ks-auth-logo-icon" size={32} />
          </div>
          <h1 className="ks-auth-title">KisanSetu</h1>
          <p className="ks-auth-subtitle">
            {t(currentLang, 'queueManagement') || 'Smart Mandi Procurement & Queue Management'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="ks-auth-tabs">
          <button
            type="button"
            className={`ks-auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('login')}
          >
            <LogIn size={16} />
            <span>{t(currentLang, 'login') || 'Login'}</span>
          </button>
          <button
            type="button"
            className={`ks-auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('register')}
          >
            <UserPlus size={16} />
            <span>{t(currentLang, 'register') || 'Register'}</span>
          </button>
        </div>

        {/* Global Error Alert */}
        {errorMessage && (
          <div className="ks-auth-alert error">
            <AlertCircle size={18} className="ks-alert-icon" />
            <div className="ks-alert-text">{errorMessage}</div>
          </div>
        )}

        {/* Global Success Alert */}
        {successMessage && (
          <div className="ks-auth-alert success">
            <CheckCircle2 size={18} className="ks-alert-icon" />
            <div className="ks-alert-text">{successMessage}</div>
          </div>
        )}

        {/* Forms */}
        {activeTab === 'login' ? (
          <form className="ks-auth-form" onSubmit={handleLoginSubmit} noValidate>
            {/* Identifier (Email/Mobile) */}
            <div className="ks-input-group">
              <label className="ks-label">
                {t(currentLang, 'mobileNumber') || 'Email or Mobile Number'}
              </label>
              <div className={`ks-input-wrapper ${fieldErrors.loginIdentifier ? 'has-error' : ''}`}>
                <Mail className="ks-field-icon" size={18} />
                <input
                  type="text"
                  placeholder="admin@kisansetu.gov.in or 9876543210"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  autoComplete="username"
                  disabled={loading}
                />
              </div>
              {fieldErrors.loginIdentifier && (
                <span className="ks-field-error">{fieldErrors.loginIdentifier}</span>
              )}
            </div>

            {/* Password */}
            <div className="ks-input-group">
              <div className="ks-label-row">
                <label className="ks-label">{t(currentLang, 'password') || 'Password'}</label>
              </div>
              <div className={`ks-input-wrapper ${fieldErrors.loginPassword ? 'has-error' : ''}`}>
                <Lock className="ks-field-icon" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="ks-toggle-pwd-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.loginPassword && (
                <span className="ks-field-error">{fieldErrors.loginPassword}</span>
              )}
            </div>

            {/* Role Dropdown */}
            <div className="ks-input-group">
              <label className="ks-label">Select System Role</label>
              <div className="ks-input-wrapper">
                <Shield className="ks-field-icon" size={18} />
                <select
                  value={loginRole}
                  onChange={(e) => setLoginRole(e.target.value)}
                  disabled={loading}
                  className="ks-select-field"
                >
                  <option value={ROLES.ADMIN}>District Administrator (Admin)</option>
                  <option value={ROLES.PROCUREMENT_OFFICER}>Mandi Procurement Officer (Staff)</option>
                  <option value={ROLES.FARMER}>Farmer (Kisan Portal)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="ks-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="ks-spinner" size={18} />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>{t(currentLang, 'login') || 'Sign In to KisanSetu'}</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <form className="ks-auth-form" onSubmit={handleRegisterSubmit} noValidate>
            {/* Full Name */}
            <div className="ks-input-group">
              <label className="ks-label">{t(currentLang, 'fullName') || 'Full Name'}</label>
              <div className={`ks-input-wrapper ${fieldErrors.regName ? 'has-error' : ''}`}>
                <User className="ks-field-icon" size={18} />
                <input
                  type="text"
                  placeholder="e.g. Sardar Baldev Singh"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  disabled={loading}
                />
              </div>
              {fieldErrors.regName && (
                <span className="ks-field-error">{fieldErrors.regName}</span>
              )}
            </div>

            {/* Mobile Number */}
            <div className="ks-input-group">
              <label className="ks-label">{t(currentLang, 'mobileNumber') || 'Mobile Number'}</label>
              <div className={`ks-input-wrapper ${fieldErrors.regPhone ? 'has-error' : ''}`}>
                <Phone className="ks-field-icon" size={18} />
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  disabled={loading}
                />
              </div>
              {fieldErrors.regPhone && (
                <span className="ks-field-error">{fieldErrors.regPhone}</span>
              )}
            </div>

            {/* Email (Optional) */}
            <div className="ks-input-group">
              <label className="ks-label">Email Address (Optional)</label>
              <div className={`ks-input-wrapper ${fieldErrors.regEmail ? 'has-error' : ''}`}>
                <Mail className="ks-field-icon" size={18} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              {fieldErrors.regEmail && (
                <span className="ks-field-error">{fieldErrors.regEmail}</span>
              )}
            </div>

            {/* Role dropdown */}
            <div className="ks-input-group">
              <label className="ks-label">Account Role</label>
              <div className="ks-input-wrapper">
                <Shield className="ks-field-icon" size={18} />
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  disabled={loading}
                  className="ks-select-field"
                >
                  <option value={ROLES.FARMER}>Farmer (Kisan Portal)</option>
                  <option value={ROLES.PROCUREMENT_OFFICER}>Mandi Staff</option>
                  <option value={ROLES.ADMIN}>District Admin</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div className="ks-input-group">
              <label className="ks-label">{t(currentLang, 'password') || 'Password'}</label>
              <div className={`ks-input-wrapper ${fieldErrors.regPassword ? 'has-error' : ''}`}>
                <Lock className="ks-field-icon" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="ks-toggle-pwd-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.regPassword && (
                <span className="ks-field-error">{fieldErrors.regPassword}</span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="ks-input-group">
              <label className="ks-label">{t(currentLang, 'confirmPassword') || 'Confirm Password'}</label>
              <div className={`ks-input-wrapper ${fieldErrors.regConfirmPassword ? 'has-error' : ''}`}>
                <Lock className="ks-field-icon" size={18} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="ks-toggle-pwd-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.regConfirmPassword && (
                <span className="ks-field-error">{fieldErrors.regConfirmPassword}</span>
              )}
            </div>

            {/* Register Submit */}
            <button
              type="submit"
              className="ks-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="ks-spinner" size={18} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>{t(currentLang, 'createAccountAction') || 'Create Account'}</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Demo Credentials Quick-Fill Strip */}
        <div className="ks-auth-demo-box">
          <div className="ks-demo-title">Quick Demo Login:</div>
          <div className="ks-demo-buttons">
            <button
              type="button"
              className="ks-demo-chip"
              onClick={() => { setActiveTab('login'); fillDemoCredentials('admin'); }}
            >
              Admin Demo
            </button>
            <button
              type="button"
              className="ks-demo-chip"
              onClick={() => { setActiveTab('login'); fillDemoCredentials('staff'); }}
            >
              Staff Demo
            </button>
            <button
              type="button"
              className="ks-demo-chip"
              onClick={() => { setActiveTab('login'); fillDemoCredentials('farmer'); }}
            >
              Farmer Demo
            </button>
          </div>
          <p className="ks-demo-text">
            Use a Demo button to fill credentials, then select Sign In.
          </p>
        </div>

        {/* Footer */}
        <div className="ks-auth-footer">
          <p>© 2026 KisanSetu | Ministry of Agriculture</p>
        </div>
      </div>
    </div>
  );
}
