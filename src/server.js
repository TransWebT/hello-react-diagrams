var express = require('express');
var mysql = require('mysql');

/*
var connectInfo = {
  host: "localhost",
  user: "root",
  password: "letmein4",
  database: "world"
}
*/

var connectInfo = {
  host: "localhost",
  user: "",
  password: ""
}


function getDatabaseConnection(connectInfo) {
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

function getTableNames(connection, database) { 
  let sql = `select table_schema as database_name, table_name
             from information_schema.tables
             where table_type = 'BASE TABLE'
                   and table_schema not in ('information_schema','mysql','performance_schema','sys')
            order by database_name, table_name;`
 /*
  let sql = `select table_schema as database_name, table_name
             from information_schema.tables
             where table_type = 'BASE TABLE'
                   and table_schema = '${database}'
             order by database_name, table_name;`
  */
    let tables = connection.query(sql, function(error, results, fields) {
    if (error) {
      console.log('error querying: ' + error.stack);
      throw error;
    }
    console.log(results);
    return results;
  });
  // console.log(tables);
  return tables;
}

function getSchemaForTable(connection, database, table) {
  let sql = `SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '${database}' AND TABLE_NAME = '${table}';`;
  connection.query(sql, function(error, results, fields) {
      if (error) {
        console.log('error querying: ' + error.stack);
        throw error;
      }
      // console.log(results);
      return results;
  });
  return results;
}

let connection = getDatabaseConnection(connectInfo);
let tables = getTableNames(connection, "sparcs_tdm");
console.log(tables);

connection.end(function(err) {
  // The connection is terminated now
});

/*
var app = express();
app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});
*/
