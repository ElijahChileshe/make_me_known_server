var express = require('express');
const User = require('../../models/UserModel');
var router = express.Router();

/* GET users listing. */
router.post("/register", async(req, res) => {


  const {fullName, email, password, phoneNumber, city, country} = req.body;

      const findUser = await User.findOne({email})

      if(findUser) 
          return res.status(400).json({success: false, error: 'User already exists'})

      const user = new User({
          fullName,
          email,
          password,
          phoneNumber,
          city,
          country

      })

      await user.save()
      // res.send(user)
      res.json({success: true, user: {fullName: user.fullName, email: user.email, id: user._id, verified: user.verified, city: user.city, country: user.country, phoneNumber: user.phoneNumber}})
  
})

module.exports = router;
