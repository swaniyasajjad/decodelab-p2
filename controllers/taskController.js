/**
 * controllers/taskController.js
 * -----------------------------------------
 * Contains the actual application logic ("the brain").
 * Routes call these functions; these functions never deal
 * with raw Express plumbing beyond req/res.
 */

const { tasks, getNextId } = require("../data/tasks");

// GET /tasks
// Returns the full list of tasks. Supports optional ?completed=true/false filter.
function getAllTasks(req, res) {
  const { completed } = req.query;

  let result = tasks;

  if (completed !== undefined) {
    const isCompleted = completed === "true";
    result = tasks.filter((task) => task.completed === isCompleted);
  }

  res.status(200).json({
    success: true,
    count: result.length,
    data: result,
  });
}

// GET /tasks/:id
// Returns a single task by id, or 404 if it doesn't exist.
function getTaskById(req, res) {
  const task = tasks.find((t) => t.id === req.taskId);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: `Task with id ${req.taskId} not found.`,
    });
  }

  res.status(200).json({
    success: true,
    data: task,
  });
}

// POST /tasks
// Creates a new task. Body already validated by middleware.
function createTask(req, res) {
  const { title, description, completed } = req.body;

  const newTask = {
    id: getNextId(),
    title: title.trim(),
    description: description ? description.trim() : "",
    completed: completed ?? false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);

  // 201 Created -- a new resource now exists at this URL.
  res.status(201).json({
    success: true,
    message: "Task created successfully.",
    data: newTask,
  });
}

// PUT /tasks/:id
// Replaces/updates an existing task. Body already validated by middleware.
function updateTask(req, res) {
  const task = tasks.find((t) => t.id === req.taskId);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: `Task with id ${req.taskId} not found.`,
    });
  }

  const { title, description, completed } = req.body;

  task.title = title.trim();
  task.description = description !== undefined ? description.trim() : task.description;
  task.completed = completed !== undefined ? completed : task.completed;

  res.status(200).json({
    success: true,
    message: "Task updated successfully.",
    data: task,
  });
}

// DELETE /tasks/:id
// Removes a task. Returns 204 No Content on success (nothing to send back).
function deleteTask(req, res) {
  const index = tasks.findIndex((t) => t.id === req.taskId);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Task with id ${req.taskId} not found.`,
    });
  }

  tasks.splice(index, 1);

  res.status(204).send();
}

// PATCH /tasks/:id/complete
// Toggles a task's "completed" flag. If a "completed" boolean is
// provided in the body, sets it explicitly; otherwise flips the
// current value. A narrower, more targeted update than PUT.
function toggleTaskCompletion(req, res) {
  const task = tasks.find((t) => t.id === req.taskId);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: `Task with id ${req.taskId} not found.`,
    });
  }

  const { completed } = req.body || {};

  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "completed must be a boolean (true/false) if provided.",
    });
  }

  task.completed = completed !== undefined ? completed : !task.completed;

  res.status(200).json({
    success: true,
    message: `Task marked as ${task.completed ? "completed" : "incomplete"}.`,
    data: task,
  });
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
};
