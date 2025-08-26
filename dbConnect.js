import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

async function getAllNotes() {
    const [rows] = await pool.query("SELECT * FROM notes");
    return rows;
}

async function getNoteById(id) {
    const [rows] = await pool.query(`
        SELECT *
        FROM notes
        WHERE id = ?
    `,[id]);
    return rows;
}

async function createNote(title, contents) {
    const [result] = await pool.query(`
        INSERT INTO notes (title,contents)
        VALUES (?,?)
    `, [title, contents])
    const id = result.insertId;
    return getNoteById(id);
}

const queries = { 
    getAllNotes,
    getNoteById,
    createNote
}

export default queries;