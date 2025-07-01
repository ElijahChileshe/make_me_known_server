const mongoose = require ('mongoose');
const bcrypt = require ('bcrypt');


const UserSchema = new mongoose.Schema({
  username: {
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
    // required: true,
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
    minlength: 6,
  },
  profileImage: {
    type: String,
    default: ""
  }
}, {
  timestamps: { createdAt: true, updatedAt: true },
});

// hash password before saving user
UserSchema.pre("save", async function (next) {

  if(!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  next();
})


// compare password
UserSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
}

const User = mongoose.model("User", UserSchema)

module.exports = User;