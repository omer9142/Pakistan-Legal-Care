import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'zambeel_user',
    password: 'zambeel',
    database: 'lawyers_dashboard',
});

connection.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});




export default connection;
