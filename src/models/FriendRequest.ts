import mongoose, { Mongoose, Schema } from "mongoose";

interface Request {
  RequestSender: mongoose.Schema.Types.ObjectId;
  RequestReceiver: mongoose.Schema.Types.ObjectId;
  status: string;
  accepted: string;
}

const friendRequestSchema: Schema<Request> = new Schema(
  {
    RequestSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    RequestReceiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      default: "SEND",
    },
    accepted: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

const RequestModel =
  (mongoose.models.Request as mongoose.Model<Request>) ||
  mongoose.model("Request", friendRequestSchema);
export default RequestModel;
