async function itemsTable(db) {
    const sql = `
        CREATE TABLE IF NOT EXISTS items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            length INT NOT NULL,
            items_value JSON NOT NULL
        )
    `
    try {
        await db.execute(sql)
    } catch (error) {
        console.error("Error creating items table:", error);
    }
}

async function combinationsTable(db) {
    const sql =
        `CREATE TABLE IF NOT EXISTS combinations (
        id INT AUTO_INCREMENT PRIMARY KEY,
         combinations_value JSON NOT NULL)`
    try {
        await db.execute(sql)
    } catch (error) {
        console.error("Error creating combinations table:", error);
    }
}

async function responsesTable(db) {
    const sql = `
        CREATE TABLE IF NOT EXISTS responses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            combination_id INT NOT NULL,
            FOREIGN KEY (combination_id) REFERENCES combinations(id)
        )
    `;
    try {
        await db.execute(sql)
    } catch (error) {
        console.error("Error creating responses table:", error);
    }
}

module.exports = { itemsTable, combinationsTable, responsesTable };