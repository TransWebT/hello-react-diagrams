var express = require('express');
var mysql = require('mysql2/promise');

// schemaDoc is iteratively built from schema content read from the database.
var schemaDoc = {};
var connectInfo = {
	host: "localhost",
	user: "",
	password: ""
};
// var database = "world";
var database = "classicmodels";


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

async function getSchema(req, res, database) {
	let connection = await mysql.createConnection(connectInfo);

	let getTableListSql = `select table_name
            			   from information_schema.tables
            			   where table_type = 'BASE TABLE' and table_schema = '${database}'
            			   order by table_name;`
	try {
		const [rows, fields] = await connection.query(getTableListSql);
		rows.forEach(function(tableRow) {
			tableName=tableRow["TABLE_NAME"];
			schemaDoc[tableName] = {};
		});
	} catch (e) {
		console.log('caught exception!', e);
	}

	Object.keys(schemaDoc).forEach(async function(table) {
		try {
			let getFieldsForTableSql = `SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '${database}' AND TABLE_NAME = '${table}';`;
			console.log(getFieldsForTableSql);
			const [rows, fields] = await connection.query(getFieldsForTableSql);
			schemaDoc[table]["columns"] = {};
			rows.forEach(function(columnRow) {
				columnName=columnRow["COLUMN_NAME"];
				dataType=columnRow["DATA_TYPE"];
				schemaDoc[table]["columns"][columnName] = dataType;
			});
		} catch (e) {
			console.log('caught exception!', e);
		}	
	});

	Object.keys(schemaDoc).forEach(async function(table) {
		try {
			let getKeysForTableSql = `SELECT CONSTRAINT_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME 
									  FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
									  WHERE TABLE_SCHEMA = '${database}' and table_name='${table}' order by CONSTRAINT_NAME, COLUMN_NAME;`
			console.log(getKeysForTableSql);
			const [rows, fields] = await connection.query(getKeysForTableSql);
			schemaDoc[table]["tableKeys"] = new Array();
			rows.forEach(function(columnRow) {
				let tableKey = {}
				tableKey["columnName"] = columnRow["COLUMN_NAME"];
				tableKey["constraintName"] = columnRow["CONSTRAINT_NAME"];
				tableKey["referencedTableName"] = columnRow["REFERENCED_TABLE_NAME"];
				tableKey["referencedColumnName"] = columnRow["REFERENCED_COLUMN_NAME"];
				schemaDoc[table]["tableKeys"].push(tableKey);
			});
		} catch (e) {
			console.log('caught exception!', e);
		}	
	});

	await connection.end();
}

getSchema(null, null, database)
	.then(() => {
    	console.log(JSON.stringify(schemaDoc, null, 4));
	})
	.catch(err => {
    	console.log('error!', err);
    	throw err;
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

