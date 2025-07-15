const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
    
    price: {
        type: String,
        // required: true,
    },
    houseDescription: {
        type: String,
        // required: true,
    },
    area: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    visibility: {
        type: String,
        enum: ["on", "off"],
        default: "on"
    },
    // rating: {
    //     type: Number,
    //     required: true,
    //     min: 1,
    //     max: 5,
    // },
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    images: {
        type: Array,
        required: true,
    }
}, {
    timestamps: { createdAt: true, updatedAt: true },
});

const House = mongoose.model("House", houseSchema);

module.exports = House;
