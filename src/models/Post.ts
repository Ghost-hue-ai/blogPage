import mongoose, { Schema, Document } from "mongoose";

interface Post extends Document {
  heading: string;
  description: string;
  owner: Schema.Types.ObjectId;
  isLikedByCurrentUser: number;
  likes: mongoose.Schema.Types.ObjectId;
}

const postSchema: Schema<Post> = new Schema(
  {
    heading: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isLikedByCurrentUser: {
      type: Number,
      default: 0,
    },
    likes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "likes",
    },
  },
  { timestamps: true }
);

const PostModel =
  (mongoose.models.Post as mongoose.Model<Post>) ||
  mongoose.model("Post", postSchema);

export default PostModel;
