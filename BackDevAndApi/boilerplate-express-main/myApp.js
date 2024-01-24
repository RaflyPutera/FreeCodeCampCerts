require('dotenv').config();
bodyParder = require('body-parser');

const bodyParser = require('body-parser');
let express = require('express');
console.log("Hello World")

let app = express();
absolutePath= __dirname + '/views/index.html'

app.use(bodyParser.urlencoded({extended:false}))
app.use("/public",express.static(__dirname+"/public"))

app.get('/', function (req, res) {
    res.sendFile(absolutePath);
})

app.get("/json",function (req,res) {
    console.log(req.method+" "+req.path+" - "+req.ip)
    if (process.env.MESSAGE_STYLE==="uppercase"){
        res.json({"message":"HELLO JSON"})
    }
    else{
        res.json({
            "message":"Hello json",
        })
    }
})

app.get('/now',function (req,res,next){
    req.time= new Date().toString()
    next()
},function (req,res){
    res.json({
        "time":req.time,
    })
})

app.get('/:word/echo',function (req,res){
    res.json({
        "echo":req.params.word,
    })
})

app.route('/name')
    .get(function (req,res){
        res.json({
            "name":req.query.first+" "+req.query.last,
        })
    })
    .post(function (req,res){
        res.json({
            "name":req.body.first+" "+req.body.last,
        })
    })
































 module.exports = app;
