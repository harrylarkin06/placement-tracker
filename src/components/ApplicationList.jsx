// A "display only" component: it shows the list it's given and doesn't fetch
// or change any data itself. It receives the applications to show, whether
// they're still loading, any error message, and two functions from the parent
// page to call when the user clicks Edit or Delete.
export default function ApplicationList({
  applications,
  loading,
  error,
  onDelete,
  onEdit,
}) {
  // Handle the "not a normal list" cases first. Returning early means
  // the list below only runs when there is something to show.
  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error}</p>;
  if (applications.length === 0) return <p>No applications to show.</p>;

  return (
    <ul>
      {/* Creates one list item for each application. The "key" is a unique id
          that lets React keep track of which item is which when the list changes. */}
      {applications.map((app) => (
        <li key={app.id}>
          <strong>{app.company}</strong> — {app.role} ({app.status})
          {/* The deadline is optional, so this only appears if one was entered */}
          {app.deadline && <span> · Deadline: {app.deadline}</span>}{" "}
          {/* The parent is told which application was clicked, and does the actual work */}
          <button onClick={() => onEdit(app)}>Edit</button>{" "}
          <button onClick={() => onDelete(app.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
