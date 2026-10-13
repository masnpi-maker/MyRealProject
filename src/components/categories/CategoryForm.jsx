import { useState } from 'react'
import { validateCategory } from '../../utils/taskUtils.js'

export const CATEGORY_COLORS = [
  { color: '#8B5CF6', name: 'Violetinė' }, { color: '#E879F9', name: 'Rožinė' },
  { color: '#3B82F6', name: 'Mėlyna' }, { color: '#22C55E', name: 'Žalia' },
  { color: '#F97316', name: 'Oranžinė' }, { color: '#EF4444', name: 'Raudona' },
  { color: '#EAB308', name: 'Geltona' },
]

export function CategoryForm({ initial, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name || '')
  const [color, setColor] = useState(initial?.color || CATEGORY_COLORS[0].color)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit(event) {
    event.preventDefault()
    const errors = validateCategory({ name, color })
    if (Object.keys(errors).length) { setError(Object.values(errors)[0]); return }
    setError('')
    setSaving(true)
    try { await onSubmit({ name: name.trim(), color }) }
    catch (err) { setError(err.message || 'Kategorijos išsaugoti nepavyko.') }
    finally { setSaving(false) }
  }

  return <form className="category-form" onSubmit={submit} noValidate>
    <label>Kategorijos pavadinimas<input autoFocus name="category-name" value={name} onChange={event => setName(event.target.value)} maxLength={60} aria-invalid={!!error} placeholder="Pvz., Darbas"/></label>
    <fieldset className="color-field"><legend>Spalva</legend><div className="color-options">{CATEGORY_COLORS.map(option => <label className="color-option" key={option.color} title={option.name}><input type="radio" name="category-color" value={option.color} checked={color === option.color} onChange={() => setColor(option.color)}/><span style={{ backgroundColor: option.color }} aria-hidden="true"/><small>{option.name}</small></label>)}</div></fieldset>
    {error && <p className="field-error" role="alert">{error}</p>}
    <div className="form-actions"><button className="button primary" disabled={saving}>{saving ? 'Saugoma…' : initial ? 'Išsaugoti' : 'Sukurti kategoriją'}</button><button type="button" className="button ghost" onClick={onCancel} disabled={saving}>Atšaukti</button></div>
  </form>
}
