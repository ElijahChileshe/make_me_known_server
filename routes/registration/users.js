var express = require('express');
const User = require('../../models/UserModel');
const jwt = require('jsonwebtoken');

var router = express.Router();

const generateToken = (user_id) => {
    return jwt.sign({user_id}, process.env.JWT_SECRET, { expiresIn: "1d" })
}

/* GET users listing. */
router.post("/register", async (req, res) => {

    try {
      const {fullName, email, password, phoneNumber, city, country} = req.body;

      console.log(req.body);

      if(!fullName || !email || !password) {
            return res.status(400).json({success: false, error: 'Please fill all the fields'})
      }

      if(password.length < 6) {
          return res.status(400).json({success: false, error: 'Password must be at least 6 characters'})
      }

      if(fullName.length < 3) {
          return res.status(400).json({success: false, error: 'Full name must be at least 3 characters'})
      }

      //if user exists   
      const existing_User = await User.findOne({email})

      if(existing_User) {
          return res.status(400).json({success: false, error: 'User already exists'})
        }

    // get profile image
    const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`

      const user = new User({
          fullName,
          email,
          password,
          phoneNumber,
          city,
          country,
          profileImage

      })

      await user.save()

    //   generate token
      const token = generateToken(user._id)
      // res.send(user)
      res.status(201).json({token: token,user: {fullName: user.fullName, email: user.email, id: user._id, city: user.city, country: user.country, phoneNumber: user.phoneNumber}})
    } catch (error) {

        res.status(500).json({success: false, message: "Internal Error"})
        
    }  
})

module.exports = router;
