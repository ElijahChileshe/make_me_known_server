const express = require("express");
const router = express.Router();
const Notification = require("../../models/notificationModel");
const authMiddleware  = require("../../middleware/auth.middleware"); // your auth middleware

// GET user notifications
router.get("/", authMiddleware, async (req, res) => {
    console.log("hit no");
  try {
    const userId = req.user._id;
    let notification = await Notification.findOne({ user: userId });
    if (!notification) {
      // Create default settings if not exist
      notification = await Notification.create({ user: userId });
    }
    console.log("Notifications settings:", notification);
    res.json({ success: true, data: notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST update notifications
router.post("/", authMiddleware, async (req, res) => {
    console.log("post notification");
  try {
    const userId = req.user._id;
    const { preferences, areas } = req.body;

    let notification = await Notification.findOne({ user: userId });
    if (!notification) {
      notification = new Notification({ user: userId });
    }

    notification.preferences = preferences || notification.preferences;
    notification.areas = areas || notification.areas;

    const updatedNotification = await notification.save();

    console.log("Updated notification settings:", updatedNotification);

    res.json({ success: true, message: "Notification settings saved", data: notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
