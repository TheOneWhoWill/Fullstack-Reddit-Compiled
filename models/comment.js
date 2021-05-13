import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  user: String,
  voteCount: Number,
  voted: Array,
  parentPost: String,
  profilePicture: String,
  commentText: String
})

const Comments = mongoose.model('Comments', commentSchema, 'Comments');
export default Comments;