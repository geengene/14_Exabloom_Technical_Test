import express from "express";
import pg from "pg";
import { faker } from "@faker-js/faker";
import fs from "fs";
import readline from "readline";
import env from "dotenv";

const app = express();
const PORT = 3000;
env.config();

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect(); // init connection to database

db.query(
  `
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  phone_number VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    contact_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT contact_fk
      FOREIGN KEY (contact_id)
      REFERENCES contacts(id)
      ON DELETE CASCADE
);`
); // create tables based on schema provided

const BATCH_SIZE = 5000;
const TOTAL_CONTACTS = 100000;
const TOTAL_MESSAGES = 5000000;

async function loadMessageContent() {
  return new Promise((resolve, reject) => {
    const messages = [];
    const fileStream = fs.createReadStream("message_content.csv");
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    rl.on("line", (line) => {
      const message = line.replace(/^"|"$/g, "").trim();
      if (message) {
        messages.push(message);
      }
    });

    rl.on("close", () => resolve(messages));
    rl.on("error", (err) => reject(err));
  });
}

async function insertContacts() {
  for (let i = 0; i < TOTAL_CONTACTS; i += BATCH_SIZE) {
    const values = [];
    for (let j = 0; j < BATCH_SIZE; j++) {
      const phone = faker.phone.number();
      const created = faker.date.past({ years: 2 }).toISOString();
      values.push([phone, created, created]);
    }
    const query = `
      INSERT INTO contacts (phone_number, created_at, updated_at)
      VALUES ${values
        .map((_, idx) => `($${idx * 3 + 1}, $${idx * 3 + 2}, $${idx * 3 + 3})`) // [1,2,3], [4,5,6], [7,8,9]
        .join(", ")}
    `; // https://emeritus.org/blog/how-to-use-sql-insert/#:~:text=use%20predefined%20defaults-,2.,it%20may%20impact%20recovery%20operations%2e
    await db.query(query, values.flat()); // flattens values array of arrays to single array
    console.log(`Inserted ${i + BATCH_SIZE} contacts`);
  }
}

async function insertMessages(messagePool) {
  for (let i = 0; i < TOTAL_MESSAGES; i += BATCH_SIZE) {
    const values = [];
    for (let j = 0; j < BATCH_SIZE; j++) {
      const contactId = Math.floor(Math.random() * TOTAL_CONTACTS) + 1;
      const message =
        messagePool[Math.floor(Math.random() * messagePool.length)];
      const createdAt = faker.date.past({ years: 2 }).toISOString();
      values.push([contactId, message, createdAt]);
    }
    const query = `
      INSERT INTO messages (contact_id, content, created_at)
      VALUES ${values
        .map((_, idx) => `($${idx * 3 + 1}, $${idx * 3 + 2}, $${idx * 3 + 3})`)
        .join(", ")}
    `;
    await db.query(query, values.flat());
    console.log(`Inserted ${i + BATCH_SIZE} messages`);
  }
}

app.get("/populate", async (req, res) => {
  try {
    const messagePool = await loadMessageContent();
    await insertContacts();
    await insertMessages(messagePool);
    res.send("Populated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.get("/recent-conversations", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = 50;
    const offset = (page - 1) * limit;
    const searchValue = `%${req.query.searchValue || ""}%`;

    const query = `
      WITH ranked_messages AS (
        SELECT
          m.contact_id,
          m.content AS last_message,
          m.created_at AS last_message_time,
          ROW_NUMBER() OVER (PARTITION BY m.contact_id ORDER BY m.created_at DESC) AS rank
        FROM
          messages m
      )
      SELECT
        c.id AS contact_id,
        c.phone_number,
        rm.last_message,
        rm.last_message_time
      FROM
        contacts c
      JOIN
        ranked_messages rm ON c.id = rm.contact_id
      WHERE
        rm.rank = 1
        AND (
          c.phone_number ILIKE $3 OR
          rm.last_message ILIKE $3
        )
      ORDER BY
        rm.last_message_time DESC
      LIMIT $1 OFFSET $2;
    `;
    const result = await db.query(query, [limit, offset, searchValue]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving recent conversations");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
