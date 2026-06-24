import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import './Home.css'

/* ── tiny helpers ── */
const useIntersect = (cb, options) => {
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(cb, { threshold: 0.15, ...options })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return ref
}

/* ══════════════════════════════════════════
   HERO
══════════════════════════════════════════ */
const Hero = () => (
  <section className="hero" id="hero">
    {/* ambient blobs */}
    <div className="hero__blob hero__blob--1" aria-hidden />
    <div className="hero__blob hero__blob--2" aria-hidden />
    <div className="hero__blob hero__blob--3" aria-hidden />

    <div className="container hero__inner">
      <div className="hero__content">
        <div className="hero__badge" id="hero-badge">
          <span className="hero__badge-dot" />
          ✦ Trusted by 50,000+ users worldwide
        </div>

        <h1 className="hero__title">
          Take Control of <br />
          <span className="gradient-text">Your Finances</span>
          <br />Like Never Before
        </h1>

        <p className="hero__subtitle">
          Trackify brings together expense tracking, budget planning, and financial
          insights in one beautifully designed platform. Stop guessing — start knowing.
        </p>

        <div className="hero__actions">
          <Link to="/register" className="btn-primary" id="hero-cta-primary">
            Start for Free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <a href="#how-it-works" className="btn-ghost" id="hero-cta-secondary">
            <span className="btn-ghost__play">▶</span>
            See how it works
          </a>
        </div>

        <div className="hero__trust">
          <div className="hero__trust-avatars">
            {['#7C3AED','#10B981','#F59E0B','#EF4444','#0EA5E9'].map((c,i) => (
              <div key={i} className="hero__avatar" style={{ background: c, zIndex: 5-i }} />
            ))}
          </div>
          <span>Join <strong>50K+</strong> people managing finances smarter</span>
        </div>
      </div>

      {/* Dashboard Preview Card */}
      <div className="hero__preview" id="hero-preview">
        <DashboardMockup />
      </div>
    </div>

    {/* scroll indicator */}
    <div className="hero__scroll-indicator" aria-hidden>
      <div className="hero__scroll-dot" />
    </div>
  </section>
)

/* ── Dashboard mock card ── */
const DashboardMockup = () => (
  <div className="mockup">
    {/* header bar */}
    <div className="mockup__header">
      <div className="mockup__dots">
        <span style={{background:'#EF4444'}}/>
        <span style={{background:'#F59E0B'}}/>
        <span style={{background:'#10B981'}}/>
      </div>
      <span className="mockup__title">Trackify Dashboard</span>
    </div>

    {/* balance row */}
    <div className="mockup__balance-row">
      <div className="mockup__card mockup__card--balance">
        <span className="mockup__label">Total Balance</span>
        <span className="mockup__value mockup__value--big gradient-text">$12,450.00</span>
        <span className="mockup__badge mockup__badge--up">↑ 8.2% this month</span>
      </div>
      <div className="mockup__card mockup__card--spent">
        <span className="mockup__label">Spent</span>
        <span className="mockup__value" style={{color:'#EF4444'}}>$3,240</span>
        <span className="mockup__badge mockup__badge--down">↓ 2.1%</span>
      </div>
      <div className="mockup__card mockup__card--saved">
        <span className="mockup__label">Saved</span>
        <span className="mockup__value" style={{color:'#10B981'}}>$2,100</span>
        <span className="mockup__badge mockup__badge--up">↑ 12%</span>
      </div>
    </div>

    {/* mini bar chart */}
    <div className="mockup__chart-area">
      <span className="mockup__chart-label">Spending Overview</span>
      <div className="mockup__bars">
        {[45,70,55,88,60,75,50,92,68,80,55,72].map((h,i) => (
          <div key={i} className="mockup__bar-wrap">
            <div className="mockup__bar" style={{ height: `${h}%`, animationDelay: `${i * 0.06}s` }} />
          </div>
        ))}
      </div>
    </div>

    {/* recent transactions */}
    <div className="mockup__txns">
      <span className="mockup__chart-label">Recent Transactions</span>
      {[
        { icon:'🛒', label:'Groceries', cat:'Food', amt:'-$84.20', color:'#EF4444' },
        { icon:'⚡', label:'Electric Bill', cat:'Utilities', amt:'-$56.00', color:'#F59E0B' },
        { icon:'💰', label:'Salary', cat:'Income', amt:'+$4,200', color:'#10B981' },
      ].map((t,i) => (
        <div key={i} className="mockup__txn">
          <div className="mockup__txn-icon">{t.icon}</div>
          <div className="mockup__txn-info">
            <span className="mockup__txn-name">{t.label}</span>
            <span className="mockup__txn-cat">{t.cat}</span>
          </div>
          <span className="mockup__txn-amt" style={{color: t.color}}>{t.amt}</span>
        </div>
      ))}
    </div>

    {/* glow ring */}
    <div className="mockup__glow" aria-hidden />
  </div>
)

