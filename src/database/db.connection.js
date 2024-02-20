const mysql = require("mysql");

//Pool creation
const pool = mysql.createPool({
    host           : "localhost",
    user           : "root",
    password       : "",
    database       : "demobot",
    connectionLimit: 10
});

//Testing pool connection
pool.getConnection(function(err, connection){
    if(err) throw err;

    const sql = "SELECT 1 FROM DUAL";

    connection.query(sql, function(error){

        console.log("-- Database Connected --");

        connection.release();

        if(error) throw error;
    });
});