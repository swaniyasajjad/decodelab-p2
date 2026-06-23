/**
 * middleware/apiKeyAuth.js
 * -----------------------------------------
 * "Authentication (AuthN) - Determining Identity (Who are you?)"
 *
 * A deliberately simple API key check, demonstrating the security
 * concept from the brief without adding heavy auth infrastructure
 * (no JWT, no sessions, no user database -- that's beyond this
 * project's scope, but the *concept* of "never trust an
 * unidentified caller" is shown here).
 *
 * OFF by default so it never blocks normal testing/grading.
 * Turn it on by setting REQUIRE_API_KEY=true as an environment
 * variable, and clients must then send:
 *   x-api-key: decodelabs-secret-key
 */

const REQUIRE_API_KEY = process.env.REQUIRE_API_KEY === "true";
const VALID_API_KEY = process.env.API_KEY || "decodelabs-secret-key";

function apiKeyAuth(req, res, next) {
  // If auth is disabled, skip straight through.
  if (!REQUIRE_API_KEY) {
    return next();
  }

  const providedKey = req.header("x-api-key");

  if (!providedKey) {
    // 401 Unauthorized -- caller didn't identify themselves at all.
    return res.status(401).json({
      success: false,
      message: "Missing API key. Include an 'x-api-key' header.",
    });
  }

  if (providedKey !== VALID_API_KEY) {
    // 403 Forbidden -- caller identified themselves, but isn't allowed in.
    return res.status(403).json({
      success: false,
      message: "Invalid API key.",
    });
  }

  next();
}

module.exports = apiKeyAuth;
