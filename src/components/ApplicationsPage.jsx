// useState remembers values; useEffect runs code at set moments, like when the page first appears
import { useEffect, useState } from "react";
// The shared connection to our database and login service
import { supabase } from "../lib/supabaseClient";
import ApplicationForm from "./ApplicationForm";
import ApplicationList from "./ApplicationList";
import { STATUSES } from "../constants";

// The main page. It owns the data and talks to the database, and hands
// the pieces to the form and the list to display.
export default function ApplicationsPage() {
  // The page remembers: the full list from the database, whether it's still
  // loading, any loading error, and any error from deleting
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  // Which application is being edited (null means the form is in "add" mode)
  const [editingApp, setEditingApp] = useState(null);
  // The user's current choices from the two dropdowns
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("added");

  // Loads the applications from the database, newest first. Row-level security
  // in the database means only the logged-in user's own rows come back.
  async function fetchApplications() {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setError(null);
      setApplications(data);
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    // Ask first, because deleting can't be undone
    const confirmed = window.confirm(
      "Delete this application? This cannot be undone.",
    );
    if (!confirmed) return;

    setActionError(null);

    const { error } = await supabase.from("applications").delete().eq("id", id);

    if (error) {
      setActionError(error.message);
      return;
    }

    // Reload the list so the deleted row disappears from the screen
    fetchApplications();
  }

  // Called by the form after a successful save: leave edit mode and refresh the list
  function handleSaved() {
    setEditingApp(null);
    fetchApplications();
  }

  // Load the list once, when the page first appears (the empty [] means "only once")
  useEffect(() => {
    fetchApplications();
  }, []);

  // Filtering and sorting happen here in the browser, on the list we already
  // loaded, so changing a dropdown doesn't need another trip to the database.
  const filteredApplications = applications.filter((app) =>
    statusFilter === "All" ? true : app.status === statusFilter,
  );

  const visibleApplications =
    sortBy === "deadline"
      ? // [...list] makes a copy first, because sort() would otherwise change the original
        [...filteredApplications].sort((a, b) => {
          // Applications with no deadline go to the bottom
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          // Dates like "2026-11-05" sort correctly as plain text
          return a.deadline.localeCompare(b.deadline);
        })
      : filteredApplications;

  return (
    <div>
      {/* The "key" makes React build a fresh form whenever we switch between
          adding and editing different applications, so the boxes refill with
          the right values. Without it, the old typed values would stay. */}
      <ApplicationForm
        key={editingApp ? editingApp.id : "new"}
        editingApp={editingApp}
        onSaved={handleSaved}
        onCancel={() => setEditingApp(null)}
      />
      {actionError && <p>Error: {actionError}</p>}

      {/* Filter applications by status. Controlled input: React state (statusFilter)
    is the single source of truth for the selected value. */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        {/* "All" is a filter value meaning "don't filter", not a real status,
      so it's hardcoded here instead of living in STATUSES or the database. */}
        <option value="All">All</option>

        {/* Options come from the shared STATUSES constant so the filter and the
      form can't drift apart when a status is added or renamed. */}
        {STATUSES.map((status) => (
          // key lets React track each item between renders; statuses are unique
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      {/* Sort order for the list. Sorting happens in the browser on the already-filtered
    applications, so changing it doesn't trigger a new database request. */}
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="added">Newest first</option>
        <option value="deadline">Deadline (soonest first)</option>
      </select>

      {/* The list only displays; clicking Edit or Delete calls back into this page */}
      <ApplicationList
        applications={visibleApplications}
        loading={loading}
        error={error}
        onDelete={handleDelete}
        onEdit={setEditingApp}
      />
    </div>
  );
}
