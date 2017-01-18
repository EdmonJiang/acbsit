const router = require('express').Router()
const SMA = require('../model/sma')
    //const config = require('../config/config')
    //const sql = require('mssql');

module.exports = function(sql, pool) {

    router.get('/', function(req, res) {
        res.render('symantec', {});
    })

    router.get('/altiris', function(req, res) {
        //console.log(req.query);
        var q = {};
        if (req.query.pcname) {

            var value = req.query.pcname;
            if (typeof value === 'string' && value.match(/\w/g).length > 2) {
                q['PC Name'] = new RegExp(value.trim().replace(/(\/)|(\\)|(\*)|(\?)|(\<)|(\>)|(\")|(\.)/g, ''), 'i')
            } else {
                res.json({ error: 'At least provide 3 letters!' });
                return;
            }

        } else if (req.query.aduser) {

            var value = req.query.aduser;
            if (typeof value === 'string' && value.match(/\w/g).length > 2) {
                q['Primary User'] = new RegExp(value.trim().replace(/(\/)|(\\)|(\*)|(\?)|(\<)|(\>)|(\")|(\.)/g, ''), 'i')
            } else {
                res.json({ error: 'At least provide 3 letters!' });
                return;
            }
        } else {
            res.json({ error: 'No query parameters found.' });
            return;
        }


        SMA.find(q).lean().exec(function(err, docs) {
            if (err) {
                //console.log(err)
                res.json({ error: "Query error occurred!" });
                return;
            }
            //console.log(docs)
            res.json(docs)
        })


        // var request = new sql.Request(pool);
        // request.stream = true; // You can set streaming differently for each request 
        // // or request.execute(procedure);
        // request.query("select * from ac_Computers_Complex where "+ key +" like '"+ value.replace(/\*/g, '%') +"'");  

        // var dataset = [];

        // request.on('recordset', function(columns) {
        //   	// Emitted once for each recordset in a query 
        // 	//console.log(columns)
        // });

        // request.on('row', function(row) {
        // 	// Emitted for each row in a recordset 
        // 	//console.log(row)
        // 	dataset.push(row);
        // });

        // request.on('error', function(err) {
        // 	// May be emitted multiple times 
        // 	res.json({error: "Error occurred on query, please try later!"})
        // });

        // request.on('done', function(affected) {
        // 	// Always emitted as the last one 
        // 	res.json(dataset);
        // });

        // new sql.Request(pool)
        //     .query("select * from ac_Computers_Complex where " + key + " like '" + value.replace(/\*/g, '%') + "'").then(function(recordset) {
        //         res.json(recordset);
        //     }).catch(function(err) {
        //         // ... error checks
        //         //console.log("query err: ", err);
        //         res.json({ error: "Query timeout expired, please try again!" })
        //     })
    })

    router.get('/altiris/:pcname', function(req, res) {

        var cn = req.params.pcname || "",
            domain = req.query.domain || "",
            user = req.query.user || "";
        if (cn && domain && user) {

            new sql.Request(pool)
                .query("select * from fn_ac_GetARP('" + cn + "','" + domain + "','" + user + "')").then(function(recordset) {
                    res.json(recordset);
                }).catch(function(err) {
                    res.json({ error: "Error occurred on the query, please try again!" })
                })
        } else {
            res.json({ error: "Query parameters missing!" })
        }

    })

    return router;
}
