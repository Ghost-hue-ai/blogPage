import mongoose from "mongoose";
import PostModel from "@/models/Post";
import UserModel from "@/models/User";
import CommentModel from "@/models/Comment";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";

interface Params {
  postId: string;
  commentId: string;
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

    const { postId, commentId } = params;
    const userId = session.user._id;

    const comment = await CommentModel.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(commentId),
      owner: new mongoose.Types.ObjectId(userId),
    });

    if (!comment) {
      return Response.json(
        {
          error: "comment not found",
          success: false,
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        message: "successfully deleted the comment",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        error: "failed deleting the post",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: { params: Params }) {
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

    const { newContent } = await req.json();
    if (!newContent) {
      return Response.json(
        {
          error: "content is required to update the comment",
          success: false,
        },
        { status: 400 }
      );
    }

    const { commentId } = params;
    const userId = session.user._id;

    const comment = await CommentModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(commentId),
        owner: new mongoose.Types.ObjectId(userId),
      },
      {
        content: newContent,
      },
      {
        new: true,
      }
    );

    if (!comment) {
      return Response.json(
        {
          error: "failed to update comment",
          success: false,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        message: "successfully updated comment",
        success: false,
        data: comment,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        error: "failed updating the comment",
        success: false,
      },
      { status: 500 }
    );
  }
}
