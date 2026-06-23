/**
 * routes/taskRoutes.js
 * -----------------------------------------
 * "Resources are Nouns. Methods are Verbs."
 *
 * Notice: the URL is always /tasks (a noun). The HTTP method
 * (GET, POST, PUT, DELETE) is what defines the action -- never
 * the URL itself. No /getTasks or /createTask here.
 */

const express = require("express");
const router = express.Router();

const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
} = require("../controllers/taskController");

const {
  validateTaskInput,
  validateIdParam,
} = require("../middleware/validateTask");

const apiKeyAuth = require("../middleware/apiKeyAuth");

// --- Read endpoints: public, no API key required ---

// GET /tasks            -> fetch all tasks (supports ?completed=true/false)
router.get("/", getAllTasks);

// GET /tasks/:id        -> fetch a single task
router.get("/:id", validateIdParam, getTaskById);

// --- Write endpoints: protected by apiKeyAuth (off by default, see middleware/apiKeyAuth.js) ---

// POST /tasks           -> create a new task
router.post("/", apiKeyAuth, validateTaskInput, createTask);

// PUT /tasks/:id        -> update an existing task
router.put("/:id", apiKeyAuth, validateIdParam, validateTaskInput, updateTask);

// PATCH /tasks/:id/complete -> toggle a task's completed status
// A focused, partial update -- doesn't require the full task body,
// just flips (or sets) the "completed" flag. Demonstrates handling
// a narrower slice of user input than a full PUT replace.
router.patch("/:id/complete", apiKeyAuth, validateIdParam, toggleTaskCompletion);

// DELETE /tasks/:id     -> delete a task
router.delete("/:id", apiKeyAuth, validateIdParam, deleteTask);

module.exports = router;
