import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import AppLayout from '../components/layout/AppLayout'
import '../pages/Dashboard.css'
import './Expenses.css'

const API = 'http://localhost:5000/api'
const CATEGORIES = ['Food','Transport','Shopping','Entertainment','Health','Utilities','Housing','Education','Travel','Other']
const CAT_ICONS  = { Food:'🍔',Transport:'🚗',Shopping:'🛍️',Entertainment:'🎬',Health:'💊',Utilities:'⚡',Housing:'🏠',Education:'📚',Travel:'✈️',Other:'📦' }
const EMPTY = { title:'', amount:'', category:'Food', date: new Date().toISOString().split('T')[0], note:'' }

export default function Expenses() {
  const { token } = useAuth()
  const [expenses, setExpenses]     = useState([])
  const [loading,  setLoading]      = useState(true)
  const [showForm, setShowForm]     = useState(false)
  const [form,     setForm]         = useState(EMPTY)
  const [editId,   setEditId]       = useState(null)
  const [submitting,setSubmitting]  = useState(false)
  const [error,    setError]        = useState('')
  const [search,   setSearch]       = useState('')
  const [filterCat,setFilterCat]   = useState('All')
  const [deleteId, setDeleteId]     = useState(null)

  const headers = { Authorization:`Bearer ${token}`, 'Content-Type':'application/json' }

  const load = async () => {
    try {
      const res = await fetch(`${API}/expenses`, { headers })
      const d   = await res.json()
      if (Array.isArray(d)) setExpenses(d)
    } catch { setError('Failed to load') }
    finally { setLoading(false) }
  }
  useEffect(() => { if (token) load() }, [token])

  const filtered = expenses
    .filter(e => (filterCat==='All' || e.category===filterCat) && e.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => new Date(b.date)-new Date(a.date))

  const openEdit = e => { setForm({ title:e.title, amount:e.amount, category:e.category, date:e.date?.split('T')[0]||'', note:e.note||'' }); setEditId(e._id); setShowForm(true); setError('') }
  const openNew  = () => { setForm(EMPTY); setEditId(null); setShowForm(true); setError('') }
  const close    = () => { setShowForm(false); setEditId(null); setForm(EMPTY); setError('') }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.title.trim()) return setError('Title is required')
    if (!form.amount || Number(form.amount)<=0) return setError('Enter a valid amount')
    setSubmitting(true); setError('')
    try {
      const res  = await fetch(editId?`${API}/expenses/${editId}`:`${API}/expenses`, {
        method: editId?'PUT':'POST', headers,
        body: JSON.stringify({...form, amount:Number(form.amount)}),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message||'Error')
      await load(); close()
    } catch(err) { setError(err.message) }
    finally { setSubmitting(false) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await fetch(`${API}/expenses/${deleteId}`, { method:'DELETE', headers })
    setExpenses(p => p.filter(e => e._id!==deleteId))
    setDeleteId(null)
  }

  if (loading) return <div className="app-loader-full"><div className="app-spinner"/><span>Loading…</span></div>

  return (
    <AppLayout
      title="Expenses"
      subtitle="Track and manage your spending"
      action={<button className="appl-btn appl-btn--primary" onClick={openNew} id="add-expense-btn">+ Add Expense</button>}
    >
      {/* Toolbar */}
      <div className="exp-toolbar">
        <div className="exp-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input id="expense-search" placeholder="Search expenses…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <div className="exp-filters">
          {['All',...CATEGORIES].map(c => (
            <button key={c} className={`exp-filter-btn${filterCat===c?' exp-filter-btn--active':''}`} onClick={()=>setFilterCat(c)} id={`filter-${c.toLowerCase()}`}>
              {c!=='All'?CAT_ICONS[c]:''} {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length>0 && (
        <div className="exp-summary">
          <span>{filtered.length} expense{filtered.length!==1?'s':''}</span>
          <span>Total: <strong>${filtered.reduce((s,e)=>s+e.amount,0).toFixed(2)}</strong></span>
        </div>
      )}

      {filtered.length===0 ? (
        <div className="dash-card" style={{marginTop:'0.5rem'}}>
          <div className="dash-empty">
            <span>💳</span>
            <p>{search||filterCat!=='All'?'No expenses match your filters':'No expenses yet'}</p>
            {!search&&filterCat==='All'&&<button className="appl-btn appl-btn--primary" onClick={openNew}>Add your first expense</button>}
          </div>
        </div>
      ) : (
        <div className="exp-table-wrap">
          <table className="exp-table" id="expense-table">
            <thead><tr><th>Expense</th><th>Category</th><th>Date</th><th>Amount</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e._id} id={`expense-row-${e._id}`}>
                  <td>
                    <div className="exp-table__title-cell">
                      <span className="exp-table__icon">{CAT_ICONS[e.category]||'📦'}</span>
                      <div>
                        <span className="exp-table__name">{e.title}</span>
                        {e.note&&<span className="exp-table__note">{e.note}</span>}
                      </div>
                    </div>
                  </td>
                  <td><span className="exp-badge">{e.category}</span></td>
                  <td className="exp-table__date">{new Date(e.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</td>
                  <td className="exp-table__amt">-${e.amount.toFixed(2)}</td>
                  <td>
                    <div className="exp-table__actions">
                      <button className="appl-btn appl-btn--ghost exp-btn-sm" onClick={()=>openEdit(e)} id={`edit-exp-${e._id}`}>✏️ Edit</button>
                      <button className="appl-btn appl-btn--danger exp-btn-sm" onClick={()=>setDeleteId(e._id)} id={`del-exp-${e._id}`}>🗑️ Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&close()}>
          <div className="modal" id="expense-form-modal">
            <div className="modal__head">
              <h2 className="modal__title">{editId?'Edit Expense':'Add New Expense'}</h2>
              <button className="modal__close" onClick={close} id="close-expense-modal">✕</button>
            </div>
            {error&&<div className="form-error">{error}</div>}
            <form className="modal__form" onSubmit={handleSubmit} id="expense-form">
              <div className="form-group">
                <label htmlFor="exp-title">Title</label>
                <input id="exp-title" placeholder="e.g. Grocery run" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="exp-amount">Amount ($)</label>
                  <input id="exp-amount" type="number" placeholder="0.00" min="0.01" step="0.01" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} required />
                </div>
                <div className="form-group">
                  <label htmlFor="exp-date">Date</label>
                  <input id="exp-date" type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="exp-category">Category</label>
                <select id="exp-category" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                  {CATEGORIES.map(c=><option key={c} value={c}>{CAT_ICONS[c]} {c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="exp-note">Note (optional)</label>
                <input id="exp-note" placeholder="Any extra details…" value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))} />
              </div>
              <div className="modal__actions">
                <button type="button" className="appl-btn appl-btn--ghost" onClick={close}>Cancel</button>
                <button type="submit" className="appl-btn appl-btn--primary" disabled={submitting} id="submit-expense-btn">
                  {submitting?'Saving…':editId?'Save Changes':'Add Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal modal--sm" id="delete-confirm-modal">
            <div className="modal__head"><h2 className="modal__title">Delete Expense?</h2></div>
            <p style={{color:'#475569',margin:'0 0 1.5rem',fontSize:'0.9rem'}}>This cannot be undone.</p>
            <div className="modal__actions">
              <button className="appl-btn appl-btn--ghost" onClick={()=>setDeleteId(null)}>Cancel</button>
              <button className="appl-btn appl-btn--danger" onClick={handleDelete} id="confirm-delete-btn">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
