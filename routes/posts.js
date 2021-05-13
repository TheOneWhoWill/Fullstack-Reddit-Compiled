import express from 'express';
import Posts from '../models/post.js';
import Users from '../models/user.js';
const router = express.Router()

function hot(voteCount, timePosted) {
  let z = 1.281551565545;
  let right = z*Math.sqrt(voteCount/((Date.now() / 1000) - timePosted));
  let trustScore = right

  return trustScore
}
function sortHot(a, b) {
  a.trust = 0;
  b.trust = 0;
  return (b.trust + hot(b.voteCount, b.created)) - (a.trust + hot(a.voteCount, a.created))
}

// Getting all
router.get('/', async (req, res) => {
  Posts.find().sort([['voteCount', 'descending']])
    .then((result) => {
      res.json(result)
    })
    .catch((error) => {
      console.log(error)
    })
})
// Find One by ID
router.get('/one/:id', (req, res) => {
  var id = req.params.id;
  Posts.findOne({_id: id})
    .then((result) => {
      res.json(result)
    })
    .catch((error) => {
      console.log(error)
    })
})
// Getting One
router.get('/:id', (req, res) => {
  var queryTerm = req.params.id;
  Posts.findOne({title: new RegExp(queryTerm, 'i')})
    .then((result) => {
      res.json(result)
    })
    .catch((error) => {
      console.log(error)
    })
})
// Find one by Sub
router.get('/sub/:id/:type', (req, res) => {

  let id = req.params.id;
  let type = req.params.type;

  Posts.find({subReddit: id})
    .then((result) => {
      switch(type) {
        case 'hot':
          res.json(result.sort(sortHot))
          console.log('hot')
          break;
        case 'new':
          res.json(result.sort((a, b) => b.created - a.created))
          console.log('new')
          break;
        case 'top':
          res.json(result.sort((a, b) => b.voteCount - a.voteCount))
          console.log('top')
          break;
        default:
          res.json(result.sort(sortHot))
      }
    })
    .catch((error) => {
      console.log(error)
    })
})
// Getting All From One User
router.get('/user/:id', (req, res) => {
  var userTerm = `u/${req.params.id}`
  Posts.find({user: userTerm })
    .then((result) => {
      res.json(result)
    })
    .catch((error) => {
      console.log(error)
    })
})
// Getting All for One User
// This is all the subs the user joined
router.get('/user/feed/:id/:type', (req, res) => {

  // Gets uid of User
  let user = req.params.id;
  let type = req.params.type;
  var subs = [];

  // Finding which SubReddits the Uid is subbed to
  Users.find({uid: user})
    .then((result) => {
      var subed = result[0].joined;
      // Adds result to `subs` array
      subed.map(sub => subs.push(sub))
      // Uses `subs` array to look
      // for posts in that array
      Posts.find({subReddit: {'$in': subed} })
        .then((result) => {
          switch(type) {
            case 'hot':
              res.json(result.sort(sortHot))
              break;
            case 'new':
              res.json(result.sort((a, b) => b.created - a.created))
              break;
            case 'top':
              res.json(result.sort((a, b) => b.voteCount - a.voteCount))
              break;
            default:
              res.json(result.sort(sortHot))
          }
        })
        .catch((error) => {
          console.log(error)
        })
    })
})

// Inserting One
router.post('/create', (req, res) => {
  const userPostRequest = {
    user: req.body.user,
    voteCount: req.body.voteCount,
    voted: [req.body.voted],
    subReddit: req.body.subReddit,
    title: req.body.title,
    imageURL: req.body.imageURL,
    created: Math.floor(Date.now() / 1000)
  }
  Posts.create(userPostRequest)
})

router.post('/create/link', (req, res) => {
  const userPostRequest = {
    user: req.body.user,
    voteCount: req.body.voteCount,
    voted: [req.body.voted],
    subReddit: req.body.subReddit,
    title: req.body.title,
    link: req.body.link,
    created: Math.floor(Date.now() / 1000)
  }
  Posts.create(userPostRequest)
})

router.post('/create/text', (req, res) => {
  const userPostRequest = {
    user: req.body.user,
    voteCount: req.body.voteCount,
    voted: [req.body.voted],
    subReddit: req.body.subReddit,
    title: req.body.title,
    text: req.body.text,
    created: Math.floor(Date.now() / 1000)
  }
  Posts.create(userPostRequest)
})

router.delete('/delete/:id', (req, res) => {
  const voter = req.body.voter;
  const id = req.params.id;
  var sendContent = {};
  console.log(voter)

  Posts.findOne({_id: id})
    .then((result) => {
      console.log(result)
      sendContent.code = 500;
      if(result.user === voter) {
        sendContent.msg = 'Post successfully Deleted';
        res.send(sendContent)
        result.delete()
      } else {
        sendContent.msg = 'You can\'t delete someone else\'s Post';
        res.send(sendContent)
      }
    })
    .catch((error) => {
      console.log(error)
    })
})

router.post('/upvote/:id', (req, res) => {
  const id = req.params.id;
  var sendContent = {};
  Posts.findOne({_id: id}, (err, result) => {
    if(err) {
      res.error(err)
    } else {
      if(result.voted.includes(req.body.voter)) {
        sendContent.msg = 'Already Upvoted';
        sendContent.code = 500;
        res.send(sendContent);
      } else {
        result.voteCount = result.voteCount + 1;
        result.voted.push(req.body.voter);
      }
    }
    result.save()
  })
})

router.post('/downvote/:id', (req, res) => {
  const id = req.params.id;

  Posts.findOne({_id: id}, (err, result) => {
    if(err) {
      res.error(err);
    } else {
      if(result.voted.includes(req.body.voter)) {
        result.voteCount = result.voteCount - 1;
        result.voted = result.voted.filter(e => e !== req.body.voter);
      } else {
        result.voteCount = result.voteCount + 1;
        result.voted.push(req.body.voter);
      }
    }
    result.save()
  })
})

export default router