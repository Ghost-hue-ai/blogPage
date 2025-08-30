import mongoose, { Schema, Document } from "mongoose";

interface Like extends Document {
  owner: Schema.Types.ObjectId;
  post: Schema.Types.ObjectId;
  isLiked: boolean;
}

const likeSchema: Schema<Like> = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    isLiked: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const LikeModel =
  (mongoose.models.Like as mongoose.Model<Like>) ||
  mongoose.model<Like>("Like", likeSchema);

export default LikeModel;
