import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const subredditSchema = new Schema({
  SubredditName: String,
  SubredditHandle: String,
  description: String,
  SubredditPicture: String,
  members: Number,
  mod: String
})

const Subreddits = mongoose.model('SubReddits', subredditSchema, 'SubReddits');
export default Subreddits;