import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import LikeModel from "@/models/Like";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

interface Params {
  postId: string;
}
export async function POST(req: Request, { params }: { params: Params }) {
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
    const userId = session.user._id;
    const { postId } = params;
    const alreadyExistingLikeModel = await LikeModel.findOne({
      post: new mongoose.Types.ObjectId(postId),
      owner: new mongoose.Types.ObjectId(userId),
    });

    if (alreadyExistingLikeModel) {
      return Response.json(
        {
          error: "cannot like the same post twice",
          success: false,
        },
        { status: 400 }
      );
    }

    const like = new LikeModel({
      owner: userId,
      post: postId,
      isLiked: true,
    });

    await like.save();

    return Response.json(
      {
        message: "successfully created like document",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        error: "error creating a like model",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request, { params }: { params: Params }) {
  await dbConnect();
  try {
    const { postId } = params;

    const likes = await LikeModel.aggregate([
      {
        $match: {
          post: new mongoose.Types.ObjectId(postId),
          isLiked: true,
        },
      },
      {
        $lookup: {
          from: "users",
          let: { userId: "$owner" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
            { $project: { username: 1, _id: 1 } },
          ],
          as: "owner",
        },
      },
      {
        $unwind: "$owner",
      },
    ]);

    if (likes.length === 0) {
      return Response.json(
        {
          message: "no likes on this post",
          success: true,
        },
        { status: 203 }
      );
    }
    const likesCount = likes.length;

    return Response.json(
      {
        message: "successfully fetched likes for given post",
        success: true,
        data: likes,
        likesCount,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        error: "error retrieving likes for this post",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Params }) {
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

    const { postId } = params;
    const userId = session.user._id;

    const like = await LikeModel.findOneAndDelete({
      post: new mongoose.Types.ObjectId(postId),
      owner: new mongoose.Types.ObjectId(userId),
    });

    if (!like) {
      return Response.json(
        {
          error: "like model not found",
          success: false,
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        message: "successfully deleted the like",
        success: true,
        data: like,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        error: "error deleting the like",
        success: false,
      },
      { status: 500 }
    );
  }
}
