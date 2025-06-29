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



router.get("/", authMiddleware, async (req, res) => {
    try {

        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;


        const houses = await House.find()
            .sort({createdAt: -1}) // desc order
            .skip(skip)
            .limit(limit)
            .populate("user", "fullName profileImage")
        // res.status(200).json({success: true, houses})

        const total = await House.countDocuments();
        const totalPages = Math.ceil(total / limit);
        res.send({
            houses,
            currentPage: page,
            totalHouses: total,
            totalPages      
        })
    } catch (error) {
        console.log("error getting records", error);
        res.status(500).json({success: false, message: "Internal Error"})
    }
})
module.exports = router;
