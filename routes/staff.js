const router = require('express').Router()
const https = require('https')
const Staff = require('../model/staff')

const fields = {
    _id: 0,
    Guid: 1,
    Description: 1,
    NotesName: 1,
    LocalJobTitle: 1,
    AdMail: 1,
    GuidCompany: 1,
    CompanyFamCode: 1,
    CompanyName: 1,
    FamCodeLegalUnit: 1,
    CostCenter: 1,
    OperationalManager: 1,
    GuidOperationalManager: 1,
    Department: 1,
    Division: 1,
    LocationCity: 1
}
    // FirstName: 1,
    // MiddleName: 1,
    // LastName: 1,

//name for "AdMail", "NotesName"
const qFiled = ["name", "AdMail", "OperationalManagerAdMail", "LocalJobTitle", "CostCenter", "Department"]

router.get('/', function (req, res) {
  res.render('staff');
})

router.post('/', function (req, res) {

    if (req.body.q.key && req.body.q.value) {

        var q_key = encodeURIComponent(req.body.q.key);
        var q_value = encodeURIComponent(req.body.q.value);
        var option = {
            host: 'ssiscndb0018.apac.group.atlascopco.com',
            port: 443,
            path: `/mds/staffs?${q_key}=${q_value}`,
            method: 'GET',
            rejectUnauthorized: false,
            headers: {
                accept: '*/*'
            }
        }

        var request = https.request(option, (response) => {
            var body = ''
            response.on('data', (data) => {
                body += data
            })

            response.on('end', () => {
                res.json(body)
            })
        })

        request.end()

        request.on('error', (e) => {
            res.json({error: "Server is in maintenance.!"})
        })

    }else{
        res.json({error: "Query parameters missing!"})
    }
})

router.get('/users', function (req, res) {
        //console.log(req.query);
      var qbody = req.query;
      var k = qbody.key || "";
      var v = qbody.value || "";
      if(k && v){
        if (qFiled.indexOf(k) !== -1) {
            var q = {'HasLeft': 'No'}
            if (k === 'name') {
                if (v.indexOf(" ") === -1) {
                    q["AdMail"] = new RegExp('\^' + v, 'i');
                }else{
                    q["NotesName"] = new RegExp('\^' + v, 'i');
                }
                getStaffs(res, q, fields, 100);
            }else if(k === 'OperationalManagerAdMail'){
                if (v.indexOf(" ") === -1) {
                    q["AdMail"] = new RegExp('\^' + v, 'i');
                }else{
                    q["NotesName"] = new RegExp('\^' + v, 'i');
                }
                getManager(res, q);
            } else{
                q[k] = new RegExp(v, 'i');
                getStaffs(res, q, fields, 100);
            }

        }else{
            res.json({error: "The value of 'key' is not correct!"})
        }
      } else{
        res.json({error: "Query parameters are missing!"})
      }
    });

    function getStaffs(res, query, project, limit){
        //console.log('getStaffs: ',query);
        Staff.aggregate([{$match: query}, {$project: project}, {$limit: limit}], function (err, staffs) {
            //console.log(staffs);
            if (err) {
                res.json({error: 'Error occurred during query execution!' + project})
            } else {
                res.json(staffs)
            }
        })
    }

    function getManager(res, query){
        Staff.findOne(query, function(err, staff) {
            if (err) {
                res.json({error: 'Error occurred during query execution!'})
            } else {
                if (staff && staff.Guid) {
                    var q = {GuidOperationalManager: staff.Guid, HasLeft: 'No'}
                } else{
                    res.json({error: 'Nothing Found!'});
                    return;
                }
                    getStaffs(res, q, fields, 100);

/*                Staff.aggregate([{$match: q}, {$project: fields}, {$limit:100}], function (err, staffs) {
                    if (err) {
                        res.json({error: 'Error occurred during query execution!'})
                    } else {
                        res.json(staffs)
                    }
                })*/
            }
        })
    }

    router.get('/users/list', function (req, res) {
        //console.log(req.query);
        var qbody = req.query;
        var k = qbody.key || '';
        k = k === 'OperationalManagerAdMail' ? 'name' : k;
        var v = qbody.value || '';
        //console.log("value: " + v)
        if (qFiled.indexOf(k) !== -1) {
            var q = {'HasLeft': 'No'};

            if (k === 'name') {
                if (v.indexOf(' ') === -1) {
                    q['AdMail'] = new RegExp('\^' + v, 'i');
                    k = 'AdMail';
                }else{
                    q['NotesName'] = new RegExp('\^' + v, 'i');
                    k = 'NotesName';
                }
            } else{
                q[k] = new RegExp(v, 'i');
            }
               //getStaffs(res, q, project, 8);
               //console.log(JSON.stringify(q) + ' key:' + k)
            Staff.aggregate(
                [
                    { "$match": q },
                    { "$group": { 
                        "_id": "$" + k, 
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

        }else{
            //console.log("no key found")
            res.json([])
        }

    });

module.exports = router