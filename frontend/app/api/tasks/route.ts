import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const tasks = db.prepare(`
      SELECT
        t.id,
        t.goal_id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.created_at,
        t.due_date,
        t.completed_at,
        g.title as goal_title
      FROM tasks t
      LEFT JOIN goals g ON t.goal_id = g.id
      WHERE t.status IN ('pending', 'in-progress')
      ORDER BY
        CASE t.priority
          WHEN 1 THEN 3
          WHEN 2 THEN 2
          WHEN 3 THEN 1
        END ASC,
        t.created_at DESC
    `).all();

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { goal_id, title, description, priority, due_date } = body;

    const db = getDb();
    const result = db.prepare(`
      INSERT INTO tasks (goal_id, title, description, status, priority, due_date)
      VALUES (?, ?, ?, 'pending', ?, ?)
    `).run(goal_id || null, title, description, priority || 2, due_date);

    const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
