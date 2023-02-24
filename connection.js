const env = require('dotenv').config();
const mysql = require('mysql');

dbdata = {
  host: process.env.HISTORI_DBHOST,
  user: process.env.HISTORI_DBUSER,
  password: process.env.HISTORI_DBPASSWORD,
  database: process.env.HISTORI_DBNAME
}
var connection = mysql.createConnection(dbdata);
connection.connect(function(err){
    if (err) throw err
    console.log('connected successfully to DB ...');
});

module.exports = {
    connection : mysql.createConnection(dbdata)
}

