import React, { useState } from 'react';
import { LogIn, UserPlus, X } from 'lucide-react';
import { t } from '../../data/i18n';

export default function AuthModal({ isOpen, initialMode = 'login', currentLang, onClose, onAuthenticate }) {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({ name: '', phone: '', password: '', confirmPassword: '' });

  if (!isOpen) return null;

  const isRegister = mode === 'register';
  const text = (key) => t(currentLang, key);
  const updateField = (field) => (event) => setFormData({ ...formData, [field]: event.target.value });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isRegister && formData.password !== formData.confirmPassword) return;

    onAuthenticate({
      name: isRegister ? formData.name : 'KisanSetu User',
      phone: formData.phone,
      mode
    });
    setFormData({ name: '', phone: '', password: '', confirmPassword: '' });
    onClose();
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setFormData({ name: '', phone: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={onClose}>
      <div className="modal-content auth-modal animate-fade" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            {isRegister ? <UserPlus size={22} className="modal-icon-green" /> : <LogIn size={22} className="modal-icon-green" />}
            <div>
              <h3 id="auth-modal-title">{isRegister ? text('createAccount') : text('welcomeBack')}</h3>
              <p>{isRegister ? text('registerHelp') : text('loginHelp')}</p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close login dialog"><X size={20} /></button>
        </div>

        <div className="auth-mode-tabs" role="tablist" aria-label="Account action">
          <button type="button" className={!isRegister ? 'active' : ''} onClick={() => switchMode('login')} role="tab" aria-selected={!isRegister}>{text('login')}</button>
          <button type="button" className={isRegister ? 'active' : ''} onClick={() => switchMode('register')} role="tab" aria-selected={isRegister}>{text('register')}</button>
        </div>

        <form className="modal-form auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label htmlFor="auth-name">{text('fullName')} *</label>
              <input id="auth-name" className="form-input" value={formData.name} onChange={updateField('name')} required autoComplete="name" />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="auth-phone">{text('mobileNumber')} *</label>
            <input id="auth-phone" className="form-input" type="tel" inputMode="numeric" pattern="[0-9]{10}" placeholder={text('mobilePlaceholder')} value={formData.phone} onChange={updateField('phone')} required autoComplete="tel" />
          </div>
          <div className="form-group">
            <label htmlFor="auth-password">{text('password')} *</label>
            <input id="auth-password" className="form-input" type="password" minLength="6" placeholder={text('passwordPlaceholder')} value={formData.password} onChange={updateField('password')} required autoComplete={isRegister ? 'new-password' : 'current-password'} />
          </div>
          {isRegister && (
            <div className="form-group">
              <label htmlFor="auth-confirm-password">{text('confirmPassword')} *</label>
              <input id="auth-confirm-password" className="form-input" type="password" minLength="6" value={formData.confirmPassword} onChange={updateField('confirmPassword')} required autoComplete="new-password" />
              {formData.confirmPassword && formData.password !== formData.confirmPassword && <span className="form-error">{text('passwordsMismatch')}</span>}
            </div>
          )}
          <button type="submit" className="btn-primary auth-submit-btn">
            {isRegister ? <UserPlus size={17} /> : <LogIn size={17} />}
            <span>{isRegister ? text('createAccountAction') : text('login')}</span>
          </button>
          <p className="auth-switch-copy">
            {isRegister ? text('alreadyAccount') : text('newHere')}{' '}
            <button type="button" onClick={() => switchMode(isRegister ? 'login' : 'register')}>{isRegister ? text('login') : text('registerNow')}</button>
          </p>
        </form>
      </div>
    </div>
  );
}
