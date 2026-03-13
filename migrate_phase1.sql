-- Coach 2.0 Phase 1 Migration
-- Add thoughts, ideas, beliefs tables and vector link tracking

-- Thoughts table: Raw capture from conversation stream
CREATE TABLE IF NOT EXISTS thoughts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    source TEXT NOT NULL CHECK(source IN ('telegram', 'dashboard', 'checkin')),
    context TEXT, -- Optional context: what was happening when this thought emerged
    strength REAL DEFAULT 0.5 CHECK(strength >= 0.0 AND strength <= 1.0), -- Relevance/salience
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'archived', 'evolved')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Ideas table: Shaped thoughts that can become beliefs or goals
CREATE TABLE IF NOT EXISTS ideas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    thought_id INTEGER, -- Parent thought if evolved from one
    source TEXT NOT NULL CHECK(source IN ('telegram', 'dashboard', 'checkin')),
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'archived', 'evolved')),
    strength REAL DEFAULT 0.5 CHECK(strength >= 0.0 AND strength <= 1.0),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (thought_id) REFERENCES thoughts(id) ON DELETE SET NULL
);

-- Beliefs table: Surface cards when strongly held/activated
CREATE TABLE IF NOT EXISTS beliefs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL, -- The belief statement
    strength REAL NOT NULL CHECK(strength >= 0.0 AND strength <= 1.0), -- How strongly held
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'questioned', 'archived')),
    source TEXT NOT NULL CHECK(source IN ('telegram', 'dashboard', 'checkin')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Vector links: n-dimensional connections between thinking and doing systems
CREATE TABLE IF NOT EXISTS vector_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_type TEXT NOT NULL CHECK(source_type IN ('thought', 'idea', 'belief', 'goal', 'project')),
    source_id INTEGER NOT NULL,
    target_type TEXT NOT NULL CHECK(target_type IN ('thought', 'idea', 'belief', 'goal', 'project')),
    target_id INTEGER NOT NULL,
    link_type TEXT NOT NULL CHECK(link_type IN ('supports', 'questions', 'inspires', 'blocks', 'related')),
    strength REAL DEFAULT 0.5 CHECK(strength >= 0.0 AND strength <= 1.0),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(source_type, source_id, target_type, target_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_thoughts_status ON thoughts(status);
CREATE INDEX IF NOT EXISTS idx_thoughts_strength ON thoughts(strength);
CREATE INDEX IF NOT EXISTS idx_thoughts_created_at ON thoughts(created_at);

CREATE INDEX IF NOT EXISTS idx_ideas_status ON ideas(status);
CREATE INDEX IF NOT EXISTS idx_ideas_strength ON ideas(strength);
CREATE INDEX IF NOT EXISTS idx_ideas_created_at ON ideas(created_at);

CREATE INDEX IF NOT EXISTS idx_beliefs_status ON beliefs(status);
CREATE INDEX IF NOT EXISTS idx_beliefs_strength ON beliefs(strength);
CREATE INDEX IF NOT EXISTS idx_beliefs_created_at ON beliefs(created_at);

CREATE INDEX IF NOT EXISTS idx_vector_links_source ON vector_links(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_vector_links_target ON vector_links(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_vector_links_type ON vector_links(link_type);
