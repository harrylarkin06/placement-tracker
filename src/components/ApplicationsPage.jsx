import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient"; // match your path
import ApplicationForm from "./ApplicationForm";
import ApplicationList from "./ApplicationList";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchApplications() {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setApplications(data);
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Delete this application? This cannot be undone.",
    );
    if (!confirmed) return;

    const { error } = await supabase.from("applications").delete().eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    fetchApplications();
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div>
      <ApplicationForm onSaved={fetchApplications} />
      <ApplicationList
        applications={applications}
        loading={loading}
        error={error}
        onDelete={handleDelete}
      />
    </div>
  );
}
