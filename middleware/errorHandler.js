/**
 * middleware/errorHandler.js
 * -----------------------------------------
 * Centralized error handler.
 * Catches anything that goes wrong further up the chain and
 * responds with a consistent JSON shape + correct 5xx status code,
 * instead of leaking a raw stack trace to the client.
 */

function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} does not exist.`,
  });
}

function errorHandler(err, req, res, next) {
  console.error("Unexpected error:", err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error. Something went wrong on our end.",
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
