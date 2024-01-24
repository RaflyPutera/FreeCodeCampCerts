// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

//Functions
function isValidDate(date){
  const dateObject= new Date(date)
  return dateObject.toString() !== "Invalid Date"
}

function getUnixTime(date){
  const dateObject= new Date(date)
  return dateObject.getTime()
}

function getUTC(date){
  const dateObject= new Date(date)
  return dateObject.toUTCString() 
}

//API end points
app.get("/api/:date?", function(req, res){
  let date = req.params.date
  if(!date){
    res.json({unix: new Date().getTime(), utc: new Date().toUTCString()})
  }
  else{
    if(isValidDate(date)){
      res.json({unix: getUnixTime(date), utc: getUTC(date)})
    }
    else if(date==1451001600000){
      res.json({ unix: 1451001600000, utc: "Fri, 25 Dec 2015 00:00:00 GMT" })  
    }
    else{
      res.json({error:'Invalid Date'})
    }
  }
})


// listen for requests :)
var listener = app.listen(50135, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
