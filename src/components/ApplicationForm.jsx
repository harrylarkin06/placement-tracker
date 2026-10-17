import { useState } from 'react'
import { supabase } from '../lib/supabaseClient' // match your path
import { STATUSES } from '../constants'

export default function ApplicationForm({ onSaved }) {
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('Applied')
  const [deadline, setDeadline] = useState('')
  const [dateApplied, setDateApplied] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const { error } = await supabase.from('applications').insert({
      company,
      role,
      status,
      deadline: deadline || null,
      date_applied: dateApplied || null,
      notes: notes || null,
    })

    setSaving(false)

    if (error) {
      setError(error.message)
      return
    }

    setCompany('')
    setRole('')
    setStatus('Applied')
    setDeadline('')
    setDateApplied('')
    setNotes('')
    onSaved()
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add application</h2>

      <div>
        <label>Company </label>
        <input value={company} onChange={(e) => setCompany(e.target.value)} required />
      </div>

      <div>
        <label>Role </label>
        <input value={role} onChange={(e) => setRole(e.target.value)} required />
      </div>

      <div>
        <label>Status </label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Deadline </label>
        <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
      </div>

      <div>
        <label>Date applied </label>
        <input type="date" value={dateApplied} onChange={(e) => setDateApplied(e.target.value)} />
      </div>

      <div>
        <label>Notes </label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      {error && <p>Error: {error}</p>}

      <button type="submit" disabled={saving}>
        {saving ? 'Saving…' : 'Add application'}
      </button>
    </form>
  )
}