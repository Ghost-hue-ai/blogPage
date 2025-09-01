import mongoose from "mongoose";
import PostModel from "@/models/Post";
import UserModel from "@/models/User";
import CommentModel from "@/models/Comment";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
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

    const { content } = await req.json();

    if (!content) {
      return Response.json(
        {
          error: "content is required to make a comment",
          success: false,
        },
        { status: 400 }
      );
    }

    const { postId } = params;

    const comment = new CommentModel({
      content,
      owner: session.user._id,
      post: postId,
    });

    await comment.save();

    return Response.json(
      {
        message: "successfully created a comment",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        error: "error creating a comment",
        success: false,
        errorObj: error,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request, { params }: { params: Params }) {
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
    const post = await PostModel.findOne({
      _id: new mongoose.Types.ObjectId(postId),
    });
    if (!post) {
      return Response.json(
        {
          error: "post not found",
          success: false,
        },
        { status: 404 }
      );
    }

    const comments = await CommentModel.aggregate([
      {
        $match: {
          post: new mongoose.Types.ObjectId(postId),
        },
      },
      {
        $lookup: {
          from: " users",
          let: { userId: "$owner" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$userId"] },
              },
            },
            {
              $project: {
                username: 1,
                email: 1,
              },
            },
          ],
          as: "owner",
        },
      },
    ]);

    if (comments.length === 0) {
      return Response.json(
        {
          error: "no comments on this post",
          success: true,
        },
        { status: 200 }
      );
    }

    const commentCount = comments.length;

    return Response.json(
      {
        message: "successfully fetched all the comments on the given post ",
        success: true,
        data: comments,
        commentCount,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        error: "error getting all the comments",
        success: false,
      },
      { status: 500 }
    );
  }
}
