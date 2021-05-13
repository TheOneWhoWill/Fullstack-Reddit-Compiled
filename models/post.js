import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: String,
  voteCount: Number,
  voted: Array,
  subReddit: String,
  link: String,
  text: String,
  title: String,
  imageURL: String,
  created: Number
})

const Posts = mongoose.model('Posts', postSchema, 'Posts');
export default Posts;