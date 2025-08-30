import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import PostModel from "@/models/Post";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

interface Params {
  postId: string;
}
export async function POST(req: Request) {
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

    const { heading, description } = await req.json();

    if (!heading || !description) {
      return Response.json(
        {
          error: "heading and description is needed to create a post",
          success: false,
        },
        { status: 400 }
      );
    }

    const post = new PostModel({
      heading,
      description,
      owner: session.user._id,
    });

    await post.save();

    return Response.json(
      {
        message: "successfully created a post",
        success: true,
        data: post,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        error: "failed creating a post",
        errorObject: error,
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  await dbConnect();
  try {
    const posts = await PostModel.aggregate([
      {
        $match: {
          _id: { $exists: true },
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
                _id: 1,
              },
            },
          ],
          as: "owner",
        },
      },
      { $unwind: "$owner" },
      {
        $lookup: {
          from: "likes",
          localField: "likes",
          foreignField: "_id",
          as: "likes",
        },
      },
      {
        $addFields: {
          likesCount: { $size: "$likes" },
        },
      },
    ]);

    if (posts.length === 0) {
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
        message: "successfully fetched posts",
        success: true,
        data: posts,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        error: "failed getting  post",
        errorObject: error,
        success: false,
      },
      { status: 500 }
    );
  }
}
