// import { useEffect, useState } from 'react'
// import { supabase } from '../lib/supabaseClient'

// export default function ApplicationList() {
//   const [applications, setApplications] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     async function fetchApplications() {
//       const { data, error } = await supabase
//         .from('applications')
//         .select('*')
//         .order('created_at', { ascending: false })

//       if (error) {
//         setError(error.message)
//       } else {
//         setApplications(data)
//       }
//       setLoading(false)
//     }

//     fetchApplications()
//   }, [])

//   if (loading) return <p>Loading…</p>
//   if (error) return <p>Error: {error}</p>
//   if (applications.length === 0) return <p>No applications yet.</p>

//   return (
//     <ul>
//       {applications.map((app) => (
//         <li key={app.id}>
//           <strong>{app.company}</strong> — {app.role} ({app.status})
//           {app.deadline && <span> · Deadline: {app.deadline}</span>}
//         </li>
//       ))}
//     </ul>
//   )
// }

export default function ApplicationList({ applications, loading, error, onDelete }) {
  if (loading) return <p>Loading…</p>
  if (error) return <p>Error: {error}</p>
  if (applications.length === 0) return <p>No applications yet.</p>

  return (
    <ul>
      {applications.map((app) => (
        <li key={app.id}>
          <strong>{app.company}</strong> — {app.role} ({app.status})
          {app.deadline && <span> · Deadline: {app.deadline}</span>}
          {' '}
          <button onClick={() => onDelete(app.id)}>Delete</button>
        </li>
      ))}
    </ul>
  )
}