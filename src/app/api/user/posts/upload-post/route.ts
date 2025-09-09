import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { uploadOnCloudinary } from "@/helper/uploadOnCloudinary";
import dbConnect from "@/lib/dbConnect";

import { getServerSession } from "next-auth";

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
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

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json(
        {
          error: "no file found to upload",
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
          error: "failed uploading the post",
          success: false,
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        message: "Successfully uploaded the post",
        url: url,
        public_id: public_id,
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        error: error.message || "failed uploading the post",
        success: false,
      },
      { status: 500 }
    );
  }
}
