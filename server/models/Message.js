import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, { timestamps: true });


const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
export default Message;