import express from 'express';
import Users from '../models/user.js';
import SubReddit from '../models/subreddit.js';
const router = express.Router()

// Getting all for a User
router.get('/', async (req, res) => {

  var id = req.params.user;

  Users.find()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.log(error);
    })

})

// Getting all for a User
router.get('/:user', async (req, res) => {

  var id = req.params.user;

  Users.find({uid: id})
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.log(error);
    })

})

// Join a Cummunity
router.post('/join/:id', (req, res) => {

  const id = req.params.id;
  const cummunity = req.body.cummunity;

  Users.findOne({uid: id}, (err, result) => {
    //Updating Member count
    SubReddit.findOne({SubredditHandle: cummunity})
      .then((result) => {
        result.members = result.members + 1;
        result.save()
      })
      .catch((error) => {
        console.log(error);
      })

    result.joined.push(cummunity)
    result.save()
    res.send(result)
  })

})

// Leave a Cummunity
router.post('/leave/:id', (req, res) => {

  const id = req.params.id;
  const cummunity = req.body.cummunity;

  Users.findOne({uid: id}, (err, result) => {
    //Updating Member count
    SubReddit.findOne({SubredditHandle: cummunity})
      .then((result) => {
        result.members = result.members - 1;
        result.save()
      })
      .catch((error) => {
        console.log(error);
      })

    // Looks through an array and removes any occurances
    // of the Cummunity you want to leave
    result.joined.splice(result.joined.indexOf(cummunity), 1); 
    result.save()
    res.send(result)
  })

})

export default router;