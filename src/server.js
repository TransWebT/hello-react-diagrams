var express = require('express');
var mysql = require('mysql');

var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});


var connection = mysql.createConnection({
  host: "localhost",
  user: "",
  password: "",
  database: "world"
});

connection.connect(function (err) {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log("Connected!");
});

function readTables(database) {
  var sql = "SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'world' AND TABLE_NAME = 'city'";
  connection.query(sql, function(error, results, fields) {
      if (error) {
        console.log('error querying: ' + error.stack);
        throw error;
      }
      console.log(results);
  });
}

readTables("world");
connection.end(function(err) {
  // The connection is terminated now
});
