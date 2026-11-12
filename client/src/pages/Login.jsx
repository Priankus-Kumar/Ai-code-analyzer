import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

export const Login = () => {
  const { login, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    if (localError) setLocalError('');
    if (authError) clearError();
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDemoFill = () => {
    setFormData({
      email: 'demo.developer@agile.ai',
      password: 'Password123!'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.email || !formData.password) {
      setLocalError('Please fill in both email and password.');
      return;
    }

    setSubmitting(true);
    try {
      await login({ email: formData.email, password: formData.password });
      navigate(from, { replace: true });
    } catch (err) {
      setLocalError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const errorMessage = localError || authError;

  return (
    <div className="auth-page-container">
      {/* Decorative Glow Orbs */}
      <div className="glow-orb orb-primary" aria-hidden="true"></div>
      <div className="glow-orb orb-secondary" aria-hidden="true"></div>

      <div className="auth-card-wrap">
        <div className="auth-card glass-card">
          {/* Header */}
          <div className="auth-header">
            <div className="auth-icon-badge">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">
              Sign in to access your AI-powered agile code analysis workstation.
            </p>
          </div>

          {/* Quick Demo Credentials Fill Button */}
          <div className="demo-credentials-banner">
            <div className="demo-info">
              <span className="demo-tag">Quick Test</span>
              <span className="demo-text">demo.developer@agile.ai</span>
            </div>
            <button
              type="button"
              onClick={handleDemoFill}
              className="btn btn-secondary btn-sm demo-btn"
              title="Auto-fill demo test credentials"
            >
              Fill Credentials
            </button>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="alert-error" role="alert" aria-live="assertive">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="input-with-icon">
                <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  required
                  className="form-input with-left-icon"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-row">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
              </div>
              <div className="input-with-icon">
                <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  required
                  className="form-input with-left-icon with-right-icon"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password-btn"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg submit-btn"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12"></circle>
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <footer className="auth-footer">
            <p>
              Don't have an account yet?{' '}
              <Link to="/register" className="auth-link">
                Create Account
              </Link>
            </p>
          </footer>
        </div>
      </div>

      <style>{`
        .auth-page-container {
          min-height: calc(100vh - 120px);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 2rem 1rem;
        }
        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          z-index: 0;
        }
        .orb-primary {
          width: 320px;
          height: 320px;
          background: rgba(120, 113, 108, 0.12);
          top: 15%;
          left: 20%;
        }
        .orb-secondary {
          width: 280px;
          height: 280px;
          background: rgba(168, 162, 158, 0.14);
          bottom: 15%;
          right: 20%;
        }
        .auth-card-wrap {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 460px;
        }
        .auth-card {
          padding: 2.5rem 2.25rem;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid var(--border-subtle);
          box-shadow: 0 20px 45px rgba(41, 37, 36, 0.1);
        }
        .auth-header {
          text-align: center;
          margin-bottom: 1.75rem;
        }
        .auth-icon-badge {
          width: 54px;
          height: 54px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, #57534e, #292524);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin: 0 auto 1rem auto;
          box-shadow: 0 4px 12px rgba(41, 37, 36, 0.2);
        }
        .auth-title {
          font-size: 1.65rem;
          font-weight: 700;
          color: var(--text-main);
          letter-spacing: -0.02em;
          margin-bottom: 0.4rem;
        }
        .auth-subtitle {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.5;
        }
        .demo-credentials-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(68, 64, 60, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.65rem 0.9rem;
          margin-bottom: 1.5rem;
        }
        .demo-info {
          display: flex;
          flex-direction: column;
        }
        .demo-tag {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }
        .demo-text {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          color: var(--text-main);
        }
        .demo-btn {
          font-size: 0.75rem;
          padding: 0.35rem 0.65rem;
        }
        .alert-error {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          margin-bottom: 1.25rem;
          font-size: 0.875rem;
        }
        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
        .field-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-dim);
          pointer-events: none;
        }
        .with-left-icon {
          padding-left: 2.75rem;
        }
        .with-right-icon {
          padding-right: 2.75rem;
        }
        .toggle-password-btn {
          position: absolute;
          right: 0.75rem;
          background: transparent;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0.25rem;
        }
        .toggle-password-btn:hover {
          color: var(--text-main);
        }
        .submit-btn {
          width: 100%;
          margin-top: 0.75rem;
        }
        .auth-footer {
          margin-top: 1.75rem;
          text-align: center;
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .auth-link {
          color: var(--text-main);
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .auth-link:hover {
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default Login;
