var express = require('express');
var router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
// const user = require('../models/user');

////////get All users
router.get('/',(req , res , next)=>{
  User.find().select('_id username password')
  .then(doc =>{
    res.status(202).json({
      users : doc
    })
  })
})
////////////


///////get user by id
router.get('/:userId',(req,res,next)=>{
  User.findById({_id:req.params.userId}).select('_id username password')
  .then(result =>{

    res.status(200).json({
      message:result
    });
  })
  .catch(error=>{
    res.status(404).json({
      message:error
    });
  })
});
///////////

///create user - sign up
router.post('/signup', (req, res, next) => {
  User.find({ username: req.body.username }).then(result => {

    if (result.length < 1) {

      bcrypt.hash(req.body.password, 10, (error, hash) => {
        if (error) {

          res.status(404).json({
            'message': error
          });

        } else {

          const user = new User({
            username: req.body.username,
            password: hash
          });

          user.save()
            .then(result => {
              console.log(result)
              res.status(200).json({
                'message': 'User created'
              });
            })
            .catch(error => {
              res.status(404).json({
                'message': error
              });
            })

        }


      })

    } else {
      res.status(404).json({
        'message': 'Username already used'
      });
    }
  })
    .catch(error => {

      console.log(error);
    })

});
/////////////////

//sign in
router.get('/signin', (req, res, next) => {

  User.find({ username: req.body.username })
    .then(user => {

      console.log(user);
      if (user.length >= 1) {

        bcrypt.compare(req.body.password, user[0].password)
          .then(result => {
            if (result) {
              res.status(200).json({
                message: 'sign in success'
              });
            } else {
              res.status(404).json({
                message: 'wrong password'
              });
            }

          })
          .catch(error => {
            res.status(404).json({
              'message': error
            });
          })

      } else {
        res.status(404).json({
          'message': 'User not found'
        });
      }

    })
    .catch(error => {

      res.status(404).json({
        message: error
      });

    })

});
/////////////////////

///update user
router.patch('/update/:id', (req, res, next) => {

  bcrypt.hash(req.body.password, 10)
    .then(hash => {

      const newUser = {
        username: req.body.username,
        password: hash
      };

      User.findOneAndUpdate({ _id: req.params.id }, { $set: newUser })
        .then(result => {
          if (result) {
            console.log(result);
            res.status(202).json({
              message: 'user updated'
            });
          } else {
            res.status(404).json({
              message: "User not found"
            });
          }

        }).catch(error => {

          res.status(404).json({
            message: error
          });

        })


    }).catch(error => {

      res.status(404).json({
        message: error
      });

    })

});
//////////////////

///delete user
router.delete('/delete/:id', (req, res, next) => {

  user.findOneAndDelete({ _id: req.params.id })
    .then(result => {

      if (result) {
        // const username = req.body.username
        // message: username+' deleted'
        console.log(result);;
        res.status(200).json({
          message: 'deleted'
        });
      } else {
        res.status(404).json({
          message: 'user not found'
        });
      }
      
    }).catch(error => {
      res.status(404).json({
        message: error
      });
    })


});

module.exports = router;
