const express = require('express');
const House = require('../../models/houseModel');
const cloudinary = require('../../lib/cloudinary');
const authMiddleware = require('../../middleware/auth.middleware');

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;
        const {houseName, houseDescription, caption, rating, image} = req.body;

        if(!houseName || !houseDescription || !caption || !rating || !image) {
            return res.status(400).json({success: false, error: 'Please fill all the fields'})
        }

        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;

        const house = new House({
            houseName,
            houseDescription,
            caption,
            rating,
            user: userId,
            image: imageUrl
        })
 
        await house.save()

        res.status(201).json({success: true, house})
    } catch (error) {
        console.log("error creating record", error);
        res.status(500).json({success: false, message: "Internal Error"})
    }
})

module.exports = router;
