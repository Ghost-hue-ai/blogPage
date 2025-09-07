import { uploadOnCloudinary } from "@/helper/uploadOnCloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
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
    const userId = session?.user._id;
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return Response.json(
        {
          error: "can't find file",
          success: false,
        },
        { status: 404 }
      );
    }

    const { url, public_id } = await uploadOnCloudinary(file, {
      folder: "blog_uploads",
    });
    if (!url || !public_id) {
      return Response.json(
        {
          error: "failed to upload on cloudinary url is undefined",
          success: false,
        },
        { status: 500 }
      );
    }
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(userId) },
      { profilePic: url },
      { new: true }
    );
    console.log("updatedUser", updatedUser);

    return Response.json(
      { message: "successfully saved file ", success: true },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        error: "failed updating the pfp",
        success: false,
      },
      { status: 500 }
    );
  }
}
