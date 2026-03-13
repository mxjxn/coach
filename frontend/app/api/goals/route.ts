import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const goals = db.prepare(`
      SELECT
        id,
        category,
        title,
        description,
        priority,
        status,
        created_at,
        updated_at,
        target_date
      FROM goals
      WHERE status = 'active'
      ORDER BY priority DESC, created_at DESC
    `).all();

    return NextResponse.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, title, description, priority, target_date } = body;

    const db = getDb();
    const result = db.prepare(`
      INSERT INTO goals (category, title, description, priority, status, target_date)
      VALUES (?, ?, ?, ?, 'active', ?)
    `).run(category, title, description, priority || 1, target_date);

    const newGoal = db.prepare('SELECT * FROM goals WHERE id = ?').get(result.lastInsertRowid);

    return NextResponse.json(newGoal, { status: 201 });
  } catch (error) {
    console.error('Error creating goal:', error);
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    );
  }
}
