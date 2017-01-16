const router = require('express').Router()
//const config = require('../config/config')
//const sql = require('mssql');

module.exports = function(sql, pool) {

	router.get('/', function (req, res) {
		res.render('symantec', {});
	})

	router.get('/altiris', function (req, res) {
		//console.log(req.query);
		if(req.query.pcname){
			var key = '[PC Name]';
			var value = req.query.pcname.trim();
		}else if(req.query.aduser){
			var key = '[Primary User]';		
			var value = req.query.aduser.trim();
		}else{
			res.json({error: 'No query parameters found.'});
			return;
		}

		new sql.Request(pool)
			.query("select * from ac_Computers_Complex where "+ key +" like '"+ value.replace('*', '%') +"'").then(function (recordset) {
				res.json(recordset);
			}).catch(function (err) {
				// ... error checks
				//console.log("query err: ", err);
				res.json({error: "Error occurred on query, please try later!"})
			})
	})

	router.get('/altiris/:pcname', function (req, res) {
		
		var cn = req.params.pcname || "",
			domain = req.query.domain || "",
			user = req.query.user || "";
		if(cn && domain && user){

			new sql.Request(pool)
				.query("select * from fn_ac_GetARP('"+cn+"','"+domain+"','"+user+"')").then(function (recordset) {
					res.json(recordset);
				}).catch(function (err) {
					res.json({error: "Error occurred on query, please try later!"})
				})
		} else {
			res.json({error: "Query parameters missing!"})
		}

	})
	
	return router;
}