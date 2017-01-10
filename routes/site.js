const router = require('express').Router(),
    Site = require('../model/site'),
    ip = require('ip');

router.get('/', function (req, res) {
  //console.log(req.query)

  if(req.query.q && req.query.key){
    //console.log('query not empty')
    var query = {};
    var k = req.query.key.trim()
    var v = req.query.q.trim()
    query[k] = new RegExp('\^'+v, 'i');

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
            if(err){return res.render('index', {errors: 'IP Query Error!'})};
            if(sites.length>0){
              //console.log(sites)
              for(var site of sites){
                delete site["_id"];
              }
              res.render('index',{infos: sites, keyword: v, key: k})
            }else{
              res.render('index', {errors: "Nothing found!", keyword: v, key: k||"Site_ID"});
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
          res.render('index', {errors: "Nothing found!", keyword: v, key: k||"Site_ID"});
        }
      })
    
    }
  }else{
    //console.log('query is empty')
    res.render('index', {key: "Site_ID"});
  }
});

function ValidateIPaddress(ipaddress)   
{  
 if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress))  
  {  
    return true;
  }  
//alert("You have entered an invalid IP address!")  
return false; 
}


module.exports = router;