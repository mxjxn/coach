import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const checkins = db.prepare(`
      SELECT
        id,
        checkin_type,
        time,
        notes,
        created_at,
        questions,
        responses
      FROM checkins
      ORDER BY created_at DESC
      LIMIT 10
    `).all();

    return NextResponse.json(checkins);
  } catch (error) {
    console.error('Error fetching check-ins:', error);
    return NextResponse.json(
      { error: 'Failed to fetch check-ins' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { checkin_type, time, questions, responses, notes } = body;

    const db = getDb();
    const result = db.prepare(`
      INSERT INTO checkins (checkin_type, time, questions, responses, notes)
      VALUES (?, ?, ?, ?, ?)
    `).run(checkin_type, time, JSON.stringify(questions), JSON.stringify(responses), notes);

    const newCheckin = db.prepare('SELECT * FROM checkins WHERE id = ?').get(result.lastInsertRowid);

    return NextResponse.json(newCheckin, { status: 201 });
  } catch (error) {
    console.error('Error creating check-in:', error);
    return NextResponse.json(
      { error: 'Failed to create check-in' },
      { status: 500 }
    );
  }
}
