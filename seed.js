const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'admin',
    password: 'password',
    database: 'calc',
    connectionLimit: 5, // adjust according to your needs
});

async function seedDatabase() {
    const paramsData = [
        ['Param1', 10.99],
        ['Param2', 20.50],
        ['Param3', 15.75],
        // Add more sample data as needed
    ];

    try {
        const conn = await pool.getConnection();
        await conn.query('TRUNCATE TABLE params'); // Optional: Clear existing data before inserting
        await conn.batch('INSERT INTO params (name, price) VALUES (?, ?)', paramsData);
        conn.release();
        console.log('Database seeded successfully.');
    } catch (err) {
        console.error('Error seeding database:', err.message);
    } finally {
        pool.end(); // Close the connection pool
    }
}

seedDatabase();
