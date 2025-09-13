import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import mongoose from "mongoose";
import MessageModel from "@/models/MessageModel";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const { content } = await req.json();
  if (!content) {
    return NextResponse.json(
      {
        error: "content is required",
        success: false,
      },
      { status: 400 }
    );
  }
  const sender = searchParams.get("sender");
  const receiver = searchParams.get("receiver");

  if (!sender || !receiver) {
    return NextResponse.json(
      {
        error: "sender and receiver is required",
        success: false,
      },
      { status: 400 }
    );
  }

  const message = new MessageModel({
    content,
    sender,
    receiver,
  });

  await message.save();

  return NextResponse.json(
    {
      message: "successfully stored message in the db",
      success: true,
    },
    { status: 200 }
  );
}
