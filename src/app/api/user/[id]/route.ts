import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/models/User";

interface Params {
  username: string;
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
    const usernameToSearch = String(params.username);
    console.log(
      "Searching for username:",
      usernameToSearch,
      typeof usernameToSearch
    );

    const users = await UserModel.aggregate([
      {
        $match: {
          username: { $regex: usernameToSearch, $options: "i" },
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
        },
      },
    ]);

    if (users.length == 0) {
      return Response.json(
        {
          message: "no user with this username",
          data: [],
          success: true,
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        message: "successfully fetched users",
        data: users,
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        error: error.message,
        errorObj: error,
        success: false,
      },
      { status: 500 }
    );
  }
}
