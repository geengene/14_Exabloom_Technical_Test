import express from "express";
import pg from "pg";
import faker from "faker";
import fs from "fs";
import csv from "csv-parser";
import { env } from "dotenv";

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
db.connect();

const BATCH_SIZE = 5000;
const TOTAL_CONTACTS = 100000;
const TOTAL_MESSAGES = 5000000;

async function loadMessageContent() {
  return new Promise((resolve, reject) => {
    const messages = [];
    fs.createReadStream("message_content.csv")
      .pipe(csv())
      .on("data", (row) => {
        const message = Object.values(row)[0];
        if (message) messages.push(message);
      })
      .on("end", () => resolve(messages))
      .on("error", reject);
  });
}

async function insertContacts() {
  console.log("Inserting contacts...");
  for (let i = 0; i < TOTAL_CONTACTS; i += BATCH_SIZE) {
    const values = [];
    for (let j = 0; j < BATCH_SIZE; j++) {
      const phone = faker.phone.phoneNumber();
      const created = faker.date.past().toISOString();
      values.push(`('${phone}', '${created}', '${created}')`);
    }
    const query = `INSERT INTO contacts (phone_number, created_at, updated_at) VALUES ${values.join(
      ","
    )};`;
    await db.query(query);
    console.log(`Inserted ${i + BATCH_SIZE} contacts`);
  }
}

async function insertMessages(messagePool) {
  console.log("Inserting messages...");
  for (let i = 0; i < TOTAL_MESSAGES; i += BATCH_SIZE) {
    const values = [];
    for (let j = 0; j < BATCH_SIZE; j++) {
      const contactId = Math.floor(Math.random() * TOTAL_CONTACTS) + 1;
      const message = messagePool[
        Math.floor(Math.random() * messagePool.length)
      ].replace(/'/g, "''");
      const sentAt = faker.date.recent(730).toISOString(); // within 2 years
      values.push(`(${contactId}, '${message}', '${sentAt}')`);
    }
    const query = `INSERT INTO messages (contact_id, message_text, sent_at) VALUES ${values.join(
      ","
    )};`;
    await db.query(query);
    console.log(`Inserted ${i + BATCH_SIZE} messages`);
  }
}

app.get("/seed", async (req, res) => {
  try {
    const messagePool = await loadMessageContent();
    await insertContacts();
    await insertMessages(messagePool);
    res.send("✅ Seeding completed!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong!");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
