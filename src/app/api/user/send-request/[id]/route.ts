import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import RequestModel from "@/models/FriendRequest";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
interface Params {
  id: string;
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

    const sender = session.user._id;
    const receiverId = params.id;
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return Response.json(
        {
          error: "invalid receiver ID",
          success: false,
        },
        { status: 400 }
      );
    }
    if (sender === receiverId) {
      return Response.json(
        {
          error: "can't send request to yourSelf",
          success: false,
        },
        { status: 400 }
      );
    }
    const existingRequestToSamePersonBySameUser = await RequestModel.findOne({
      RequestSender: new mongoose.Types.ObjectId(sender),
      RequestReceiver: new mongoose.Types.ObjectId(receiverId),
    });

    if (existingRequestToSamePersonBySameUser) {
      return Response.json(
        {
          error: "can't send friend request to same person twice ",
          success: false,
        },
        { status: 400 }
      );
    }
    const request = new RequestModel({
      RequestSender: sender,
      RequestReceiver: receiverId,
    });
    await request.save();
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
    const sender = session.user._id;
    const RequestReceiver = params.id;
    if (!mongoose.Types.ObjectId.isValid(RequestReceiver)) {
      return Response.json(
        {
          error: "invalid receiver ID",
          success: false,
        },
        { status: 400 }
      );
    }

    const deleteRequest = await RequestModel.findOneAndDelete({
      RequestSender: new mongoose.Types.ObjectId(sender),
      RequestReceiver: new mongoose.Types.ObjectId(RequestReceiver),
    });
    if (!deleteRequest) {
      return Response.json(
        {
          error: "server error in deleting  request",
          success: false,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return Response.json(
      {
        error: error,
        errorObj: error,
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

    const requestReceiver = session.user._id;

    const requestSender = params.id;

    if (!mongoose.Types.ObjectId.isValid(requestSender)) {
      return Response.json(
        {
          error: "invalid request id",
          success: false,
        },
        { status: 400 }
      );
    }

    const request = await RequestModel.findOneAndUpdate(
      {
        RequestReceiver: new mongoose.Types.ObjectId(requestReceiver),
        RequestSender: new mongoose.Types.ObjectId(requestSender),
      },
      {
        accepted: "ACCEPTED",
      },
      { new: true }
    );

    if (!request) {
      return Response.json(
        {
          error: "can't find request",
          success: false,
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        message: "successfully accepted friend request",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return Response.json(
      {
        error: error.message || "failed to updated request",
        success: false,
      },
      { status: 500 }
    );
  }
}
