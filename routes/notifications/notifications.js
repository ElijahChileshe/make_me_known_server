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

// GET unread notifications count
router.get("/unreadCount", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const notificationDoc = await Notification.findOne({ user: userId });

    if (!notificationDoc) {
      return res.json({ success: true, data: { count: 0 } });
    }

    const unreadCount = notificationDoc.notifications.filter(n => !n.read).length;
    console.log("unread count", unreadCount)
    res.json({ success: true, data: { count: unreadCount } });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


router.post("/markAllRead", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const notificationDoc = await Notification.findOne({ user: userId });

    if (!notificationDoc) return res.json({ success: true, message: "No notifications" });

    notificationDoc.notifications.forEach(n => n.read = true);
    await notificationDoc.save();

    res.json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



module.exports = router;
