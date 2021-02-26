var express = require('express');
var mysql = require('mysql');

/*
var connectInfo = {
  host: "localhost",
  user: "",
  password: "",
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

function getSchema(connection, database) { 
  /*
  let sql = `select table_schema as database_name, table_name
             from information_schema.tables
             where table_type = 'BASE TABLE'
                   and table_schema = '${database}'
             order by database_name, table_name;`
  */
  let sql = `select table_name
             from information_schema.tables
             where table_type = 'BASE TABLE'
                   and table_schema = '${database}'
             order by table_name;`


             console.log(sql);

  connection.query(sql, function(error, results, fields) {
    if (error) {
      console.log('error querying: ' + error.stack);
      throw error;
    }
    results.forEach(function(row) {
      console.log(row["TABLE_NAME"]);
    });
    // console.log(results);


  });
  // return tables;
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
// let schema = getSchema(connection, "world");
let schema = getSchema(connection, "sparcs_tdm");
// console.log(schema);

connection.end(function(err) {
  if (err)
    console.log(`Error closing database connection: ${err}.`);
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
