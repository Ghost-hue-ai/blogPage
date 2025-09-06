import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserDetail from "@/models/UserData";
import mongoose from "mongoose";
import UserModel from "@/models/User";

interface Params {
  id: string;
}
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
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
    const body = await req.json();
    console.log("Request body:", body);
    console.log("Username in body:", body.data.username);
    const userId = params.id;
    console.log("User ID:", userId);
    console.log("User ID type:", typeof userId);

    const userDetails = await UserDetail.findOne({
      user: new mongoose.Types.ObjectId(userId),
    });
    if (!userDetails) {
      // First update the User model with the username
      console.log("Attempting to update User with ID:", userId);
      console.log("Username to update:", body.data.username);

      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(userId) },
        { username: body.data.username },
        { new: true, runValidators: true }
      );
      console.log("Updated User result:", updatedUser);
      console.log("Updated User username:", updatedUser?.username);

      if (!updatedUser) {
        console.log("No user found with ID:", userId);
        return Response.json(
          {
            error: "User not found",
            success: false,
          },
          { status: 404 }
        );
      }

      // Then create the UserDetail with consistent ObjectId
      console.log("Creating new UserDetail with data:", {
        user: userId,
        ...body.data,
      });
      const userInfo = new UserDetail({
        user: new mongoose.Types.ObjectId(userId),
        ...body.data,
      });
      await userInfo.save();
      console.log("Saved UserDetail:", userInfo);

      return Response.json(
        {
          message: "successfully saved userDetails",
          data: userInfo,
          success: true,
        },
        { status: 200 }
      );
    }
    // Update the User model with username if provided
    if (body.username) {
      console.log("Updating existing user with username:", body.username);
      try {
        const updatedUser = await UserModel.findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(userId) },
          { username: body.data.username },
          { new: true, runValidators: true }
        );
        console.log("Updated User result:", updatedUser);
        console.log("Updated User username:", updatedUser?.username);

        if (!updatedUser) {
          console.log("No user found with ID:", userId);
          return Response.json(
            {
              error: "User not found",
              success: false,
            },
            { status: 404 }
          );
        }
      } catch (error: any) {
        console.log("Error updating user:", error);
        if (error.code === 11000) {
          return Response.json(
            {
              error: "Username already exists",
              success: false,
            },
            { status: 409 }
          );
        }
        throw error;
      }
    }

    // Update the UserDetail
    console.log("Updating UserDetail with body:", body);
    const userData = await UserDetail.findOneAndUpdate(
      { user: new mongoose.Types.ObjectId(userId) },
      { $set: body.data },
      { new: true }
    );
    console.log("Updated UserDetail result:", userData);
    if (!userData) {
      return Response.json(
        {
          error: "Failed updating the userDetail",
          success: false,
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        message: "successfully updated the user",
        data: userData,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        error: "failed to create or update userData",
        success: false,
      },
      { status: 500 }
    );
  }
}
