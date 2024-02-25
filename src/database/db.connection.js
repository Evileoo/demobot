const Db = require("mysql2-async").default;

//Pool creation
const db = new Db({
    host           : "localhost",
    user           : "root",
    password       : "",
    database       : "demobot",
    connectionLimit: 10,
    skiptzfix      : true
});

//Testing connection
testConnection();
async function testConnection(){
    const sql = "SELECT 1 FROM DUAL";

    const result = await db.query(sql);

    if(result.length >= 1) console.log("-- Database connected --");
}

module.exports = Object.freeze({
    db: db
});