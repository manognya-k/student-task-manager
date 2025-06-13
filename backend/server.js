// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// app.use(express.json());
// app.use(cors());

// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => console.log("MongoDB Connected"))
//   .catch(err => console.log(err));

// app.get("/", (req, res) => res.send("Backend is Running"));

// app.listen(5000, () => console.log("Server running on port 5000"));

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/tasks', taskRoutes);

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
  // .then(() => console.log("✅ MongoDB Connected"))
  // .catch(err => console.error("❌ MongoDB Error:", err));
  app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
const { PythonShell } = require('python-shell');

// 🔧 Make sure this route works
// app.get("/", (req, res) => {
//   res.status(200).send("✅ Backend is Running Properly");
// });
app.post('/predict-deadline', (req, res) => {
    let options = {
        mode: 'text',
        pythonPath: 'python3',
        scriptPath: './ml_models',
        args: [req.body.days_left]
    };
PythonShell.run('predict_deadline.py', options, (err, results) => {
        if (err) res.status(500).json({ error: err });
        else res.json({ prediction: results[0] });
        });
});
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
// app.listen(8080, () => {
//   console.log("🚀 Server running on http://localhost:5000");
// });
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});