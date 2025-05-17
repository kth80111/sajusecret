// pages/api/save-user.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// SQLite 연결
export async function openDB() {
  return open({
    filename: './saju_users.db',
    driver: sqlite3.Database
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const db = await openDB();

  await db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT, phone TEXT, email TEXT,
    birthdate TEXT, lunar_solar TEXT, birth_time TEXT, gender TEXT,
    partner_gender TEXT, partner_birthdate TEXT, partner_lunar_solar TEXT, partner_birth_time TEXT,
    user_question TEXT
  )`);

  const {
    name, phone, email, birthdate, lunar_solar, birth_time, gender,
    partner_gender, partner_birthdate, partner_lunar_solar, partner_birth_time, user_question
  } = req.body;

  await db.run(
    `INSERT INTO users (name, phone, email, birthdate, lunar_solar, birth_time, gender,
      partner_gender, partner_birthdate, partner_lunar_solar, partner_birth_time, user_question)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name, phone, email, birthdate, lunar_solar, birth_time, gender,
      partner_gender, partner_birthdate, partner_lunar_solar, partner_birth_time, user_question
    ]
  );

  res.status(200).json({ status: 'ok' });
}
