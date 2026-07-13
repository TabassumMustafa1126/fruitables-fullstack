const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    text: { type: String, required: true },
  },
  { _id: false, timestamps: true }
);

const aiChatSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AiChat', aiChatSchema);
