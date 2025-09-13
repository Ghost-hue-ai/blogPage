import mongoose, { Schema, Document } from "mongoose";

interface MessageDocument extends Document {
  content: string;
  sender: mongoose.Schema.Types.ObjectId;
  receiver: mongoose.Schema.Types.ObjectId;
}
const messageSchema: Schema<MessageDocument> = new Schema(
  {
    content: {
      type: String,
      required: [true, "content is required"],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const MessageModel =
  (mongoose.models.Message as mongoose.Model<MessageDocument>) ||
  mongoose.model<MessageDocument>("Message", messageSchema);

export default MessageModel;
