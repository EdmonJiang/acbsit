const router = require('express').Router(),
    Site = require('../model/site'),
    ip = require('ip');
const ipregex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const preregex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/
router.get('/', function (req, res) {
  //console.log(req.query)

  if(req.query.q && req.query.key){
    //console.log('query not empty')
    var query = {};
    var k = req.query.key.trim()
    var v = req.query.q.trim()
    query[k] = new RegExp('\^'+v.replace(/(\/)|(\\)|(\*)|(\?)|(\<)|(\>)|(\")|(\.)/g, ' '), 'i');

    if(k === 'Subnets' && ValidateIPaddress(v)){
 
      var promise = Site.find().distinct('Subnets').exec()
      promise.then(function(docs){
        var results = docs.filter(function(item){
            var arr = item.split('/')
            if(arr.length !== 2){return false;}
            return ipregex.test(arr[0]) && ipregex.test(arr[1]) && ip.subnet(arr[0], arr[1]).contains(v)
          })

        if(results[0] && results[0].length>10){
          Site.find({Subnets: results[0]}).limit(10).lean().exec(function(err, sites){
            if(err){return res.render('index', {errors: 'IP Query Error!'})};
            if(sites.length>0){
              //console.log(sites)
              for(var site of sites){
                delete site["_id"];
              }
              res.render('index',{infos: sites, keyword: v, key: k})
            }else{
              res.render('index', {errors: "Nothing found!", keyword: v, key: k||"SiteID"});
            }
          })
        }else{
          res.render('index', {errors: "Nothing found!", keyword: v, key: k});
          return
        }
        
      }, function (err) {
        res.render('index', {errors: "Nothing found!", keyword: v, key: k});
        return
      })

    }else{

      Site.find(query).limit(10).lean().exec(function(err, sites){
        if(err){return res.render('index', {errors: 'Query Error!'})};
        if(sites.length>0){
          //console.log(sites)
          for(var site of sites){
            delete site["_id"];
          }
          res.render('index',{infos: sites, keyword: v, key: k})
        }else{
          res.render('index', {errors: "Nothing found!", keyword: v, key: k||"SiteID"});
        }
      })
    
    }
  }else{
    //console.log('query is empty')
    res.render('index', {key: "SiteID"});
  }
});

router.post('/', function (req, res) {
  //console.log(req.query)

  if(req.body.value && req.body.key){
    //console.log('query not empty')
    var query = {};
    var k = req.body.key.trim()
    var v = req.body.value.trim()
    query[k] = new RegExp('\^'+v.replace(/(\/)|(\\)|(\*)|(\?)|(\<)|(\>)|(\")|(\.)/g, ' '), 'i');

    if(k === 'Subnets' && ValidateIPaddress(v)){
  
      var promise = Site.find().distinct('Subnets').exec()
      promise.then(function(docs){
        var results = docs.filter(function(item){
            var arr = item.split('/')
            if(arr.length !== 2){return false;}
            return ip.subnet(arr[0].trim(), arr[1].trim()).contains(v)
          })

        if(results[0] && results[0].length>10){
          Site.find({Subnets: results[0]}).limit(10).lean().exec(function(err, sites){
            if(err){return res.json({error: 'IP Query Error!'})};
            if(sites.length>0){
              //console.log(sites)
              for(var site of sites){
                delete site["_id"];
              }
              res.json(sites)
            }else{
              res.json({error: "Nothing found for the IP!"});
            }
          })
        }else{
          return res.json({error: "Nothing found for the IP!"});
        }
        
      }, function (err) {
        return res.json({error: "Nothing found!"});
      })

    }else{

      Site.find(query).limit(10).lean().exec(function(err, sites){
        if(err){return res.json({error: 'Query error occurred!'})};
        if(sites.length>0){
          //console.log(sites)
          for(var site of sites){
            delete site["_id"];
          }
          res.json(sites)
        }else{
          res.json({error: "Nothing found!"});
        }
      })
    
    }
  }else{
    res.json({error: "Query parameters missing!"});
  }
});

function ValidateIPaddress(ipaddress)   
{  
  return ipregex.test(ipaddress)
}


module.exports = router;