/* ══════════════════════════════════════════
   STATS
══════════════════════════════════════════ */
const stats = [
  { value: '50K+', label: 'Active Users', icon: '👥' },
  { value: '$2.4B', label: 'Tracked Monthly', icon: '📊' },
  { value: '99.9%', label: 'Uptime SLA', icon: '⚡' },
  { value: '4.9★', label: 'App Store Rating', icon: '🏆' },
]

const Stats = () => (
  <section className="stats-bar" id="stats">
    <div className="container">
      <div className="stats-bar__grid">
        {stats.map((s, i) => (
          <div key={i} className="stats-bar__item" id={`stat-${i}`}>
            <span className="stats-bar__icon">{s.icon}</span>
            <span className="stats-bar__value gradient-text">{s.value}</span>
            <span className="stats-bar__label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
)

/* ══════════════════════════════════════════
   FEATURES
══════════════════════════════════════════ */
const features = [
  {
    icon: '📊',
    title: 'Smart Analytics',
    desc: 'Visualise spending with beautiful interactive charts. Spot trends, identify waste, and understand your habits at a glance.',
    color: '#7C3AED',
    tag: 'Insights',
  },
  {
    icon: '🎯',
    title: 'Budget Goals',
    desc: 'Set monthly budgets per category with customisable limits. Get real-time alerts before you overspend.',
    color: '#10B981',
    tag: 'Planning',
  },
  {
    icon: '⚡',
    title: 'Instant Tracking',
    desc: 'Log expenses in seconds. Scan receipts, use smart categorisation, or bulk import from your bank.',
    color: '#F59E0B',
    tag: 'Speed',
  },
  {
    icon: '🔔',
    title: 'Smart Alerts',
    desc: 'Never be caught off-guard. Get proactive notifications for unusual spending, bill due dates, and budget milestones.',
    color: '#0EA5E9',
    tag: 'Notifications',
  },
  {
    icon: '📱',
    title: 'Multi-Device Sync',
    desc: 'Access your finances from any device. Real-time sync keeps everything up-to-date across web, iOS, and Android.',
    color: '#EF4444',
    tag: 'Sync',
  },
  {
    icon: '🔒',
    title: 'Bank-Grade Security',
    desc: '256-bit AES encryption, biometric authentication, and zero-knowledge architecture keep your data safe.',
    color: '#8B5CF6',
    tag: 'Security',
  },
]

const Features = () => {
  const sectionRef = useIntersect(([entry]) => {
    if (entry.isIntersecting) entry.target.classList.add('in-view')
  })

  return (
    <section className="features" id="features" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <span className="section-pill">Features</span>
          <h2 className="section-title">Everything You Need to <span className="gradient-text">Master Money</span></h2>
          <p className="section-sub">Powerful tools designed to give you total financial clarity without the complexity.</p>
        </div>

        <div className="features__grid">
          {features.map((f, i) => (
            <div
              key={i}
              className="feature-card"
              id={`feature-card-${i}`}
              style={{ '--card-color': f.color, animationDelay: `${i * 0.08}s` }}
            >
              <div className="feature-card__icon-wrap">
                <div className="feature-card__icon">{f.icon}</div>
              </div>
              <span className="feature-card__tag" style={{ color: f.color, background: `${f.color}18` }}>{f.tag}</span>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
              <div className="feature-card__arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════
   HOW IT WORKS
══════════════════════════════════════════ */
const steps = [
  { step:'01', title:'Create Your Account', desc:'Sign up free in under 60 seconds. No credit card required.', icon:'✦' },
  { step:'02', title:'Connect & Customise', desc:'Set your budgets, add expense categories, and invite family members.', icon:'⚙' },
  { step:'03', title:'Track & Improve', desc:'Log expenses, view insights, and watch your savings grow every month.', icon:'📈' },
]

const HowItWorks = () => (
  <section className="how-it-works" id="how-it-works">
    <div className="container">
      <div className="section-header">
        <span className="section-pill">Process</span>
        <h2 className="section-title">Up and Running in <span className="gradient-text">3 Easy Steps</span></h2>
        <p className="section-sub">Getting started with Trackify takes less than 2 minutes.</p>
      </div>

      <div className="steps__grid">
        {steps.map((s, i) => (
          <div key={i} className="step-card" id={`step-${i}`}>
            <div className="step-card__number">{s.step}</div>
            <div className="step-card__icon">{s.icon}</div>
            <h3 className="step-card__title">{s.title}</h3>
            <p className="step-card__desc">{s.desc}</p>
            {i < steps.length - 1 && <div className="step-card__connector" aria-hidden />}
          </div>
        ))}
      </div>
    </div>
  </section>
)

/* ══════════════════════════════════════════
   PRICING
══════════════════════════════════════════ */
const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Perfect for individuals just getting started.',
    features: ['Up to 50 transactions/month','Basic analytics','2 budget categories','Email support'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: 'per month',
    desc: 'Everything you need to master your finances.',
    features: ['Unlimited transactions','Advanced analytics','Unlimited categories','Smart alerts & reports','Priority support','Export to CSV/PDF'],
    cta: 'Start Free Trial',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Family',
    price: '$19',
    period: 'per month',
    desc: 'Shared budgeting for the whole household.',
    features: ['Everything in Pro','Up to 6 members','Shared budgets','Family insights dashboard','Dedicated support'],
    cta: 'Start Free Trial',
    highlight: false,
  },
]

const Pricing = () => (
  <section className="pricing" id="pricing">
    <div className="container">
      <div className="section-header">
        <span className="section-pill">Pricing</span>
        <h2 className="section-title">Simple, <span className="gradient-text">Transparent Pricing</span></h2>
        <p className="section-sub">No hidden fees. Cancel anytime. Start free forever.</p>
      </div>

      <div className="pricing__grid">
        {plans.map((p, i) => (
          <div key={i} className={`pricing-card ${p.highlight ? 'pricing-card--highlight' : ''}`} id={`plan-${p.name.toLowerCase()}`}>
            {p.badge && <div className="pricing-card__badge">{p.badge}</div>}
            <h3 className="pricing-card__name">{p.name}</h3>
            <div className="pricing-card__price-row">
              <span className="pricing-card__price">{p.price}</span>
              <span className="pricing-card__period">/{p.period}</span>
            </div>
            <p className="pricing-card__desc">{p.desc}</p>
            <ul className="pricing-card__features">
              {p.features.map((f, j) => (
                <li key={j}><span className="check">✓</span>{f}</li>
              ))}
            </ul>
            <Link
              to="/register"
              className={p.highlight ? 'btn-primary btn-primary--full' : 'btn-outline btn-outline--full'}
              id={`plan-cta-${p.name.toLowerCase()}`}
            >
              {p.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  </section>
)

/* ══════════════════════════════════════════
   TESTIMONIALS
══════════════════════════════════════════ */
const testimonials = [
  { name:'Sarah K.', role:'Freelancer', text:'Trackify literally changed how I handle money. I saved $800 in the first month just by seeing where it was going.', avatar:'#7C3AED', rating:5 },
  { name:'James T.', role:'Small Business Owner', text:'The budget alerts are a game-changer. I finally have a clear picture of my business vs personal expenses.', avatar:'#10B981', rating:5 },
  { name:'Priya M.', role:'Student', text:'Free plan has everything I need. The UI is gorgeous and it takes 10 seconds to log an expense.', avatar:'#F59E0B', rating:5 },
  { name:'Carlos R.', role:'Software Engineer', text:'Switched from Mint. Trackify\'s analytics are far superior and the dark mode is perfect.', avatar:'#0EA5E9', rating:5 },
  { name:'Emily W.', role:'Marketing Manager', text:'Love the family plan. My partner and I finally agree on budgets because Trackify makes it visual.', avatar:'#EF4444', rating:5 },
  { name:'David L.', role:'Retired Teacher', text:'Thought it would be complicated. It\'s the most intuitive finance app I\'ve ever used.', avatar:'#8B5CF6', rating:5 },
]

const Testimonials = () => (
  <section className="testimonials" id="testimonials">
    <div className="container">
      <div className="section-header">
        <span className="section-pill">Reviews</span>
        <h2 className="section-title">Loved by <span className="gradient-text">50,000+ Users</span></h2>
        <p className="section-sub">Real stories from real people taking control of their finances.</p>
      </div>

      <div className="testimonials__grid">
        {testimonials.map((t, i) => (
          <div key={i} className="testimonial-card" id={`testimonial-${i}`}>
            <div className="testimonial-card__stars">{'★'.repeat(t.rating)}</div>
            <p className="testimonial-card__text">"{t.text}"</p>
            <div className="testimonial-card__author">
              <div className="testimonial-card__avatar" style={{ background: t.avatar }}>
                {t.name[0]}
              </div>
              <div>
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

/* ══════════════════════════════════════════
   CTA BANNER
══════════════════════════════════════════ */
const CTABanner = () => (
  <section className="cta-banner" id="cta-banner">
    <div className="cta-banner__glow" aria-hidden />
    <div className="container cta-banner__inner">
      <h2 className="cta-banner__title">
        Ready to Take Control of <span className="gradient-text">Your Money?</span>
      </h2>
      <p className="cta-banner__sub">Join 50,000+ people already using Trackify. Free forever. No credit card required.</p>
      <div className="cta-banner__actions">
        <Link to="/register" className="btn-primary btn-primary--lg" id="cta-banner-btn">
          Get Started — It's Free
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
        <span className="cta-banner__note">✓ Free forever  ✓ No credit card  ✓ Cancel anytime</span>
      </div>
    </div>
  </section>
)

/* ══════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════ */
const Home = () => (
  <div className="home-page">
    <Navbar />
    <main>
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <CTABanner />
    </main>
    <Footer />
  </div>
)

export default Home
