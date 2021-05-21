import express from 'express';
import Users from '../models/user.js';
const router = express.Router();

router.post('/', (req, res) => {

  let amount = req.body.amount;
  let sender = req.body.sender;
  let recipient = req.body.recipient;

  Users.findOne({uid: sender})
    .then(user => {
      let senderBalance = user.coins;

      if(senderBalance > amount || senderBalance === amount) {
        Users.findOne({user: recipient})
          .then(reciever => {
            if(reciever !== null) {
              user.coins = user.coins - amount;
              reciever.coins = reciever.coins + amount;
              reciever.save();
              user.save()
              res.send({msg: 'Sent Spark Coin Donation Successful'})
            } else {
              res.send({msg: 'Could not find recipient account Data'})
            }
          })
          .catch(err => {
            res.send({msg: 'There.0 was an internal Server Error and we could not Process your Donation'})            
          })
      } else {
        res.send({msg: 'You don\'t have enough Spark Coin to send this Donation'})
      }
    })
    .catch(err => {
      res.send({msg: 'Could not find your account Data'})
    })

})

export default router;