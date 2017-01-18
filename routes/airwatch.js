const router = require('express').Router()
const Invoice = require('../model/airwatch').Invoice
const User = require('../model/airwatch').User
const Device = require('../model/airwatch').Device
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
router.post('/invoice', function(req, res, next) {
	//console.log(req.body)
	var qbody = req.query || {};
    if (!Object.keys(qbody).length) {
        res.json({ error: "Query parameter 'email' not found." })
        return;
    }

    // filter keywords
    var q = {};
    if (qbody.q) {
    	var query = qbody.q;
//console.log("query: ", query)
	    q = {
	        Staff_Legal: query.famcode ? new RegExp(query.famcode.trim(), 'i') : /.*/,
	        Company: query.company ? new RegExp(query.company.trim(), 'i') : /.*/,
	        Country: query.country ? new RegExp(query.country.trim(), 'i') : /.*/,
	        Email: query.email ? new RegExp(query.email.trim(), 'i') : /.*/,
	        Enrolled: query.enrolled ? query.enrolled.trim() : 'True',
	        EnrolledDevicesCount: query.count ? query.count.trim() : /.*/
	    }
    }
//console.log('qarg: ', q)
//console.log(qbody)
	var curPage = 1;
	if (typeof +qbody.page === "number") {
		if (qbody.page >1) {
			curPage = qbody.page;
		}
	}
//console.log(curPage)
    var sort = qbody.sort ? qbody.sort : 'e';

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

/* GET Invoice Data. */
router.get('/invoice', function(req, res, next) {
	//console.log(req.query)
	var qbody = req.query || {};
    if (!Object.keys(qbody).length) {
        res.json({ error: "Query parameter 'email' not found." })
        return;
    }

    // filter keywords
    var q = {};
    if (qbody.q) {
    	var query = qbody.q;
//console.log("query: ", query)
	    q = {
	        Staff_Legal: query.famcode ? new RegExp(query.famcode.trim().replace(/(\/)|(\\)|(\*)|(\?)|(\<)|(\>)|(\")|(\.)/g, ''), 'i') : /.*/,
	        Company: query.company ? new RegExp(query.company.trim().replace(/(\/)|(\\)|(\*)|(\?)|(\<)|(\>)|(\")|(\.)/g, ''), 'i') : /.*/,
	        Country: query.country ? new RegExp(query.country.trim().replace(/(\/)|(\\)|(\*)|(\?)|(\<)|(\>)|(\")|(\.)/g, ''), 'i') : /.*/,
	        Email: query.email ? new RegExp(query.email.trim().replace(/(\/)|(\\)|(\*)|(\?)|(\<)|(\>)|(\")|(\.)/g, ''), 'i') : /.*/,
	        Enrolled: query.enrolled ? query.enrolled.trim().replace(/(\/)|(\\)|(\*)|(\?)|(\<)|(\>)|(\")|(\.)/g, '') : 'True',
	        EnrolledDevicesCount: query.count === "0" ? "" : (query.count ? new RegExp(query.count.trim(), 'i') : /.*/)
	    }
    }
//console.log('qarg: ', q)
//console.log(qbody)
	var curPage = 1;
	if (typeof +qbody.page === "number") {
		if (qbody.page >1) {
			curPage = qbody.page;
		}
	}
//console.log(curPage)
    var sort = qbody.sort ? qbody.sort : 'e';

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

/* GET User Detail. */
router.get('/user', function(req, res, next) {
	var email = req.query.email || "";
	if (!email) {
        res.json({ error: "Query parameter 'email' not found." })
        return;
    }
	User.findOne({Email: email}).exec(function (err, doc) {
		if (err) {
	    		//console.log(err)
	    		res.json({error: "Internal error occurred!"});
	            return;
    		}

    	res.json(doc);
	})
})

/* GET Device Detail. */
router.get('/device', function(req, res, next) {
	var email = req.query.email || "";
	if (!email) {
        res.json({ error: "Query parameter 'email' not found." })
        return;
    }
	Device.find({UserName: email}).lean().exec(function (err, docs) {
		if (err) {
	    		//console.log(err)
	    		res.json({error: "Internal error occurred!"});
	            return;
    		}

    	//res.json(docs);
    	res.render('device', {email: email, devices: docs});
	})
})

module.exports = router
