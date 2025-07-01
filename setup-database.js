const Database = require("better-sqlite3");
const db = new Database("sports-data.db");

// Create entities tables
db.exec(`
  CREATE TABLE IF NOT EXISTS entities (
    guid TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    data JSON NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS relationships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guid TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    source_guid TEXT NOT NULL,
    target_guid TEXT NOT NULL,
    properties JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (source_guid) REFERENCES entities (guid),
    FOREIGN KEY (target_guid) REFERENCES entities (guid)
  );

  CREATE INDEX IF NOT EXISTS idx_entity_type ON entities(type);
  CREATE INDEX IF NOT EXISTS idx_relationship_type ON relationships(type);
  CREATE INDEX IF NOT EXISTS idx_relationship_source ON relationships(source_guid);
  CREATE INDEX IF NOT EXISTS idx_relationship_target ON relationships(target_guid);
`);

console.log("Database created successfully!");
db.close();
