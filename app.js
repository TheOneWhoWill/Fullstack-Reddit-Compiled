import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import userRouter from './routes/user.js';
import postsRouter from './routes/posts.js';
import commentsRouter from './routes/comments.js';
import subRedditRouter from './routes/subreddit.js';

const app = express()
const PORT = process.env.PORT || 80;
const dbURL = 'mongodb+srv://TheOneWhoWill:Cybercrafter345@main-cluster.yedkf.mongodb.net/AppllicationDB?retryWrites=true&w=majority';

app.use(express.static('build'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log('Connected to db')
  })
  .catch((error) => console.log(error));

mongoose.set('useFindAndModify', false)

app.use('/posts', postsRouter)
app.use('/comments', commentsRouter)
app.use('/community', subRedditRouter)
app.use('/user', userRouter)

app.listen(PORT, () => console.log(`Server Started on port ${PORT}`))