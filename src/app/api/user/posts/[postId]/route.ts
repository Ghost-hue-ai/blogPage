import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import PostModel from "@/models/Post";
import { authOptions } from "../../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

interface Params {
  postId: string;
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

    const post = await PostModel.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(postId),
      owner: new mongoose.Types.ObjectId(userId),
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

    return Response.json(
      {
        message: "successfully deleted the post",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        error: "failed deleting the post",
        errorObject: error,
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
    const reqBody = await req.json();
    const newHeading = reqBody?.newHeading || undefined;
    const newDescription = reqBody?.newDescription || undefined;
    if (!newHeading && !newDescription) {
      return Response.json(
        {
          error: "heading and description is needed",
          success: false,
        },
        { status: 400 }
      );
    }

    const { postId } = params;
    const userId = session.user._id;

    if (newHeading && !newDescription) {
      const post = await PostModel.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(postId),
          owner: new mongoose.Types.ObjectId(userId),
        },
        { heading: newHeading },
        { new: true }
      );

      if (!post) {
        return Response.json(
          {
            error: "post not found",
            success: false,
          },
          { status: 404 }
        );
      }
    } else if (newDescription && !newHeading) {
      const post = await PostModel.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(postId),
          owner: new mongoose.Types.ObjectId(userId),
        },
        { description: newDescription }
      );

      if (!post) {
        return Response.json(
          {
            error: "post not found",
            success: false,
          },
          { status: 404 }
        );
      }
    } else if (newHeading && newDescription) {
      const post = await PostModel.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(postId),
          owner: new mongoose.Types.ObjectId(userId),
        },
        { heading: newHeading }
      );

      if (!post) {
        return Response.json(
          {
            error: "post not found",
            success: false,
          },
          { status: 404 }
        );
      }
    }

    return Response.json(
      {
        message: "successfully Updated the post",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        error: "failed updating the post",
        errorObject: error,
        success: false,
      },
      { status: 500 }
    );
  }
}
