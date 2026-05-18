// controllers/message.controller.js
const Message = require("../models/Message");
const User    = require("../models/User");

// ─── SEND MESSAGE ─────────────────────────────────────────
const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    const receiver = await User.findById(receiverId);
    if (!receiver) return res.status(404).json({ success: false, message: "Receiver not found" });

    const message = await Message.create({
      sender: req.session.user._id,
      receiver: receiverId,
      text,
    });

    await message.populate("sender", "name avatar role");
    await message.populate("receiver", "name avatar role");

    res.status(201).json({ success: true, message: "Message sent", data: message });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET CONVERSATION between current user & another ─────
const getConversation = async (req, res) => {
  try {
    const myId    = req.session.user._id;
    const otherId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: myId,    receiver: otherId },
        { sender: otherId, receiver: myId    },
      ],
    })
      .populate("sender",   "name avatar role")
      .populate("receiver", "name avatar role")
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { sender: otherId, receiver: myId, isRead: false },
      { isRead: true }
    );

    res.json({ success: true, count: messages.length, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET MY INBOX (all unique chats) ──────────────────────
const getInbox = async (req, res) => {
  try {
    const myId = req.session.user._id;

    // Get latest message from each conversation partner
    const messages = await Message.find({
      $or: [{ sender: myId }, { receiver: myId }],
    })
      .populate("sender",   "name avatar role")
      .populate("receiver", "name avatar role")
      .sort({ createdAt: -1 });

    // Build unique chats map keyed by the OTHER user's id
    const chatMap = new Map();
    for (const msg of messages) {
      const other = msg.sender._id.toString() === myId.toString()
        ? msg.receiver
        : msg.sender;
      if (!chatMap.has(other._id.toString())) {
        chatMap.set(other._id.toString(), {
          user: other,
          lastMessage: msg.text,
          lastTime: msg.createdAt,
          unread: 0,
        });
      }
    }

    // Count unread per conversation
    const unreadCounts = await Message.aggregate([
      { $match: { receiver: myId, isRead: false } },
      { $group: { _id: "$sender", count: { $sum: 1 } } },
    ]);
    for (const u of unreadCounts) {
      const key = u._id.toString();
      if (chatMap.has(key)) chatMap.get(key).unread = u.count;
    }

    res.json({ success: true, chats: Array.from(chatMap.values()) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET ALL MESSAGES (Admin) ─────────────────────────────
const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .populate("sender",   "name email role")
      .populate("receiver", "name email role")
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ success: true, count: messages.length, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { sendMessage, getConversation, getInbox, getAllMessages };
