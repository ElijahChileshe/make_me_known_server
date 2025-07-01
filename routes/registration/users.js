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
      const {username, email, password, phoneNumber, city, country} = req.body;

      console.log(req.body);

      if(!username || !email || !password) {
            return res.status(400).json({success: false, error: 'Please fill all the fields'})
      }

      if(password.length < 6) {
          return res.status(400).json({success: false, error: 'Password must be at least 6 characters'})
      }

      if(username.length < 3) {
          return res.status(400).json({success: false, error: 'Full name must be at least 3 characters'})
      }

      //if user exists   
      const existing_User = await User.findOne({email})

      if(existing_User) {
          return res.status(400).json({success: false, error: 'User already exists'})
        }

    // get profile image
    const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`

      const user = new User({
          username,
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
      res.status(201).json({token: token,user: {username: user.username, email: user.email, id: user._id, city: user.city, country: user.country, phoneNumber: user.phoneNumber}})
    } catch (error) {

        res.status(500).json({success: false, message: "Internal Error"})
        
    }  
})


router.post("/login", async (req, res) => { 
    try {
        const {email, password} = req.body
        
        if(!email || !password) {
            return res.status(400).json({success: false, error: 'Please fill all the fields'})
        }

        // check if user exists
        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({success: false, error: 'Invalid credentials'})
        }

        // check if password is correct
        const isPasswordCorrect = await user.comparePassword(password)
        if(!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials"})

        // generate token
        const genToken = generateToken(user._id)

        res.status(200).json({
            genToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                city: user.city,
                country: user.country,
                phoneNumber: user.phoneNumber,
                profileImage: user.profileImage
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Internal Error"})
    }
})



module.exports = router;
