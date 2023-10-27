const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const tasks = [];

// Create a new task
app.post('/tasks', (req, res) => {
  const {
    title,
    description,
    assignee,
    reporter,
    created_date,
    due_date,
    time_logged,
    comments,
    status,
    priority
  } = req.body;

  if (!title || !assignee || !reporter || !created_date || !due_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newTask = {
    id: uuid.v4(),
    title,
    description,
    assignee,
    reporter,
    created_date,
    due_date,
    time_logged: time_logged || 0,
    comments: comments || [],
    status: status || 'Open',
    priority: priority || 'Medium',
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Get a task by ID
app.get('/tasks/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json(task);
});

// Update a task by ID
app.put('/tasks/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  const updatedTask = req.body;
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
  res.json(tasks[taskIndex]);
});

// Delete a task by ID
app.delete('/tasks/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];
  res.json(deletedTask);
});

app.listen(port, () => {
  console.log(`Task Microservice is running on port ${port}`);
});
