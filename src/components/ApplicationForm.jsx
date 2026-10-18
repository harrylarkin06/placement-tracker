import { useState } from "react";
import { supabase } from "../lib/supabaseClient"; // match your path
import { STATUSES } from "../constants";

export default function ApplicationForm({ editingApp, onSaved, onCancel }) {
  const [company, setCompany] = useState(editingApp?.company ?? "");
  const [role, setRole] = useState(editingApp?.role ?? "");
  const [status, setStatus] = useState(editingApp?.status ?? "Applied");
  const [deadline, setDeadline] = useState(editingApp?.deadline ?? "");
  const [dateApplied, setDateApplied] = useState(
    editingApp?.date_applied ?? "",
  );
  const [notes, setNotes] = useState(editingApp?.notes ?? "");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const fields = {
      company,
      role,
      status,
      deadline: deadline || null,
      date_applied: dateApplied || null,
      notes: notes || null,
    };

    const { error } = editingApp
      ? await supabase
          .from("applications")
          .update(fields)
          .eq("id", editingApp.id)
      : await supabase.from("applications").insert(fields);

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    setCompany("");
    setRole("");
    setStatus("Applied");
    setDeadline("");
    setDateApplied("");
    setNotes("");
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{editingApp ? "Edit application" : "Add application"}</h2>

      <div>
        <label>Company </label>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Role </label>
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Status </label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Deadline </label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </div>

      <div>
        <label>Date applied </label>
        <input
          type="date"
          value={dateApplied}
          onChange={(e) => setDateApplied(e.target.value)}
        />
      </div>

      <div>
        <label>Notes </label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      {error && <p>Error: {error}</p>}

      <button type="submit" disabled={saving}>
        {saving ? 'Saving…' : editingApp ? 'Save changes' : 'Add application'}
      </button>
      {editingApp && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}
