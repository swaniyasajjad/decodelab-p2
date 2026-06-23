/**
 * middleware/validateTask.js
 * -----------------------------------------
 * "The Gatekeeper Rule: Never Trust the Client."
 *
 * This middleware runs BEFORE the controller logic touches the data.
 * It performs basic syntactic + semantic validation on incoming
 * task data so malformed requests never reach our "brain" (the logic layer).
 */

function validateTaskInput(req, res, next) {
  const { title, description, completed } = req.body;

  const errors = [];

  // --- Syntactic validation: is the format correct? ---
  if (req.body === undefined || typeof req.body !== "object") {
    return res.status(400).json({
      success: false,
      message: "Request body must be a valid JSON object.",
    });
  }

  if (title === undefined || title === null || title === "") {
    errors.push("title is required and cannot be empty.");
  } else if (typeof title !== "string") {
    errors.push("title must be a string.");
  } else if (title.trim().length < 3) {
    errors.push("title must be at least 3 characters long.");
  }

  if (description !== undefined && typeof description !== "string") {
    errors.push("description must be a string.");
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    errors.push("completed must be a boolean (true/false).");
  }

  // --- Semantic validation: is the logic valid? ---
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors,
    });
  }

  // Request passed the gatekeeper -- continue to the controller.
  next();
}

/**
 * Validates that :id route params are actually numbers before
 * we waste time searching the data store with garbage input.
 */
function validateIdParam(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid task id. ID must be a positive integer.",
    });
  }

  req.taskId = id;
  next();
}

module.exports = {
  validateTaskInput,
  validateIdParam,
};
