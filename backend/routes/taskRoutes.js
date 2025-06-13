// const express = require('express');
// const Task = require('../models/Task');

// const router = express.Router();

// // Add a new task
// router.post('/add', async (req, res) => {
//     try {
//         const task = new Task(req.body);
//         await task.save();
//         res.status(201).json(task);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // Get all tasks
// router.get('/all', async (req, res) => {
//     try {
//         const tasks = await Task.find();
//         res.status(200).json(tasks);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// module.exports = router;
// const express = require('express');
// const Task = require('../models/Task');
// const jwt = require('jsonwebtoken');
// const JWT_SECRET = process.env.JWT_SECRET;
// const router = express.Router();

// Add a new task
// router.post('/add', async (req, res) => {
//     try {
//         const task = new Task(req.body);
//         await task.save();
//         res.status(201).json(task);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });
// router.post('/add', async (req, res) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'Unauthorized' });

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     const userId = decoded.userId;

//     const newTask = new Task({ ...req.body, user: userId });
//     await newTask.save();
//     res.status(201).json(newTask);
//   } catch (err) {
//     res.status(400).json({ message: 'Invalid token' });
//   }
// });

// router.post('/add', async (req, res) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) return res.status(401).json({ message: 'No token provided' });

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     const userId = decoded.userId;

//     const newTask = new Task({
//       ...req.body,
//       user: userId
//     });

//     await newTask.save();
//     res.status(201).json({ message: 'Task added successfully', task: newTask });
//   } catch (error) {
//     console.error('Task creation error:', error.message);
//     res.status(500).json({ message: 'Failed to add task' });
//   }
// });

// module.exports = router;


// Get all tasks and auto-update overdue pending ones to "Missing"
// router.get('/all', async (req, res) => {
//     try {
//         const now = new Date();
//         await Task.updateMany(
//             { deadline: { $lt: now }, status: "Pending" },
//             { $set: { status: "Missing" } }
//         );

//         const tasks = await Task.find();
//         res.status(200).json(tasks);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// router.get('/all', async (req, res) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'Unauthorized' });

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     const userId = decoded.userId;

//     const tasks = await Task.find({ user: userId });
//     res.json(tasks);
//   } catch (err) {
//     res.status(400).json({ message: 'Invalid token' });
//   }
// });

// // Mark task as done (Completed or Done Late)
// router.put('/update-status/:id', async (req, res) => {
//     try {
//         const task = await Task.findById(req.params.id);
//         if (!task) return res.status(404).json({ message: "Task not found" });

//         const currentDate = new Date();
//         const deadlineDate = new Date(task.deadline);
//         task.submissionDate = currentDate;

//         task.status = currentDate > deadlineDate ? "Done Late" : "Completed";

//         await task.save();
//         res.status(200).json(task);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // Revert task to Pending
// router.put('/reset-status/:id', async (req, res) => {
//     try {
//         const task = await Task.findById(req.params.id);
//         if (!task) return res.status(404).json({ message: "Task not found" });

//         task.status = "Pending";
//         task.submissionDate = null;

//         await task.save();
//         res.status(200).json(task);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });


// // ✅ Custom dropdown status update
// router.put('/custom-status/:id', async (req, res) => {
//     const { newStatus } = req.body;
//     try {
//         const task = await Task.findById(req.params.id);
//         if (!task) return res.status(404).json({ message: "Task not found" });

//         task.status = newStatus;
//         await task.save();

//         res.status(200).json({ message: "Status updated", task });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // Revert task to Pending
// // Revert task to Pending
// router.put('/reset-status/:id', async (req, res) => {
//     try {
//         const task = await Task.findById(req.params.id);
//         if (!task) return res.status(404).json({ message: "Task not found" });

//         task.status = "Pending";
//         task.submissionDate = null;

//         await task.save();
//         res.status(200).json(task);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });


// module.exports = router;
const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/add', auth, async (req, res) => {
  const task = new Task({ ...req.body, userId: req.userId });
  await task.save();
  res.status(201).json(task);
});

router.get('/all', auth, async (req, res) => {
  await Task.updateMany(
    { userId: req.userId, deadline: { $lt: new Date() }, status: "Pending" },
    { status: "Missing" }
  );
  const tasks = await Task.find({ userId: req.userId });
  res.json(tasks);
});

router.put('/update-status/:id', auth, async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
  if (!task) return res.status(404).json({ message: "Not found" });
  task.submissionDate = new Date();
  task.status = task.submissionDate > new Date(task.deadline) ? "Done Late" : "Completed";
  await task.save();
  res.json(task);
});

router.put('/reset-status/:id', auth, async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
  if (!task) return res.status(404).json({ message: "Not found" });
  task.submissionDate = null;
  task.status = "Pending";
  await task.save();
  res.json(task);
});

module.exports = router;