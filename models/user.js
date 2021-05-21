import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  uid: String,
  joined: Array,
  coins: Number
})

const Users = mongoose.model('Users', userSchema, 'Users');
export default Users;