`rojo serve`

# How to Run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the Rojo server:

   ```bash
   rojo serve
   ```

3. In a separate terminal, watch for file changes:
   ```bash
   npm run watch
   ```

## Database

The project includes a SQLite database system for generating test data:

- **setup-database.js** - Creates database schema with entities and relationships tables
- **generate-data.js** - Generates random sports data (people, teams, cities) with realistic relationships
- **query-data.js** - Displays database statistics and sample data
- **sports-data.db** - SQLite database file (created after running setup)

### Usage

```bash
node setup-database.js    # Create database
node generate-data.js     # Add random data
node query-data.js        # View data
```
