// // 
// import { useState } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// export default function TaskForm() {
//   const [task, setTask] = useState({
//     title: '',
//     description: '',
//     deadline: ''
//   });

//   const handleChange = (e) => {
//     setTask({ ...task, [e.target.name]: e.target.value });
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();

//     try {
//     //   const token = localStorage.getItem('token');
//     //   if (!token) return toast.error('Please log in first');

//     //   // 🔁 Send task to backend API
//     //   const res = await axios.post(`${process.env.REACT_APP_API}/tasks/add`, task, {
//     //     headers: {
//     //       Authorization: `Bearer ${token}`
//     //     }
//     //   });
//     const token = localStorage.getItem('token');
// await axios.post(`${process.env.REACT_APP_API}/tasks/add`, task, {
//   headers: {
//     Authorization: `Bearer ${token}`
//   }
// });


//       toast.success("✅ Task Added");
//       setTask({ title: '', description: '', deadline: '' });
//     } catch (err) {
//       console.error(err.response?.data || err);
//       toast.error("❌ Failed to add task");
//     }
//   };

//   return (
//     <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//       <input
//         type="text"
//         name="title"
//         placeholder="Title"
//         value={task.title}
//         onChange={handleChange}
//         required
//       />
//       <textarea
//         name="description"
//         placeholder="Description"
//         value={task.description}
//         onChange={handleChange}
//         required
//       />
//       <input
//         type="date"
//         name="deadline"
//         value={task.deadline}
//         onChange={handleChange}
//         required
//       />
//       <button type="submit">Add Task</button>
//     </form>
//   );
// }

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './styles.css'

export default function TaskForm() {
  const [task, setTask] = useState({ title:'', description:'', deadline:'' });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API}/tasks/add`, task, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Task added");
      setTask({ title:'', description:'', deadline:'' });
    } catch {
      toast.error("Add failed");
    }
  };

//   return (
//     <form onSubmit={onSubmit}>
//       <input required placeholder="Title" value={task.title} onChange={e => setTask(s => ({...s,title:e.target.value}))} />
//       <textarea required placeholder="Description" value={task.description} onChange={e => setTask(s => ({...s,description:e.target.value}))} />
//       <input required type="date" value={task.deadline} onChange={e => setTask(s => ({...s,deadline:e.target.value}))} />
//       <button>Add Task</button>
//     </form>
//   );
return (
  <div className="task-form">
    <form onSubmit={onSubmit}>
      <input
        required
        placeholder="Title"
        value={task.title}
        onChange={e => setTask(s => ({ ...s, title: e.target.value }))}
      />
      <textarea
        required
        placeholder="Description"
        value={task.description}
        onChange={e => setTask(s => ({ ...s, description: e.target.value }))}
      />
      <input
        required
        type="date"
        value={task.deadline}
        onChange={e => setTask(s => ({ ...s, deadline: e.target.value }))}
      />
      <button>Add Task</button>
    </form>
  </div>
);
}