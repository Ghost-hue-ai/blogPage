import mongoose, { Schema, Document } from "mongoose";

interface Comment extends Document {
  content: string;
  owner: Schema.Types.ObjectId;
  post: Schema.Types.ObjectId;
}

const commentSchema: Schema<Comment> = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  { timestamps: true }
);

const CommentModel =
  (mongoose.models.Comment as mongoose.Model<Comment>) ||
  mongoose.model<Comment>("Comment", commentSchema);
export default CommentModel;
