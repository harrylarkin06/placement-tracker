import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient"; // match your path
import ApplicationForm from "./ApplicationForm";
import ApplicationList from "./ApplicationList";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingApp, setEditingApp] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");

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

    fetchApplications();
  }

  function handleSaved() {
    setEditingApp(null);
    fetchApplications();
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  const visibleApplications = applications.filter((app) =>
    statusFilter === "All" ? true : app.status === statusFilter,
  );

  return (
    <div>
      <ApplicationForm
        key={editingApp ? editingApp.id : "new"}
        editingApp={editingApp}
        onSaved={handleSaved}
        onCancel={() => setEditingApp(null)}
      />
      {actionError && <p>Error: {actionError}</p>}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Applied">Applied</option>
        <option value="Online Assessment">Online Assessment</option>
        <option value="Interview">Interview</option>
        <option value="Offer">Offer</option>
        <option value="Rejected">Rejected</option>
      </select>
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
