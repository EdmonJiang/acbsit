const router = require('express').Router()
const Invoice = require('../model/airwatch').Invoice
const objSort = {
    s: "Staff_Legal",
    sd: "-Staff_Legal",
    f: "Company",
    fd: "-Company",
    c: "Country",
    cd: "-Country",
    e: "Email",
    ed: "-Email"
};

/* GET airwatch page. */
router.get('/', function(req, res) {
    res.render('airwatch', {});
})

/* GET Invoice Data. */
router.post('/', function(req, res, next) {
	//console.log(req.body)
	let qbody = {};
    if (req.body) {
        qbody = req.body;
    } else {
        res.json({ error: "No query params found." })
        return;
    }

    let curPage = qbody.page ? qbody.page : 1;
    // filter keywords
    let q = {
        Staff_Legal: qbody.Staff_Legal ? new RegExp(qbody.Staff_Legal.trim(), 'i') : /.*/,
        Company: qbody.Company ? new RegExp(qbody.Company.trim(), 'i') : /.*/,
        Country: qbody.Country ? new RegExp(qbody.Country.trim(), 'i') : /.*/,
        Email: qbody.Email ? new RegExp(qbody.Email.trim(), 'i') : /.*/
    }
//console.log('q: ', q)
    let sort = req.body.sort ? req.body.sort : 'e';

    if (['s', 'sd', 'f', 'fd', 'c', 'cd', 'e', 'ed'].indexOf(sort) === -1) {
        sort = 'e';
    }
//console.log('sort', objSort[sort])
    Invoice.find(q).count(function (err, count) {
    	if (err) {
    		//console.log(err)
    		res.json({error: "Internal error occurred!"});
            return;
    	}
    	//console.log('count:', count)
    	Invoice.find(q).sort(objSort[sort]).skip((curPage - 1) * 10).limit(10).exec(function (err, docs) {
    		if (err) {
	    		//console.log(err)
	    		res.json({error: "Internal error occurred!"});
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

});

module.exports = router
