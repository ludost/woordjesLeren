var fs = require('fs');

var express = require('express');
var router = express.Router();

/* GET listing of existing lijstjes. */
router
  .delete('/:name', function(req, res, next){
    fs.unlinkSync("public/lijstjes/"+req.params.name);
    let list = fs.readdirSync("public/lijstjes")
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(list))
  })
  .post('/:name', function(req, res, next) {
    let newName = req.params.name;
    fs.writeFileSync("public/lijstjes/"+newName,JSON.stringify(req.body))
    let list = fs.readdirSync("public/lijstjes")
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(list))
  })
  .get('/', function(req, res, next) {
    let list = fs.readdirSync("public/lijstjes")
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(list))
  });

module.exports = router;
