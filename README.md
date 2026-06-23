# DecodeLabs — Project 2: Backend API Development

**Industrial Training Kit | Batch 2026 | Full Stack Development Track**

A simple, well-structured REST API built with Node.js and Express, demonstrating core backend concepts: routing, request/response handling, data validation, and proper HTTP status codes.

## What this project demonstrates (mapped to the brief)

| Requirement from the brief | Where it's implemented |
|---|---|
| Create API endpoints (GET / POST) | `routes/taskRoutes.js` — also includes PUT/PATCH/DELETE for a complete CRUD set |
| Handle user input and responses | `controllers/taskController.js` |
| Validate basic data | `middleware/validateTask.js` ("The Gatekeeper Rule") |
| RESTful naming (nouns, not verbs) | Routes are `/tasks`, `/tasks/:id` — never `/getTasks` |
| Correct HTTP status codes | 200, 201, 204, 400, 401, 403, 404, 500 used throughout |
| Error handling | `middleware/errorHandler.js` (404 + centralized 500 handler) |
| Authentication concept (AuthN) | `middleware/apiKeyAuth.js` — optional API key check on write routes |

> Note: per the brief ("this track isn't about visual flair — it's about the application's brain," page 2), the included frontend (`public/index.html`) is a deliberately minimal demo client, not the deliverable itself. It exists only to make the API easy to click through instead of typing curl/PowerShell commands. All real logic stays server-side.

## Project Structure

```
decodelabs-project2/
├── server.js                  # Entry point — wires everything together
├── package.json
├── public/
│   └── index.html             # Minimal demo frontend (talks to the API via fetch)
├── routes/
│   └── taskRoutes.js          # URL → controller mapping
├── controllers/
│   └── taskController.js      # Business logic (the "brain")
├── middleware/
│   ├── validateTask.js        # Input validation (gatekeeper)
│   ├── apiKeyAuth.js          # Optional API key check (AuthN concept)
│   └── errorHandler.js        # 404 + 500 handling
└── data/
    └── tasks.js                # In-memory data store (no DB needed yet)
```

## Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# Server runs at http://localhost:3000
```

Then open **http://localhost:3000** in your browser to use the demo console — create tasks, mark them done, and delete them through the UI. It's calling the exact same API endpoints documented below.

The raw API reference (JSON) is available at **http://localhost:3000/api**.

## API Reference

### `GET /tasks`
Returns all tasks. Optional query filter: `?completed=true` or `?completed=false`.

**Response — 200 OK**
```json
{
  "success": true,
  "count": 2,
  "data": [
    { "id": 1, "title": "Learn Express.js", "description": "...", "completed": false, "createdAt": "..." }
  ]
}
```

### `GET /tasks/:id`
Returns a single task.

- **200 OK** — task found
- **404 Not Found** — no task with that id
- **400 Bad Request** — `:id` isn't a valid positive integer

### `POST /tasks`
Creates a new task.

**Request body**
```json
{ "title": "Buy groceries", "description": "Milk, eggs, bread", "completed": false }
```

- **201 Created** — task created, returns the new object
- **400 Bad Request** — validation failed (missing/invalid `title`, wrong types, etc.)

### `PUT /tasks/:id`
Updates an existing task. Same body shape as POST.

- **200 OK** — updated successfully
- **404 Not Found** — task doesn't exist
- **400 Bad Request** — invalid id or invalid body

### `PATCH /tasks/:id/complete`
Toggles or explicitly sets a task's `completed` status — a narrower update than a full `PUT`.

**Request body (optional)**
```json
{ "completed": true }
```
If omitted, the current value is simply flipped (true → false, false → true).

- **200 OK** — status updated, returns the task
- **404 Not Found** — task doesn't exist
- **400 Bad Request** — `completed` was provided but isn't a boolean

### `DELETE /tasks/:id`
Deletes a task.

- **204 No Content** — deleted successfully (no body returned)
- **404 Not Found** — task doesn't exist

## Optional: API Key Authentication

Write operations (`POST`, `PUT`, `PATCH`, `DELETE`) can optionally require an API key, demonstrating the Authentication (AuthN) concept from the training material. **This is OFF by default** so it never interferes with testing or grading.

To turn it on, set an environment variable before starting the server:

```bash
# macOS/Linux
REQUIRE_API_KEY=true npm start

# Windows PowerShell
$env:REQUIRE_API_KEY="true"
npm start
```

Once enabled, every write request must include a header:
```
x-api-key: decodelabs-secret-key
```

- Missing key → **401 Unauthorized**
- Wrong key → **403 Forbidden**
- Correct key → request proceeds normally

You can change the expected key by also setting `API_KEY=your-custom-key`.

## Manual Testing (no Postman needed)

With the server running, open a second terminal and try:

```bash
# Get all tasks
curl http://localhost:3000/tasks

# Get one task
curl http://localhost:3000/tasks/1

# Create a task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test the API","description":"Make sure it works"}'

# Try creating an INVALID task (missing title) -> should return 400
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"description":"no title here"}'

# Update a task
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated title","completed":true}'

# Delete a task
curl -X DELETE http://localhost:3000/tasks/2

# Hit a route that doesn't exist -> should return 404
curl http://localhost:3000/banana
```

Or import `DecodeLabs_Project2.postman_collection.json` (included) directly into Postman / Thunder Client for one-click testing of every endpoint.

## Design Notes

- **No database yet** — data lives in memory (`data/tasks.js`) and resets when the server restarts. This is intentional: Project 2's goal is API logic, not persistence (that's a later milestone).
- **Validation happens in middleware**, before the controller ever sees the data — so the "brain" (business logic) never has to defend itself against malformed input.
- **Status codes are chosen deliberately**, not just defaulted to 200 — `201` for creation, `204` for deletion (no body to return), `400` vs `404` distinguishing "your request was malformed" from "that resource doesn't exist."
- **Routes are nouns, methods are verbs** — `/tasks` not `/getTasks`, in line with REST conventions.

## Next Steps (Beyond Project 2)

- Swap the in-memory array for a real database (MongoDB/PostgreSQL)
- Add authentication (JWT) to protect write operations
- Add pagination to `GET /tasks` for larger datasets
- Write automated tests (Jest + Supertest)

---
*DecodeLabs — www.decodelabs.tech*
