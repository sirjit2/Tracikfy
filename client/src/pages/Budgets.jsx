import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import AppLayout from '../components/layout/AppLayout'
import '../pages/Dashboard.css'
import './Budgets.css'

const API = 'http://localhost:5000/api'
const CATEGORIES = ['Food','Transport','Shopping','Entertainment','Health','Utilities','Housing','Education','Travel','Other']
const CAT_ICONS  = { Food:'🍔',Transport:'🚗',Shopping:'🛍️',Entertainment:'🎬',Health:'💊',Utilities:'⚡',Housing:'🏠',Education:'📚',Travel:'✈️',Other:'📦' }
const now = new Date()
const EMPTY = { category:'Food', limit:'', month:now.getMonth(), year:now.getFullYear() }

export default function Budgets() {
  const { token } = useAuth()
  const [budgets,  setBudgets]    = useState([])
  const [expenses, setExpenses]   = useState([])
  const [loading,  setLoading]    = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [form,     setForm]       = useState(EMPTY)
  const [editId,   setEditId]     = useState(null)
  const [submitting,setSubmitting]= useState(false)
  const [error,    setError]      = useState('')
  const [deleteId, setDeleteId]   = useState(null)

  const headers = { Authorization:`Bearer ${token}`, 'Content-Type':'application/json' }

  const load = async () => {
    try {
      const [bR,eR] = await Promise.all([
        fetch(`${API}/budgets?month=${now.getMonth()}&year=${now.getFullYear()}`, { headers }),
        fetch(`${API}/expenses`, { headers }),
      ])
      const bD=await bR.json(); const eD=await eR.json()
      if (Array.isArray(bD)) setBudgets(bD)
      if (Array.isArray(eD)) setExpenses(eD)
    } catch { setError('Failed to load') }
    finally { setLoading(false) }
  }
  useEffect(() => { if (token) load() }, [token])

  const spent = expenses.reduce((acc,e) => {
    const d=new Date(e.date)
    if (d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear())
      acc[e.category]=(acc[e.category]||0)+e.amount
    return acc
  },{})

  const totalBudget = budgets.reduce((s,b)=>s+b.limit,0)
  const totalSpent  = budgets.reduce((s,b)=>s+(spent[b.category]||0),0)

  const openEdit = b => { setForm({category:b.category,limit:b.limit,month:b.month,year:b.year}); setEditId(b._id); setShowForm(true); setError('') }
  const openNew  = () => { setForm(EMPTY); setEditId(null); setShowForm(true); setError('') }
  const close    = () => { setShowForm(false); setEditId(null); setForm(EMPTY); setError('') }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.limit||Number(form.limit)<=0) return setError('Enter a valid limit')
    setSubmitting(true); setError('')
    try {
      const res = await fetch(editId?`${API}/budgets/${editId}`:`${API}/budgets`, {
        method: editId?'PUT':'POST', headers,
        body: JSON.stringify({...form,limit:Number(form.limit)}),
      })
      const data=await res.json()
      if (!res.ok) throw new Error(data.message||'Error')
      await load(); close()
    } catch(err) { setError(err.message) }
    finally { setSubmitting(false) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await fetch(`${API}/budgets/${deleteId}`, { method:'DELETE', headers })
    setBudgets(p=>p.filter(b=>b._id!==deleteId)); setDeleteId(null)
  }

  if (loading) return <div className="app-loader-full"><div className="app-spinner"/><span>Loading…</span></div>

  return (
    <AppLayout
      title="Budgets"
      subtitle={`${now.toLocaleString('default',{month:'long'})} ${now.getFullYear()} — Set monthly limits per category`}
      action={<button className="appl-btn appl-btn--primary" onClick={openNew} id="add-budget-btn">+ Add Budget</button>}
    >
      {/* Overview stats */}
      <div className="dash-stats" style={{marginBottom:'1.5rem'}}>
        {[
          {label:'Total Budget',value:`$${totalBudget.toFixed(2)}`,icon:'🎯',mod:'budget'},
          {label:'Total Spent', value:`$${totalSpent.toFixed(2)}`, icon:'💸',mod:'spent'},
          {label: totalBudget-totalSpent>=0?'Remaining':'Over Budget',
           value:`$${Math.abs(totalBudget-totalSpent).toFixed(2)}`,
           icon: totalBudget-totalSpent>=0?'✅':'⚠️', mod:totalBudget-totalSpent>=0?'remaining':'over'},
          {label:'Categories', value:budgets.length, icon:'📋', mod:'txns'},
        ].map((s,i)=>(
          <div key={i} className={`stat-card stat-card--${s.mod}`}>
            <div className="stat-card__icon">{s.icon}</div>
            <div><span className="stat-card__label">{s.label}</span><span className="stat-card__value">{s.value}</span></div>
          </div>
        ))}
      </div>

      {/* Budget cards */}
      {budgets.length===0 ? (
        <div className="dash-card">
          <div className="dash-empty">
            <span>🎯</span><p>No budgets set for this month</p>
            <button className="appl-btn appl-btn--primary" onClick={openNew}>Create your first budget</button>
          </div>
        </div>
      ) : (
        <div className="budget-grid">
          {budgets.map(b => {
            const s   = spent[b.category]||0
            const pct = Math.min((s/b.limit)*100,100)
            const over= s>b.limit
            return (
              <div key={b._id} className={`budget-card${over?' budget-card--over':''}`} id={`budget-${b._id}`}>
                <div className="budget-card__top">
                  <div className="budget-card__icon">{CAT_ICONS[b.category]||'📦'}</div>
                  <div style={{display:'flex',gap:'0.4rem'}}>
                    <button className="appl-btn appl-btn--ghost exp-btn-sm" onClick={()=>openEdit(b)} id={`edit-budget-${b._id}`}>✏️</button>
                    <button className="appl-btn appl-btn--danger exp-btn-sm" onClick={()=>setDeleteId(b._id)} id={`del-budget-${b._id}`}>🗑️</button>
                  </div>
                </div>
                <h3 className="budget-card__category">{b.category}</h3>
                <div className="budget-card__amounts">
                  <span className={over?'budget-card__spent--over':'budget-card__spent'}>${s.toFixed(2)} spent</span>
                  <span className="budget-card__limit"> of ${b.limit}</span>
                </div>
                <div className="dash-progress" style={{margin:'0.75rem 0'}}>
                  <div className={`dash-progress__bar${over?' dash-progress__bar--over':''}`} style={{width:`${pct}%`}}/>
                </div>
                <div className="budget-card__footer">
                  <span className={`budget-card__pct${over?' budget-card__pct--over':''}`}>{pct.toFixed(0)}% used</span>
                  <span className={over?'budget-card__rem--over':'budget-card__rem'}>
                    {over?`$${(s-b.limit).toFixed(2)} over`:`$${(b.limit-s).toFixed(2)} left`}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&close()}>
          <div className="modal" id="budget-form-modal">
            <div className="modal__head">
              <h2 className="modal__title">{editId?'Edit Budget':'Add New Budget'}</h2>
              <button className="modal__close" onClick={close} id="close-budget-modal">✕</button>
            </div>
            {error&&<div className="form-error">{error}</div>}
            <form className="modal__form" onSubmit={handleSubmit} id="budget-form">
              <div className="form-group">
                <label htmlFor="bgt-category">Category</label>
                <select id="bgt-category" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} disabled={!!editId}>
                  {CATEGORIES.map(c=><option key={c} value={c}>{CAT_ICONS[c]} {c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="bgt-limit">Monthly Limit ($)</label>
                <input id="bgt-limit" type="number" placeholder="e.g. 500" min="1" value={form.limit} onChange={e=>setForm(f=>({...f,limit:e.target.value}))} required />
              </div>
              <div className="modal__actions">
                <button type="button" className="appl-btn appl-btn--ghost" onClick={close}>Cancel</button>
                <button type="submit" className="appl-btn appl-btn--primary" disabled={submitting} id="submit-budget-btn">
                  {submitting?'Saving…':editId?'Save Changes':'Add Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal modal--sm" id="delete-budget-modal">
            <div className="modal__head"><h2 className="modal__title">Delete Budget?</h2></div>
            <p style={{color:'#475569',margin:'0 0 1.5rem',fontSize:'0.9rem'}}>This cannot be undone.</p>
            <div className="modal__actions">
              <button className="appl-btn appl-btn--ghost" onClick={()=>setDeleteId(null)}>Cancel</button>
              <button className="appl-btn appl-btn--danger" onClick={handleDelete} id="confirm-delete-budget-btn">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
