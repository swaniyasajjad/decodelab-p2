/**
 * data/tasks.js
 * -----------------------------------------
 * In-memory "database" for the Task API.
 *
 * In a real production app this would be replaced by a real
 * database (MongoDB, PostgreSQL, etc). For Project 2, the goal
 * is to master API logic first -- not databases -- so we keep
 * the data layer intentionally simple.
 */

let tasks = [
  {
    id: 1,
    title: "Learn Express.js",
    description: "Understand routing, middleware and controllers",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Build REST API",
    description: "Implement GET/POST endpoints for Project 2",
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

// Keeps track of the next available ID so new tasks get a unique id.
let nextId = 3;

function getNextId() {
  return nextId++;
}

module.exports = {
  tasks,
  getNextId,
};
