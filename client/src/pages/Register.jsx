import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

export const Register = () => {
  const { register, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    if (localError) setLocalError('');
    if (authError) clearError();
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Password Requirements evaluation
  const hasMinLength = formData.password.length >= 8;
  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasLowercase = /[a-z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase && hasNumber;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.name || !formData.email || !formData.password) {
      setLocalError('Please complete all required fields.');
      return;
    }

    if (!isPasswordValid) {
      setLocalError('Password does not satisfy security requirements.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setLocalError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const errorMessage = localError || authError;

  return (
    <section className="mx-auto flex min-h-[65vh] w-full max-w-xl items-center justify-center py-8 sm:py-12">
      <div className="w-full rounded-xl border border-stone-300 bg-white p-6 shadow-lg shadow-stone-900/5 sm:p-10">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-stone-900 text-stone-50">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <polyline points="17 11 19 13 23 9"></polyline>
            </svg>
          </div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-stone-900">
            Create your account
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Join the intelligent agile code review platform powered by Google Gemini.
          </p>
        </header>

        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert" aria-live="assertive">
            <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-stone-700">
              Full Name
            </label>
            <div className="relative">
              <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ada Lovelace"
                required
                className="w-full rounded-lg border border-stone-300 bg-stone-50 py-3 pl-10 pr-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-500 focus:bg-white focus:ring-2 focus:ring-stone-200"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-stone-700">
              Email Address
            </label>
            <div className="relative">
              <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                className="w-full rounded-lg border border-stone-300 bg-stone-50 py-3 pl-10 pr-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-500 focus:bg-white focus:ring-2 focus:ring-stone-200"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-stone-700">
              Password
            </label>
            <div className="relative">
              <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                required
                className="w-full rounded-lg border border-stone-300 bg-stone-50 py-3 pl-10 pr-12 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-500 focus:bg-white focus:ring-2 focus:ring-stone-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-stone-500 transition hover:text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>

            {formData.password && (
              <div className="mt-3 flex flex-wrap gap-2" aria-label="Password requirements">
                {[
                  ['8+ chars', hasMinLength],
                  ['Uppercase', hasUppercase],
                  ['Lowercase', hasLowercase],
                  ['Number', hasNumber]
                ].map(([label, valid]) => (
                  <span
                    key={label}
                    className={`rounded-md border px-2 py-1 text-xs ${valid ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-stone-200 bg-stone-100 text-stone-600'}`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-stone-700">
              Confirm Password
            </label>
            <div className="relative">
              <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                required
                className="w-full rounded-lg border border-stone-300 bg-stone-50 py-3 pl-10 pr-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-500 focus:bg-white focus:ring-2 focus:ring-stone-200"
              />
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-3 text-xs leading-5 text-stone-600">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>
              By registering, you acknowledge that submitted source code is sent securely to Google Gemini backend for AI analysis.
            </span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12"></circle>
                </svg>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </>
            )}
          </button>
        </form>

        <footer className="mt-7 border-t border-stone-200 pt-5 text-center text-sm text-stone-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-stone-900 underline decoration-stone-400 underline-offset-4 transition hover:decoration-stone-900">
            Sign In
          </Link>
        </footer>
      </div>
    </section>
  );
};

export default Register;
