import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helper/sendEmail";
import { z } from "zod";
import { signupSchema } from "@/Schemas/signupSchema";
import { UsernameVerification } from "@/Schemas/signupSchema";
import { log } from "console";

//TODO : You THought to make this route check duplicate username with is verified property and make it secure before going to school at 08:45Am also you completed resend part but revise it again , and after that work on login via next-auth make page for it form use react-hook-form and complete it if possible today then we will work with frontend also .
export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await req.json();
    if (!username || !email || !password) {
      return Response.json(
        { error: "please provide all the field", success: false },
        { status: 400 }
      );
    }

    const isUsernameValid = UsernameVerification.safeParse({ username });
    const isSignUpFieldValid = signupSchema.safeParse({
      username,
      email,
      password,
    });
    if (!isUsernameValid.success || !isSignUpFieldValid.success) {
      return Response.json(
        {
          error: "please enter username and email in valid format",
          success: false,
        },
        { status: 400 }
      );
    }

    const existingUserFromEmail = await UserModel.findOne({ email });
    const existingUserFromUsername = await UserModel.findOne({ username });

    if (existingUserFromEmail) {
      return Response.json(
        {
          error: "user already exist with this email",
          success: false,
        },
        { status: 404 }
      );
    }

    if (existingUserFromUsername) {
      if (existingUserFromUsername.isVerified) {
        return Response.json(
          { error: "Username already exists", success: false },
          { status: 400 }
        );
      } else {
        // resend verification regardless of email
        const token = Math.floor(Math.random() * 100000).toString();
        const tokenExpiry = new Date(Date.now() + 1000 * 60 * 60);
        existingUserFromUsername.verifySecret = token;
        existingUserFromUsername.verifySecretExpiry = tokenExpiry;
        await existingUserFromUsername.save();

        try {
          await sendEmail({
            username: existingUserFromUsername.username,
            email: existingUserFromUsername.email,
          });
        } catch (err) {
          console.error(err);
        }

        return Response.json(
          {
            error: `An account with this username already exists, please verify itOR Use another Username`,
            success: false,
          },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const token = Math.floor(Math.random() * 100000).toString();
    const tokenExpiry = new Date(Date.now() + 1000 * 60 * 60);

    const user = new UserModel({
      username,
      email,
      password: hashedPassword,
      verifySecret: token,
      verifySecretExpiry: tokenExpiry,
    });
    await user.save();

    let emailSent = false;
try {
  await sendEmail({ username, email });
  emailSent = true;
} catch (err) {
  console.error("Resend email failed:", err);
}

return Response.json(
  {
    message: "Successfully created a new user. Please verify it.",
    success: true,
    emailSent,
  },
  { status: 200 }
);


    return Response.json(
      {
        message: "successfully created a new user. please verify it",
        success: true,

      },
      { status: 200 }
    );
  } catch (e) {
    return Response.json(
      {
        error: `error creating a new user ${e}`,
        success: false,
      },
      { status: 500 }
    );
  }
}
