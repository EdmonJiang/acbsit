const router = require('express').Router()
const SMA = require('../model/sma')
    //const config = require('../config/config')
    //const sql = require('mssql');

module.exports = function(sql, pool) {

    router.get('/', function(req, res) {
        res.render('symantec', {});
    })

    router.get('/altiris', function(req, res) {
        //console.log(qbody);
        var q = {};
        var qbody = req.query;
        if (qbody.pcname) {

            var value = qbody.pcname;
            if (typeof value === 'string' && value.match(/\w/g).length > 3) {
                q['PC Name'] = new RegExp(value.trim().replace(/(\/)|(\\)|(\*)|(\?)|(\<)|(\>)|(\")|(\.)/g, ''), 'i')
            } else {
                res.json({ error: 'Please provide at least 3 letters!' });
                return;
            }

        } else if (qbody.aduser) {

            var value = qbody.aduser;
            if (typeof value === 'string' && value.match(/\w/g).length > 3) {
                q['Primary User'] = new RegExp(value.trim().replace(/(\/)|(\\)|(\*)|(\?)|(\<)|(\>)|(\")|(\.)/g, ''), 'i')
            } else {
                res.json({ error: 'Please provide at least 3 letters!' });
                return;
            }
        } else {
            res.json({ error: 'No query parameters found.' });
            return;
        }

        var curPage = 1;
        if (typeof +qbody.page === "number") {
        	if (qbody.page >1) {
        		curPage = qbody.page;
        	}
        }

        SMA.find(q).count(function (err, count) {
        	if (err) {
        		//console.log(err)
        		res.json({error: "Internal error occurred!"});
                return;
        	}
        	//console.log('count:', count)
        	SMA.find(q).skip((curPage - 1) * 10).limit(10).exec(function (err, docs) {
            if (err) {
                //console.log(err)
                res.json({ error: "Query error occurred!" });
                return;
            }
            //console.log(docs)
            res.json({
            	data: docs,
            	count: count,
            	totalPage: count === 0 ? 1 : Math.ceil(count / 10),
            	curPage: curPage
            })
        })

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
