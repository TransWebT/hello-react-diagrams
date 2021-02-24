var express = require('express');
var mysql = require('mysql');

var connectInfo = {
  host: "localhost",
  user: "",
  password: "",
  database: "world"
}

function connectToDatabase(connectInfo) {
  let connection = mysql.createConnection(connectInfo);
  connection.connect(function (err) {
    if (err) {
      console.log('error connecting: ' + err.stack);
      return null;
    }
    console.log("Connected!");
  });

  return connection;
}

function getTableNames(connection) {
  let sql = `select table_schema as database_name, table_name
             from information_schema.tables
             where table_type = 'BASE TABLE'
                   and table_schema not in ('information_schema','mysql','performance_schema','sys')
            order by database_name, table_name;`
  tables = connection.query(sql, function(error, results, fields) {
    if (error) {
      console.log('error querying: ' + error.stack);
      throw error;
    }
    // console.log(results);
    return results;
  });
  console.log(tables);
  return tables;
}

function readTables(database) {
  let sql = "SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'world' AND TABLE_NAME = 'city'";
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


var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});

