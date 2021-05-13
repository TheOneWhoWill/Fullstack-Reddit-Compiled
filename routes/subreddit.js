import express from 'express';
import SubReddit from '../models/subreddit.js';
const router = express.Router()

// Getting all
router.get('/', async (req, res) => {
  SubReddit.find()
    .then((result) => {
      res.json(result)
    })
    .catch((error) => {
      console.log(error);
    })
})

// Getting Trending
router.get('/trending', async (req, res) => {
  SubReddit.find().limit(5)
    .then((result) => {
      res.json(result)
    })
    .catch((error) => {
      console.log(error);
    })
})


// Getting all for a SubReddit
router.get('/from/:id', async (req, res) => {
  var id = req.params.id;
  SubReddit.find({parentPost: id})
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      console.log(error);
    })
})

// Getting One
router.get('/:id', (req, res) => {
  var queryTerm = req.params.id;
  SubReddit.find({SubredditHandle: queryTerm})
    .then((result) => {
      res.json(result)
    })
    .catch((error) => {
      console.log(error)
    })
})

// Checking if One Exists
router.get('/exists/:id', (req, res) => {
  var queryTerm = req.params.id;
  SubReddit.find({SubredditHandle: queryTerm})
    .then(result => {
      if(result.length === 0) {
        res.send(false)
      } else {
        res.send(true)
      }
    })
})

// Getting One
router.get('/query/:id', (req, res) => {
  var queryTerm = req.params.id;
  SubReddit.find({SubredditHandle: new RegExp(queryTerm, 'i')})
    .then((results) => {
      res.json(results)
    })
    .catch((error) => {
      console.log(error)
    })
})

// Inserting One
router.post('/create', (req, res) => {
  const userSubRequest = {
    SubredditName: req.body.SubredditName,
    SubredditHandle: req.body.SubredditHandle,
    description: req.body.description,
    SubredditPicture: req.body.SubredditPicture,
    members: 0,
    mod: req.body.mod
  }
  SubReddit.create(userSubRequest)
})

export default router