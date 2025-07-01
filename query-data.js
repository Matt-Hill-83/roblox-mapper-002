const Database = require("better-sqlite3");

const db = new Database("sports-data.db");

// Query functions
function getEntitiesByType(type) {
  const stmt = db.prepare("SELECT * FROM entities WHERE type = ?");
  return stmt.all(type);
}

function getRelationshipsByType(type) {
  const stmt = db.prepare(`
    SELECT r.*, 
           e1.name as source_name, e1.type as source_type,
           e2.name as target_name, e2.type as target_type
    FROM relationships r
    JOIN entities e1 ON r.source_guid = e1.guid
    JOIN entities e2 ON r.target_guid = e2.guid
    WHERE r.type = ?
  `);
  return stmt.all(type);
}

function getEntityConnections(entityGuid) {
  const stmt = db.prepare(`
    SELECT r.type, r.properties,
           CASE 
             WHEN r.source_guid = ? THEN e2.name
             ELSE e1.name
           END as connected_entity,
           CASE 
             WHEN r.source_guid = ? THEN e2.type
             ELSE e1.type
           END as connected_type,
           CASE 
             WHEN r.source_guid = ? THEN 'outgoing'
             ELSE 'incoming'
           END as direction
    FROM relationships r
    JOIN entities e1 ON r.source_guid = e1.guid
    JOIN entities e2 ON r.target_guid = e2.guid
    WHERE r.source_guid = ? OR r.target_guid = ?
  `);
  return stmt.all(entityGuid, entityGuid, entityGuid, entityGuid, entityGuid);
}

// Display functions
function displayEntities(entities, limit = 10) {
  console.log(
    `\nShowing ${Math.min(limit, entities.length)} of ${
      entities.length
    } entities:\n`
  );
  entities.slice(0, limit).forEach((entity) => {
    const data = JSON.parse(entity.data);
    console.log(`${entity.type.toUpperCase()}: ${entity.name}`);
    console.log(`  GUID: ${entity.guid}`);
    console.log(`  Data: ${JSON.stringify(data, null, 2)}`);
    console.log("---");
  });
}

function displayRelationships(relationships, limit = 10) {
  console.log(
    `\nShowing ${Math.min(limit, relationships.length)} of ${
      relationships.length
    } relationships:\n`
  );
  relationships.slice(0, limit).forEach((rel) => {
    console.log(
      `${rel.source_name} (${rel.source_type}) --[${rel.type}]--> ${rel.target_name} (${rel.target_type})`
    );
    if (rel.properties && rel.properties !== "{}") {
      console.log(`  Properties: ${rel.properties}`);
    }
    console.log("---");
  });
}

// Main queries
console.log("=== DATABASE STATISTICS ===");

const entityCounts = db
  .prepare(
    `
  SELECT type, COUNT(*) as count 
  FROM entities 
  GROUP BY type 
  ORDER BY count DESC
`
  )
  .all();

console.log("\nEntity counts:");
entityCounts.forEach((row) => {
  console.log(`  ${row.type}: ${row.count}`);
});

const relationshipCounts = db
  .prepare(
    `
  SELECT type, COUNT(*) as count 
  FROM relationships 
  GROUP BY type 
  ORDER BY count DESC
`
  )
  .all();

console.log("\nRelationship counts:");
relationshipCounts.forEach((row) => {
  console.log(`  ${row.type}: ${row.count}`);
});

// Sample data
console.log("\n=== SAMPLE DATA ===");

const people = getEntitiesByType("person");
displayEntities(people, 5);

const teams = getEntitiesByType("team");
displayEntities(teams, 5);

const playsForRels = getRelationshipsByType("PLAYS_FOR");
displayRelationships(playsForRels, 10);

const ownsTeamRels = getRelationshipsByType("OWNS_TEAM");
displayRelationships(ownsTeamRels, 5);

// Show connections for a specific person
if (people.length > 0) {
  const samplePerson = people[0];
  console.log(`\n=== CONNECTIONS FOR ${samplePerson.name} ===`);
  const connections = getEntityConnections(samplePerson.guid);
  connections.forEach((conn) => {
    console.log(
      `  ${conn.direction}: ${conn.type} -> ${conn.connected_entity} (${conn.connected_type})`
    );
    if (conn.properties && conn.properties !== "{}") {
      console.log(`    Properties: ${conn.properties}`);
    }
  });
}

db.close();
