import express from 'express';
import Comments from '../models/comment.js';
const router = express.Router()

// Getting all
router.get('/', async (req, res) => {
  Comments.find().sort([['voteCount', 'descending']])
    .then((result) => {
      res.json(result)
    })
    .catch((error) => {
      console.log(error);
    })
})

// Getting all for a post
router.get('/from/:id', async (req, res) => {
  var id = req.params.id;
  Comments.find({parentPost: id})
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      console.log(error);
    })
})

// Geting a single comment
router.get('/one/:id', async (req, res) => {
  var id = req.params.id;
  Comments.findOne({_id: id})
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      console.log(error);
    })
})

// Creating One
router.post('/create', (req, res) => {
  const userCommentRequest = {
    user: req.body.user,
    voteCount: req.body.voteCount,
    voted: [req.body.voted],
    parentPost: req.body.parentPost,
    profilePicture: req.body.profilePicture,
    commentText: req.body.commentText
  }
  Comments.create(userCommentRequest);
})

// Deleting One
router.delete('/delete/:id', (req, res) => {
  const voter = req.body.voter;
  const id = req.params.id;
  var sendContent = {};
  Comments.findOne({_id: id}, (error, result) => {
    if(voter !== result.user) {
      sendContent.msg = 'You can\'t delete someone else\'s Comment';
      sendContent.code = 500;
      res.send(sendContent);
    } else {
      result.user = '[Deleted]';
      result.commentText = '[Content Removed]';
      sendContent.msg = 'Comment Deleted';
      sendContent.code = 500;
      res.send(sendContent);
    }
    result.save();
  })
})

// Voting
router.post('/upvote/:id', (req, res) => {
  const id = req.params.id;
  var sendContent = {};
  Comments.findOne({_id: id}, (err, result) => {
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
  var sendContent = {};
  Comments.findOne({_id: id}, (err, result) => {
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
    result.save();
  })
})


export default router