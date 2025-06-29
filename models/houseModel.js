const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
    
    houseName: {
        type: String,
        // required: true,
    },
    houseDescription: {
        type: String,
        // required: true,
    },
    caption: {
        type: String,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    image: {
        type: String,
        required: true,
    }
}, {
    timestamps: { createdAt: true, updatedAt: true },
});

const House = mongoose.model("House", houseSchema);

module.exports = House;
