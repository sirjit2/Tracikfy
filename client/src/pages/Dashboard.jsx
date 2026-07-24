import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AppLayout from '../components/layout/AppLayout'
import './Dashboard.css'

const API = 'http://localhost:5000/api'

const CATEGORY_ICONS = {
  Food:'🍔', Transport:'🚗', Shopping:'🛍️', Entertainment:'🎬',
  Health:'💊', Utilities:'⚡', Housing:'🏠', Education:'📚',
  Travel:'✈️', Other:'📦',
}

export default function Dashboard() {
  const { token } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [budgets,  setBudgets]  = useState([])
  const [loading,  setLoading]  = useState(true)

  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const fetch2 = async () => {
      try {
        const [eR, bR] = await Promise.all([
          fetch(`${API}/expenses`, { headers }),
          fetch(`${API}/budgets`,  { headers }),
        ])
        const eD = await eR.json()
        const bD = await bR.json()
        if (Array.isArray(eD)) setExpenses(eD)
        if (Array.isArray(bD)) setBudgets(bD)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    if (token) fetch2()
  }, [token])

  const now = new Date()
  const thisMonth = expenses.filter(e => {
    const d = new Date(e.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const totalSpent  = thisMonth.reduce((s, e) => s + e.amount, 0)
  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0)
  const remaining   = totalBudget - totalSpent
  const recent      = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6)

  const byCategory  = thisMonth.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {})
  const topCats = Object.entries(byCategory).sort((a,b) => b[1]-a[1]).slice(0,4)

  if (loading) return (
    <div className="app-loader-full">
      <div className="app-spinner" /><span>Loading…</span>
    </div>
  )

  return (
    <AppLayout
      title="Dashboard"
      subtitle={`Welcome back 👋  — ${now.toLocaleString('default',{month:'long',year:'numeric'})}`}
      action={
        <Link to="/expenses" className="appl-btn appl-btn--primary" id="dash-add-expense">
          + Add Expense
        </Link>
      }
    >
      {/* ── Stat cards ── */}
      <div className="dash-stats">
        {[
          { label:'Spent This Month', value:`$${totalSpent.toFixed(2)}`,  icon:'💸', mod:'spent'     },
          { label:'Total Budget',     value:`$${totalBudget.toFixed(2)}`, icon:'🎯', mod:'budget'    },
          { label: remaining>=0 ? 'Remaining' : 'Over Budget',
            value:`$${Math.abs(remaining).toFixed(2)}`,
            icon: remaining>=0 ? '✅' : '⚠️', mod: remaining>=0 ? 'remaining' : 'over' },
          { label:'Transactions',     value: thisMonth.length,            icon:'📋', mod:'txns'      },
        ].map((s,i) => (
          <div key={i} className={`stat-card stat-card--${s.mod}`} id={`stat-${s.mod}`}>
            <div className="stat-card__icon">{s.icon}</div>
            <div>
              <span className="stat-card__label">{s.label}</span>
              <span className="stat-card__value">{s.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Two-col grid ── */}
      <div className="dash-grid">
        {/* Recent expenses */}
        <div className="dash-card" id="dash-recent">
          <div className="dash-card__head">
            <h2 className="dash-card__title">Recent Transactions</h2>
            <Link to="/expenses" className="dash-card__link">View all →</Link>
          </div>
          {recent.length === 0 ? (
            <div className="dash-empty">
              <span>💳</span><p>No expenses yet</p>
              <Link to="/expenses" className="appl-btn appl-btn--ghost">Add expense</Link>
            </div>
          ) : (
            <ul className="dash-txn-list">
              {recent.map(e => (
                <li key={e._id} className="dash-txn">
                  <div className="dash-txn__icon">{CATEGORY_ICONS[e.category]||'📦'}</div>
                  <div className="dash-txn__info">
                    <span className="dash-txn__name">{e.title}</span>
                    <span className="dash-txn__meta">{e.category} · {new Date(e.date).toLocaleDateString()}</span>
                  </div>
                  <span className="dash-txn__amt">-${e.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Budget progress */}
        <div className="dash-card" id="dash-budgets">
          <div className="dash-card__head">
            <h2 className="dash-card__title">Budget Progress</h2>
            <Link to="/budgets" className="dash-card__link">Manage →</Link>
          </div>
          {budgets.length === 0 ? (
            <div className="dash-empty">
              <span>🎯</span><p>No budgets set</p>
              <Link to="/budgets" className="appl-btn appl-btn--ghost">Create budget</Link>
            </div>
          ) : (
            <ul className="dash-budget-list">
              {budgets.map(b => {
                const spent = thisMonth.filter(e=>e.category===b.category).reduce((s,e)=>s+e.amount,0)
                const pct   = Math.min((spent/b.limit)*100,100)
                const over  = spent > b.limit
                return (
                  <li key={b._id} className="dash-budget-item">
                    <div className="dash-budget-item__head">
                      <span>{CATEGORY_ICONS[b.category]||'📦'} {b.category}</span>
                      <span className={over?'color-red':''}>${spent.toFixed(0)} / ${b.limit}</span>
                    </div>
                    <div className="dash-progress">
                      <div className={`dash-progress__bar${over?' dash-progress__bar--over':''}`} style={{width:`${pct}%`}}/>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Top categories */}
        {topCats.length > 0 && (
          <div className="dash-card dash-card--wide" id="dash-top-cats">
            <div className="dash-card__head">
              <h2 className="dash-card__title">Top Spending Categories</h2>
            </div>
            <div className="dash-cat-grid">
              {topCats.map(([cat,amt]) => (
                <div key={cat} className="dash-cat-card">
                  <span className="dash-cat-card__icon">{CATEGORY_ICONS[cat]||'📦'}</span>
                  <span className="dash-cat-card__name">{cat}</span>
                  <span className="dash-cat-card__amt">${amt.toFixed(2)}</span>
                  <div className="dash-progress dash-progress--sm">
                    <div className="dash-progress__bar" style={{width:`${(amt/totalSpent)*100}%`}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
