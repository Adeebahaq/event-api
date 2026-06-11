const fs   = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "data.json");


const locks = new Map();

function initDB() 
{
  if (!fs.existsSync(DB_PATH))
  {
    fs.writeFileSync(DB_PATH, JSON.stringify({ events: [], registrations: [] }, null, 2));
  }
}

function readDB()
{
  initDB();
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function writeDB(data)
{
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Serialize concurrent writes to the same event to prevent overbooking
async function withLock(eventId, fn)
{
  while (locks.get(eventId))
  {
    await new Promise((r) => setTimeout(r, 5));
  }
  locks.set(eventId, true);
  try 
  {
    return await fn();
  } 
  finally
  {
    locks.delete(eventId);
  }
}

module.exports = { readDB, writeDB, withLock };
