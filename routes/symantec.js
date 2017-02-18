const router = require('express').Router()
const SMA = require('../model/sma')
const objSort = {
    c: {"PC Name": 1},
    cd: {"PC Name": -1},
    u: {"Primary User": 1},
    ud: {"Primary User": -1}
};

module.exports = function(sql, pool) {

    router.get('/', function(req, res) {
        res.render('symantec', {});
    })

    router.get('/altiris', function(req, res) {
        //console.log(req.query);
        var q = {};
        if (req.query.pcname) {

            var value = req.query.pcname;
            if (typeof value === 'string' && value.match(/\w/g).length > 3) {
                q['PC Name'] = new RegExp('\^' + value.trim().replace(/(\/)|(\\)|(\*)|(\?)|(\<)|(\>)|(\")|(\.)/g, ''), 'i')
            } else {
                res.json({ error: 'Please provide at least 3 letters!' });
                return;
            }

        } else if (req.query.aduser) {

            var value = req.query.aduser;
            if (typeof value === 'string' && value.match(/\w/g).length > 3) {
                q['Primary User'] = new RegExp('\^' + value.trim().replace(/(\/)|(\\)|(\*)|(\?)|(\<)|(\>)|(\")|(\.)/g, ''), 'i')
            } else {
                res.json({ error: 'Please provide at least 3 letters!' });
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

    })

    router.get('/altiris/pclist', function(req, res) {
        //console.log(req.query);
        var qbody = req.query || {};
        var q = {};
        var key = {'PC Name':1, 'Primary User':1, '_id':0};
        if (qbody.pcname) {
            delete key['Primary User'];
            var value = qbody.pcname;
            if (typeof value === 'string' && value.match(/\w/g)) {
                q['PC Name'] = new RegExp('\^' + value.trim().replace(/(\/)|(\\)|(\*)|(\?)|(\<)|(\>)|(\")|(\.)/g, ' '), 'i')
            } else {
                res.json({ error: 'Computer name is a combination of letters and numbers!' });
                return;
            }

        } else if (qbody.aduser) {
            delete key['PC Name'];
            var value = qbody.aduser;
            if (typeof value === 'string' && value.match(/\w/g)) {
                q['Primary User'] = new RegExp('\^' + value.trim().replace(/(\/)|(\\)|(\*)|(\?)|(\<)|(\>)|(\")|(\.)/g, ' '), 'i')
            } else {
                res.json({ error: 'Username is a combination of letters and numbers!' });
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

        var sort = qbody.sort ? qbody.sort : 'c';
        if (['c', 'cd', 'u', 'ud'].indexOf(sort) === -1) {
            sort = 'c';
        }

        SMA.find(q).count(function (err, count) {
            if (err) {
                //console.log(err)
                res.json({error: "Internal error occurred!"});
                return;
            }
            SMA.find(q, key).sort(objSort[sort]).skip((curPage - 1) * 10).limit(10).exec(function(err, docs) {
                if (err) {
                    //console.log(err)
                    res.json({ error: "Query error occurred!" });
                    return;
                }
                //console.log(docs)
                res.json({
                    sort: sort,
                    count: count,
                    curPage: curPage,
                    totalPage: count === 0 ? 1 : Math.ceil(count / 10),
                    data: docs
                })
            })
        })

    })

    router.get('/altiris/hint', function(req, res) {
        //console.log(req.query);
        var qbody = req.query || {};
        var q = {};
        var key = 'PC Name';
        if (qbody.pcname) {
            //delete key['Primary User'];
            var value = qbody.pcname;
            if (typeof value === 'string' && value.match(/\w/g)) {
                q['PC Name'] = new RegExp('\^' + value.replace(/(\/)|(\\)|(\*)|(\?)|(\<)|(\>)|(\")|(\.)/g, ' '), 'i')
            } else {
                res.json([]);
                return;
            }

        } else if (qbody.aduser) {
            //delete key['PC Name'];
            key = 'Primary User';
            var value = qbody.aduser;
            if (typeof value === 'string' && value.match(/\w/g)) {
                q['Primary User'] = new RegExp('\^' + value.replace(/(\/)|(\\)|(\*)|(\?)|(\<)|(\>)|(\")|(\.)/g, ' '), 'i')
            } else {
                res.json([]);
                return;
            }
        } else {
            res.json([]);
            return;
        }

        SMA.aggregate(
            [
                { "$match": q },
                { "$group": { 
                    "_id": "$" + key, 
                }},
                { "$limit": 8 }
            ],
            function(err, docs) {
               if (err) {
                   //console.log(err)
                   res.json([]);
                   return;
               }
               //console.log(docs)
               res.json(docs)
            }
        );
/*        SMA.find(q, key).limit(8).exec(function(err, docs) {
            if (err) {
                //console.log(err)
                res.json([]);
                return;
            }
            //console.log(docs)
            res.json(docs)
        })*/

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
