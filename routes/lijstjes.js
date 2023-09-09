import express from "npm:express"
export let router = express.Router();

/* GET listing of existing lijstjes. */
router
  .delete('/:name', function(req, res, next){
    Deno.removeSync("./public/lijstjes/"+req.params.name);
    let list = Array.from(Deno.readDirSync("./public/lijstjes"))
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(list.map((item)=>{ return item.name })))
  })
  .post('/:name', function(req, res, next) {
    let newName = req.params.name;
    Deno.writeTextFileSync("./public/lijstjes/"+newName,JSON.stringify(req.body))
    let list = Array.from(Deno.readDirSync("./public/lijstjes"))
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(list.map((item)=>{ return item.name })))
  })
  .get('/', function(req, res, next) {
    let list = Array.from(Deno.readDirSync("./public/lijstjes"))
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(list.map((item)=>{ return item.name })))
  });

