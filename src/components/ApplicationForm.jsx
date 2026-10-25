// Lets this form remember what the user has typed
import { useState } from "react";
// The shared connection to our database and login service
import { supabase } from "../lib/supabaseClient";
// The list of allowed statuses, kept in one place
import { STATUSES } from "../constants";

// A form used for both adding a new application and editing an existing one.
// It receives: the application being edited (empty when adding a new one),
// and two functions from the parent page to call when the user saves or cancels.
export default function ApplicationForm({ editingApp, onSaved, onCancel }) {
  // What the form remembers. When editing, each box starts filled with the
  // existing value; when adding, it starts empty ("??" means "or else use this").
  const [company, setCompany] = useState(editingApp?.company ?? "");
  const [role, setRole] = useState(editingApp?.role ?? "");
  const [status, setStatus] = useState(editingApp?.status ?? "Yet to apply");
  const [deadline, setDeadline] = useState(editingApp?.deadline ?? "");
  const [dateApplied, setDateApplied] = useState(
    editingApp?.date_applied ?? "",
  );
  const [notes, setNotes] = useState(editingApp?.notes ?? "");
  // A message to show if saving fails, and whether we're waiting for a reply
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Runs when the user presses the save button
  async function handleSubmit(e) {
    e.preventDefault(); // stops the browser from refreshing the page
    setSaving(true);
    setError(null);

    // Gather everything typed into one object, matching the database column names.
    // Empty optional boxes are sent as null ("no value") because the database
    // would reject an empty piece of text in a date column.
    const fields = {
      company,
      role,
      status,
      deadline: deadline || null,
      date_applied: dateApplied || null,
      notes: notes || null,
    };

    // If we're editing, update the one row with this application's id.
    // Otherwise, add a brand new row.
    const { error } = editingApp
      ? await supabase
          .from("applications")
          .update(fields)
          .eq("id", editingApp.id)
      : await supabase.from("applications").insert(fields);

    setSaving(false);

    // If the database reported a problem, show it and stop here
    if (error) {
      setError(error.message);
      return;
    }

    // Success: empty the form, then tell the parent page so it can refresh the list
    setCompany("");
    setRole("");
    setStatus("Yet to apply");
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
        {/* "required" stops the form being submitted while this is empty */}
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
        {/* One dropdown option is created for each status in the list */}
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

      {/* Disabled while saving, so the user can't click twice */}
      <button type="submit" disabled={saving}>
        {saving ? 'Saving…' : editingApp ? 'Save changes' : 'Add application'}
      </button>
      {/* Cancel only makes sense when editing, so it's hidden when adding */}
      {editingApp && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}