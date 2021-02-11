/**
 * Utils that will enhance the framework by adding support to various tools and technologies end user would require; this include ability to parse JSON and interface with database connections
 * @module utils
 * @main utils
 */
var java = require('java');
var fs = require('fs');
var test = require('selenium-webdriver/testing');
var dbConfig = require('../data/dbconfig.json');
var env = require('./env');
var shell = require('shelljs');
//var ibmdb = require('ibm_db');

java.options.push("-Djava.awt.headless=true");

if (!shell.test('-d', './node_modules/kp-webdriverjs-utils/')) {
	java.classpath.push(process.cwd() + '/jar/kp-webdriver-db-utils.jar');
	java.classpath.push(process.cwd() + '/jar/ojdbc14-10.2.0.4.0.jar');
	java.classpath.push(process.cwd() + '/jar/gson-2.2.2.jar');

} else {
	java.classpath.push(process.cwd() + '/node_modules/kp-webdriverjs-utils/jar/kp-webdriver-db-utils.jar');
	java.classpath.push(process.cwd() + '/node_modules/kp-webdriverjs-utils/jar/ojdbc14-10.2.0.4.0.jar');
	java.classpath.push(process.cwd() + '/node_modules/kp-webdriverjs-utils/jar/gson-2.2.2.jar');
}
var dbEnv = env.where;

/**
 * Databse lib contains common methods for executing SQL queries on our Oracle DBs
 * @class dbUtils
 */
module.exports = {
	/**
	 * Executes the desired query against the oracle db
	 * @method executeSql
	 * @return Query Results
	 * @param query - SQL Query
	 */
	executeSql: function(query) {
		var dbConnectString = "jdbc:oracle:thin:@" + dbConfig[dbEnv].host + ":" + dbConfig[dbEnv].port + ":" + dbConfig[dbEnv].sid;
		var dbUtil = java.newInstanceSync('lib.dbSource.dbUtil', dbConnectString, dbConfig[dbEnv].user, dbConfig[dbEnv].password);

		if (query.toUpperCase().includes('SELECT')) {
			return dbUtil.executeQuerySync(query);
		} else {
			return dbUtil.executeStatementSync(query);
		}
	},

	/**
	 * Grabs the guid for the desired MRN that was passed
	 * @method mrnToGuid
	 * @return Guid for matching MRN
	 * @param mrn - The user's mrn for which you want to get a GUID.
	 */
	mrnToGuid: function(mrn) {
		var dbConnectString = "jdbc:oracle:thin:@" + dbConfig[dbEnv].host + ":" + dbConfig[dbEnv].port + ":" + dbConfig[dbEnv].sid;
		var dbUtil = java.newInstanceSync('lib.dbSource.dbUtil', dbConnectString, dbConfig[dbEnv].user, dbConfig[dbEnv].password);
		var query = "select a.GUID from wpp_mbrshp_acct mbr join wpp_prsn p on mbr.wpp_prsn_ik = p.wpp_prsn_ik join WPP_EBIZ_ACCT a on a.wpp_prsn_ik = p.wpp_prsn_ik where mbr.mrn = " + mrn + "";

		return dbUtil.executeQuerySync(query);
	},

	/**
	 * Executes the desired query on CPM DSN7 database syncronously
	 * @method syncCpm
	 * @return Query results
	 * @param username - user id (UID) for CPM DSN7
	 * @param password - password for above UID
	 * @param query - SQL Query
	 */
	cpmSyncQuery: function(username, password, query) {
		var ibmdb = require("ibm_db"),
			cn = "DRIVER=" + dbConfig['cpm_dsn7'].driver + ";DATABASE=" + dbConfig['cpm_dsn7'].databaseName + ";HOSTNAME=" + dbConfig['cpm_dsn7'].host + ";UID=" + username + ";PWD=" + password + ";PORT=" + dbConfig['cpm_dsn7'].port + ";PROTOCOL=" + dbConfig['cpm_dsn7'].protocol;
		try {
			var conn = ibmdb.openSync(cn);
			return conn.querySync(query);
			conn.close();
		} catch (err) {
			console.log(err.message);
		}
	}
}