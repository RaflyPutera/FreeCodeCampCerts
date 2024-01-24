require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}))
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//function
const urlMapper=new Map()

function isValidUrl(url){
  try {
    const urlObject = new URL(url);
    return urlObject.protocol === "http:" || urlObject.protocol === "https:";
  } catch (error) {
    return false;
  }
}

function urlShortener(url){
  return toString(urlMapper.size + 1)
}

//API endpoint
app.route('/api/shorturl')
  .get((req, res) => {
    res.json({original_url:req.query.url, short_url:req.query.url})
  })
  .post((req, res) => {
    if(isValidUrl(req.body.url)===true){
      const short_url=urlShortener(req.body.url)
      urlMapper.set(short_url,req.body.url)
      res.json({original_url:req.body.url, short_url:short_url})
    }
    else{
      res.json({error:"invalid url"})
    }
  })

app.get('/api/shorturl/:short_url?',(req,res)=>{
  if(urlMapper.has(req.params.short_url)){
    res.redirect(urlMapper.get(req.params.short_url))
  }
  else{
    res.json({error:"invalid url"})
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
