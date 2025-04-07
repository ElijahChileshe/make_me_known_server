const mongoose = require ('mongoose')


const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  }
}, {
  timestamps: { createdAt: true, updatedAt: true },
});


const User = mongoose.model("User", UserSchema)

module.exports = User;