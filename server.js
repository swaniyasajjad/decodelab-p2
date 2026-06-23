/**
 * server.js
 * -----------------------------------------
 * DecodeLabs Industrial Training Kit - Project 2
 * Backend API Development
 *
 * Goal: Develop a simple backend API to handle application logic.
 *
 * This is the entry point that wires everything together:
 * routes -> controllers -> data, with middleware for validation
 * and centralized error handling.
 */

const express = require("express");
const path = require("path");
const taskRoutes = require("./routes/taskRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// Parses incoming JSON request bodies into req.body
app.use(express.json());

// Simple request logger -- helpful while developing/debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Serves the demo frontend (public/index.html) at "/".
// This is a thin client only -- all real logic stays in the backend,
// per the brief's emphasis on API logic over "visual flair."
app.use(express.static(path.join(__dirname, "public")));

// JSON info route -- quick sanity check / API reference, moved off "/"
// since the frontend now lives there. Useful for grading/demoing the
// raw API without the UI in the way.
app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DecodeLabs Task API is running.",
    endpoints: {
      "GET /tasks": "List all tasks (optional ?completed=true|false)",
      "GET /tasks/:id": "Get a single task by id",
      "POST /tasks": "Create a new task (requires x-api-key if REQUIRE_API_KEY=true)",
      "PUT /tasks/:id": "Update an existing task (requires x-api-key if REQUIRE_API_KEY=true)",
      "PATCH /tasks/:id/complete": "Toggle or set a task's completed status",
      "DELETE /tasks/:id": "Delete a task (requires x-api-key if REQUIRE_API_KEY=true)",
    },
  });
});

// Mount all /tasks routes
app.use("/tasks", taskRoutes);

// 404 handler -- catches any route that doesn't match above
app.use(notFoundHandler);

// Centralized error handler -- catches anything unexpected (500s)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`   Frontend demo:  http://localhost:${PORT}/`);
  console.log(`   API reference:  http://localhost:${PORT}/api`);
});

module.exports = app;
