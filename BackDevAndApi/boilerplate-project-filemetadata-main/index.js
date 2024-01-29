const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser')

require('dotenv').config()

var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}))
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const storage = multer.memoryStorage();
const upload = multer({storage:storage});

app.post('/api/fileanalyse',upload.single('upfile'), function (req, res) {
  if (req.file && req.file.size) {
    res.json({
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size
    });
  }
  else {
    res.json({
      error: 'error with file upload'
    });
  }
});


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
