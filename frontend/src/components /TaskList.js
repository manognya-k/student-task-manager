// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const TaskList = () => {
//     const [tasks, setTasks] = useState([]);

//     useEffect(() => {
//         axios.get('http://localhost:4000/tasks/all')
//             .then(res => setTasks(res.data))
//             .catch(err => console.error(err));
//     }, []);

//     return (
//         <ul>
//             {tasks.map(task => (
//                 <li key={task._id}>
//                     <strong>{task.title}</strong> — {new Date(task.deadline).toLocaleDateString()} <br />
//                     <em>Status:</em> {task.status} | <em>Category:</em> {task.category}
//                 </li>
//             ))}
//         </ul>
//     );
// };

// export default TaskList;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const TaskList = () => {
//     const [tasks, setTasks] = useState([]);
//     const [filter, setFilter] = useState("All");

//     const fetchTasks = async () => {
//         try {
//             // const res = await axios.get('http://localhost:4000/tasks/all');
//             // setTasks(res.data);
//             const res = await axios.get('http://localhost:4000/tasks/all', {
//   headers: {
//     Authorization: `Bearer ${localStorage.getItem('token')}`
//   }
// });
//         } catch (err) {
//             console.error('Error fetching tasks:', err);
//         }
//     };

//     useEffect(() => {
//         fetchTasks();
//     }, []);

//     const handleCheckboxChange = async (taskId, currentStatus) => {
//         try {
//             if (currentStatus === "Completed" || currentStatus === "Done Late") {
//                 await axios.put(`http://localhost:4000/tasks/reset-status/${taskId}`);
//             } else {
//                 await axios.put(`http://localhost:4000/tasks/update-status/${taskId}`);
//             }
//             fetchTasks();
//         } catch (error) {
//             console.error("Error updating task:", error);
//         }
//     };

//     const filteredTasks = tasks.filter(task =>
//         filter === "All" ? true : task.status === filter
//     );

//     const statusStyles = {
//         "Pending": { color: "#FFA500", fontWeight: 'bold' },     // Orange
//         "Completed": { color: "#228B22", fontWeight: 'bold' },   // Green
//         "Done Late": { color: "#DAA520", fontWeight: 'bold' },   // Goldenrod
//         "Missing": { color: "#DC143C", fontWeight: 'bold' }      // Crimson
//     };

//     return (
//         <div>
//             <select value={filter} onChange={(e) => setFilter(e.target.value)}>
//                 <option value="All">All</option>
//                 <option value="Pending">Pending</option>
//                 <option value="Completed">Completed</option>
//                 <option value="Done Late">Done Late</option>
//                 <option value="Missing">Missing</option>
//             </select>

//             <ul>
//                 {filteredTasks.map(task => (
//                     <li key={task._id} style={{ marginBottom: '1rem' }}>
//                         <input
//                             type="checkbox"
//                             checked={task.status === "Completed" || task.status === "Done Late"}
//                             onChange={() => handleCheckboxChange(task._id, task.status)}
//                         />
//                         <strong style={{ marginLeft: '0.5rem' }}>{task.title}</strong> — {new Date(task.deadline).toLocaleDateString()}<br />
//                         <span style={statusStyles[task.status]}>
//                             <em>Status:</em> {task.status}
//                         </span>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default TaskList;
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");

  const load = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API}/tasks/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch {
      toast.error("Fetch failed");
    }
  };

  useEffect(() => { load(); }, []);

  const toggle = async (id, status) => {
    try {
      const token = localStorage.getItem('token');

      // ✅ Allow "Pending" and "Missing" to be marked as completed/late
      if (status === "Pending" || status === "Missing") {
        await axios.put(`${process.env.REACT_APP_API}/tasks/update-status/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // ✅ Unchecking should revert to "Pending"
        await axios.put(`${process.env.REACT_APP_API}/tasks/reset-status/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      load();
    } catch {
      toast.error("Update failed");
    }
  };

  const colors = {
    "Pending": "orange",
    "Completed": "green",
    "Done Late": "goldenrod",
    "Missing": "crimson"
  };

//   return (
//     <>
//       <select onChange={e => setFilter(e.target.value)} value={filter}>
//         <option>All</option>
//         <option>Pending</option>
//         <option>Completed</option>
//         <option>Done Late</option>
//         <option>Missing</option>
//       </select>
//       <ul>
//         {tasks
//           .filter(t => filter === "All" || t.status === filter)
//           .map(t => (
//             <li key={t._id}>
//               <input
//                 type="checkbox"
//                 checked={t.status === "Completed" || t.status === "Done Late"}
//                 onChange={() => toggle(t._id, t.status)}
//               />
//               <strong>{t.title}</strong> —{" "}
//               <span style={{ color: colors[t.status] }}>{t.status}</span>
//             </li>
//           ))}
//       </ul>
//     </>
//   );
return (
  <div className="task-list-container">
    <select
      className="task-filter"
      onChange={e => setFilter(e.target.value)}
      value={filter}
    >
      <option>All</option>
      <option>Pending</option>
      <option>Completed</option>
      <option>Done Late</option>
      <option>Missing</option>
    </select>

    {tasks
      .filter(t => filter === "All" || t.status === filter)
      .map(t => (
        <div key={t._id} className="task-item">
          <input
            type="checkbox"
            checked={t.status === "Completed" || t.status === "Done Late"}
            onChange={() => toggle(t._id, t.status)}
          />
          <div className="task-details">
            <div className="task-title">{t.title}</div>
            <div className={`task-status status-${t.status.replace(" ", "\\ ")}`}>
              {t.status}
            </div>
          </div>
        </div>
      ))}
  </div>
);
}