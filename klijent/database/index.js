const mysql = require('serverless-mysql')({
	config: {
	  host     : process.env.MYSQL_HOST,
	  database : process.env.MYSQL_DATABASE,
	  user     : process.env.MYSQL_USER,
	  password : process.env.MYSQL_PASSWORD,
	  multipleStatements: true
	}
})

module.exports = mysql;