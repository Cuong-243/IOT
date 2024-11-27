const mysql = require('mysql')

const con = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12345",
  database:'iot'
});

module.exports = con