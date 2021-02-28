var express = require('express');
var mysql = require('mysql');

// schemaDoc is iteratively built from schema content read from the database.
var schemaDoc = {};
var connectInfo = {
	host: "localhost",
	user: "",
	password: ""
};
var database = "world";
// var database = "sparcs_tdm";


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

function getSchema(req, res, connection, database) {
	let getTablesSql = `select table_name
            			from information_schema.tables
            			where table_type = 'BASE TABLE' and table_schema = '${database}'
            			order by table_name;`

	connection.query(getTablesSql, function (error, tableResults, fields) {
		if (error) {
			console.log('error querying: ' + error.stack);
			throw error;
		}
		tableResults.forEach(function (table) {
			console.log(table["TABLE_NAME"]);
			let getFieldsForTableSql = `SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '${database}' AND TABLE_NAME = '${table}';`;
			/*
			connection.query(getFieldsForTableSql, function (error, fieldResults, fields) {
				if (error) {
					console.log('error querying: ' + error.stack);
					throw error;
				}
				fieldResults.forEach(function (field) {
					console.log()
				});
			});
			*/
		});
	});
}

let connection = getDatabaseConnection(connectInfo);
getSchema(null, null, connection, database);

connection.end(function (err) {
	if (err)
		console.log(`Error closing database connection: ${err}.`);
});

var app = express();
app.get('/', function (req, res) {
	res.send('Hello World!');
});

app.get('/schema', function (req, res) {
	getSchema(req, res, connection, database)
});

app.listen(3001, function () {
	console.log('Example app listening on port 3001!');
});

