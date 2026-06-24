import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' },
  ]

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="navbar">
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo" id="nav-logo">
          <div className="navbar__logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L24 8V20L14 26L4 20V8L14 2Z" fill="url(#hexGrad)" />
              <path d="M9 14.5L12 17.5L19 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="hexGrad" x1="4" y1="2" x2="24" y2="26" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7C3AED"/>
                  <stop offset="1" stopColor="#10B981"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="navbar__logo-text">Trackify</span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="navbar__links" id="nav-links">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="navbar__link" id={`nav-link-${link.label.toLowerCase().replace(/\s/g, '-')}`}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA Buttons */}
        <div className="navbar__actions" id="nav-actions">
          <Link to="/login" className="navbar__btn-ghost" id="nav-login">Sign In</Link>
          <Link to="/register" className="navbar__btn-primary" id="nav-signup">Get Started Free</Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? 'is-open' : ''}`}
          id="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile-menu ${menuOpen ? 'is-open' : ''}`} id="mobile-menu">
        <ul>
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="navbar__mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="navbar__mobile-actions">
          <Link to="/login" className="navbar__btn-ghost" onClick={() => setMenuOpen(false)}>Sign In</Link>
          <Link to="/register" className="navbar__btn-primary" onClick={() => setMenuOpen(false)}>Get Started Free</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
