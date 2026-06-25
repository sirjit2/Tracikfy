import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const IconEyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

const IconAlert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)

// ─── Password Strength ────────────────────────────────────────────────────────
const getPasswordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: '' }
  let score = 0
  if (pwd.length >= 6) score++
  if (pwd.length >= 10) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
  const classes = ['', 'weak', 'fair', 'good', 'strong', 'strong']
  return { score, label: labels[score], cls: classes[score] }
}

// ─── Component ────────────────────────────────────────────────────────────────
const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const pwdStrength = getPasswordStrength(form.password)

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Full name is required'
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    return errs
  }

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors((p) => ({ ...p, [e.target.name]: '' }))
    if (serverError) setServerError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setServerError('')
    try {
      await register(form.name.trim(), form.email.trim().toLowerCase(), form.password)
      navigate('/dashboard')
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <Link to="/" className="auth-logo" id="auth-logo">
          <svg className="auth-logo-icon" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L24 8V20L14 26L4 20V8L14 2Z" fill="url(#rHexGrad)" />
            <path d="M9 14.5L12 17.5L19 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="rHexGrad" x1="4" y1="2" x2="24" y2="26" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7C3AED"/><stop offset="1" stopColor="#10B981"/>
              </linearGradient>
            </defs>
          </svg>
          <span className="auth-logo-text">Trackify</span>
        </Link>

        {/* Header */}
        <div className="auth-header">
          <h1>Create your account</h1>
          <p>Start managing your finances smarter — it's free forever.</p>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="auth-error-banner" role="alert" id="register-error-banner">
            <IconAlert />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate id="register-form">
          {/* Name */}
          <div className="auth-field">
            <label htmlFor="reg-name">Full Name</label>
            <div className="auth-field-inner">
              <span className="auth-field-icon"><IconUser /></span>
              <input
                id="reg-name"
                name="name"
                type="text"
                placeholder="Jane Smith"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                className={errors.name ? 'is-error' : ''}
              />
            </div>
            {errors.name && <span className="auth-field-error">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="reg-email">Email Address</label>
            <div className="auth-field-inner">
              <span className="auth-field-icon"><IconMail /></span>
              <input
                id="reg-email"
                name="email"
                type="email"
                placeholder="jane@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                className={errors.email ? 'is-error' : ''}
              />
            </div>
            {errors.email && <span className="auth-field-error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="reg-password">Password</label>
            <div className="auth-field-inner">
              <span className="auth-field-icon"><IconLock /></span>
              <input
                id="reg-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                className={errors.password ? 'is-error' : ''}
              />
              <button
                type="button"
                className="auth-pwd-toggle"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                id="reg-pwd-toggle"
              >
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
            {errors.password && <span className="auth-field-error">{errors.password}</span>}
            {/* Password Strength */}
            {form.password && (
              <div className="auth-pwd-strength">
                <div className="auth-pwd-strength-bars">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`auth-pwd-strength-bar ${i <= pwdStrength.score ? pwdStrength.cls : ''}`}
                    />
                  ))}
                </div>
                <span className="auth-pwd-strength-label">{pwdStrength.label} password</span>
              </div>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className="auth-submit" disabled={loading} id="register-submit-btn">
            {loading ? (
              <><div className="auth-spinner" /> Creating account…</>
            ) : (
              'Create Free Account →'
            )}
          </button>

          {/* Terms */}
          <p className="auth-terms">
            By signing up you agree to our{' '}
            <a href="#terms">Terms of Service</a> and{' '}
            <a href="#privacy">Privacy Policy</a>.
          </p>
        </form>

        {/* Footer */}
        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" id="goto-login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
