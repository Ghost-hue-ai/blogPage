import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import PostModel from "@/models/Post";

interface Params {
  postId: string;
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

    const post = await PostModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(postId),
        },
      },
      {
        $lookup: {
          from: "users",
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

    if (post.length === 0) {
      return Response.json(
        {
          error: "invalid post id ",
          success: false,
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        message: "successfully fetched post",
        success: true,
        data: post,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        error: "failed getting the post",
        success: false,
      },
      { status: 500 }
    );
  }
}
