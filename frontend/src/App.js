// // import logo from './logo.svg';
// // import './App.css';

// // function App() {
// //   return (
// //     <div className="App">
// //       <header className="App-header">
// //         <img src={logo} className="App-logo" alt="logo" />
// //         <p>
// //           Edit <code>src/App.js</code> and save to reload.
// //         </p>
// //         <a
// //           className="App-link"
// //           href="https://reactjs.org"
// //           target="_blank"
// //           rel="noopener noreferrer"
// //         >
// //           Learn React
// //         </a>
// //       </header>
// //     </div>
// //   );
// // }

// // export default App;
// import React from 'react';
// import TaskForm from './components /TaskForm';
// import TaskList from './components /TaskList';

// function App() {
//     return (
//         <div style={{ padding: '20px' }}>
//             <h1>🎓 Student Task Manager</h1>
//             <TaskForm />
//             <hr />
//             <TaskList />
//         </div>
//     );
// }

// export default App;
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
// import Login from './components/Login';
import Login from './components /Login';
import Register from './components /Register';
import TasksPage from './components /TaskPage';
import Logout from './components /Logout';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

//   useEffect(() => {
//     // if (!localStorage.getItem('token')) {
//     //   window.location.href = '/login';
//     // }
//     const handleStorageChange = () => {
//       setIsAuthenticated(!!localStorage.getItem('token'));
//     };
//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

useEffect(() => {
  if (!localStorage.getItem('token')) {
    localStorage.removeItem('token'); // Redundant, but safe
    setIsAuthenticated(false);
  } else {
    setIsAuthenticated(true);
  }

  const handleStorageChange = () => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  };

  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}, []);

  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/tasks" /> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={isAuthenticated ? <TasksPage /> : <Navigate to="/login" />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
};

export default App;