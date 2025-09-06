import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import RequestModel from "@/models/FriendRequest";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
interface Params {
  id: string;
}

export async function GET(req: Request) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json(
        {
          error: "unauthorized request",
          success: false,
        },
        { status: 401 }
      );
    }
    const userId = session?.user._id;

    const friends = await RequestModel.aggregate([
      {
        $match: {
          $or: [
            {
              $and: [
                { RequestSender: new mongoose.Types.ObjectId(userId) },
                { status: "ACCEPTED" },
              ],
            },
            {
              $and: [
                { RequestReceiver: new mongoose.Types.ObjectId(userId) },
                { status: "ACCEPTED" },
              ],
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          let: { senderId: "$RequestSender" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$senderId"] },
              },
            },
            {
              $project: {
                _id: 1,
                username: 1,
              },
            },
          ],
          as: "RequestSender",
        },
      },
      {
        $unwind: "$RequestSender",
      },
    ]);

    if (friends.length === 0) {
      return Response.json(
        {
          message: "no friends found",
          success: true,
        },
        { status: 200 }
      );
    }
    return Response.json(
      {
        message: "successfully fetched friends",
        data: friends,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        error: "Internal Server Error",
        errObj: error,
        success: false,
      },
      { status: 500 }
    );
  }
}
