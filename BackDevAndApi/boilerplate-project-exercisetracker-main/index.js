const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:false}))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

mongoose.connect(process.env.MONGO_URI)

//models
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
}));

const Exercise = mongoose.model('Exercise', new mongoose.Schema({
  user_id:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  description: String,
  duration: Number,
  date: String,
}));

//API endpoints
app.route('/api/users')
  .post(async function(req,res) {
    try{
      const username = req.body.username
      const newUser = new User({username:username})
      const userAdded= await newUser.save()
      res.json({username:userAdded.username,_id:userAdded._id})
      console.log(userAdded)
    }
    catch(err){
      res.json({error:err})
    }
  })
  .get(async function(req,res){
    const allUsers = await User.find({})
    const eachUser = allUsers.map(user=>({
      username:user.username,
      _id:user._id,
    }))
    res.json(eachUser)
  })


  
app.post('/api/users/:_id/exercises',async function(req,res){
  try {
    const id = req.params._id;
    const user = await User.findById(id);
    if (!req.body.date) {
      req.body.date = new Date().toDateString();
    }
    
    const addExercise = {
      user_id: id.toString(),
      description: req.body.description,
      duration: req.body.duration,
      date: new Date(req.body.date).toDateString(),
    };

    const newExercise = new Exercise(addExercise);
    const exerciseAdded = await newExercise.save();

    res.json({
      username: user.username,
      description: exerciseAdded.description,
      duration: exerciseAdded.duration,
      date: exerciseAdded.date,
      _id: user._id.toString(),
    });
    console.log({
      username: user.username,
      description: exerciseAdded.description,
      duration: exerciseAdded.duration,
      date: exerciseAdded.date,
      _id: user._id.toString(),
    })
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.get('/api/users/:id/logs',async function (req,res){
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    let exercises = await Exercise.find({user_id:id})
    
    if (req.query.from && req.query.to) {
      const fromDate = new Date(req.query.from);
      const toDate = new Date(req.query.to);
      // console.log(exercises)
      exercises = exercises.filter((exercise) => {
        // console.log(exercises)
        const exerciseDate = new Date(exercise.date);
        return exerciseDate >= fromDate && exerciseDate <= toDate;
      })
    }
    if (req.query.limit) {
      exercises = exercises.slice(0,parseInt(req.query.limit));
    }
    res.json({
      username: user.username,
      count: exercises.length,
      _id: user._id.toString(),
      log:exercises,
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
