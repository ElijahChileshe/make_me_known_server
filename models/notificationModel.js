// const mongoose = require("mongoose");

// const NotificationSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   preferences: {
//     houseDescription: { type: Boolean, default: true },
//     area: { type: Boolean, default: true },
//     price: { type: Boolean, default: true },
//   },
//   areas: [
//     {
//       name: { type: String, required: true },
//       enabled: { type: Boolean, default: true },
//     },
//   ],
// }, {
//   timestamps: true,
// });

// module.exports = mongoose.model("Notification", NotificationSchema);

const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  preferences: {
    houseDescription: { type: Boolean, default: true },
    area: { type: Boolean, default: true },
    price: { type: Boolean, default: true },
  },
  areas: [
    {
      name: { type: String, required: true },
      enabled: { type: Boolean, default: true },
    },
  ],
  notifications: [
    {
      title: { type: String, required: true },
      body: { type: String, required: true },
      data: { type: Object },
      read: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
    },
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model("Notification", NotificationSchema);
