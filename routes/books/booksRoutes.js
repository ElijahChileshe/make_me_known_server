const express = require('express');
const House = require('../../models/houseModel');
const cloudinary = require('../../lib/cloudinary');
const authMiddleware = require('../../middleware/auth.middleware');

const router = express.Router();

// router.post("/", authMiddleware, async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const {houseName, houseDescription, area, rating, image} = req.body;

//         if(!houseName || !houseDescription || !area || !rating || !image) {
//             return res.status(400).json({success: false, error: 'Please fill all the fields'})
//         }

//         const uploadResponse = await cloudinary.uploader.upload(image);
//         const imageUrl = uploadResponse.secure_url;

//         const house = new House({
//             houseName,
//             houseDescription,
//             area,
//             rating,
//             user: userId,
//             image: imageUrl
//         })
 
//         await house.save()

//         res.status(201).json({success: true, house})
//     } catch (error) {
//         console.log("error creating record", error);
//         res.status(500).json({success: false, message: "Internal Error"})
//     }
// })

router.post("/register", authMiddleware, async (req, res) => {
    try {
      const userId = req.user._id;
      const { houseDescription, area, price, images, phoneNumber } = req.body;
  
      if (!houseDescription || !area || !price || !images || !phoneNumber || !Array.isArray(images) || images.length === 0) {
        return res.status(400).json({ success: false, error: 'Please fill all the fields and upload at least one image.' });
      }
  
      // Upload all images to Cloudinary
      const uploadedImages = await Promise.all(
        images.map(async (base64Img) => {
          const uploadRes = await cloudinary.uploader.upload(base64Img);
          return uploadRes.secure_url;
        })
      );
  
      const house = new House({
        houseDescription,
        area,
        price,
        phoneNumber,
        user: userId,
        images: uploadedImages, // store all image URLs
      });
  
      await house.save();
      console.log(house);
      
  
      res.status(201).json({ success: true, house });
  
    } catch (error) {
      console.error("Error creating record:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });
  



  router.get("/houses", authMiddleware, async (req, res) => {
    try {

          
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;
            const skip = (page - 1) * limit;
        
            console.log("📥 Request received:", { page, limit, skip });
        
            const filter = { visibility: 'on' };
        
            const houses = await House.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("user", "username email profileImage");
        
            const total = await House.countDocuments(filter);
            const totalPages = Math.ceil(total / limit);
        
            console.log("✅ Houses found:", houses, "Total pages:", totalPages);


        
            res.status(200).json({
                houses,
                currentPage: page,
                totalHouses: total,
                totalPages
            });
  
    } catch (error) {
      console.error("❌ Error getting records:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });
  
  


// get recommended houses by user
router.get("/user", authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;
        const houses = await House.find({user: userId})
            .sort({createdAt: -1}) // desc order
            .populate("user", "fullName profileImage")
        // res.status(200).json({success: true, houses})
        res.send(houses)
    } catch (error) {
        console.log("error getting records", error);
        res.status(500).json({success: false, message: "Internal Error"})
    }
})

// delete house
router.delete("/house/:id", authMiddleware, async (req, res) => {
    try {
        const house = await House.findById(req.params.id);
        if(!house) {
            return res.status(404).json({success: false, message: "House not found"})
        }
        // check if user is the creator
        if(house.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({success: false, message: "Unauthorized"})
        }

        // delete house from cloudinary
        if (house.images && house.images.includes("cloudinary")) {
            try {
                const publicId = house.images.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);

            } catch (error) {
                console.log("error deleting image from cloudinary", error);
            }
        }
        await house.deleteOne()
        res.status(200).json({success: true, message: "House deleted successfully"})
    } catch (error) {
        console.log("error deleting record", error);
        res.status(500).json({success: false, message: "Internal Error"})
    }
})


// get single house:

router.get("/house/:id", authMiddleware, async (req, res) => {
    console.log("Accessing", req.params.id);
    try {

      const house = await House.findOne({ _id: req.params.id, user: req.user._id });
  
      if (!house) {
        return res.status(404).json({ success: false, message: "House not found" });
      }
  
      res.status(200).json(house);
    } catch (error) {
      console.error("Error fetching house:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });

  router.patch("/house/:id", authMiddleware, async (req, res) => {
    try {
        
      const { price, area, houseDescription, images } = req.body;
  
      const house = await House.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { price, area, houseDescription, images },
        { new: true }
      );
  
      if (!house) {
        return res.status(404).json({ success: false, message: "House not found or unauthorized" });
      }

  
      res.status(200).json(house);
    } catch (error) {
      console.error("Error updating house:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });

  router.patch("/house/:id/visibility", authMiddleware, async (req, res) => {
    try {
      const { visibility } = req.body;
  
      if (!["on", "off"].includes(visibility)) {
        return res.status(400).json({ success: false, message: "Invalid visibility value" });
      }
  
      const house = await House.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { visibility },
        { new: true }
      );
  
      if (!house) {
        return res.status(404).json({ success: false, message: "House not found or unauthorized" });
      }
  
      res.status(200).json({ success: true, house });
    } catch (error) {
      console.error("Error updating visibility:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });
  
  
  

module.exports = router;
