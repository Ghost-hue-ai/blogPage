import { EmailTemplate } from  '@/emailTemplates/EmailTemplate';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import { Resend } from 'resend';

interface SendEmailProps{
    username : string,
    email : string
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req:Request){

  try {
    const {username,email} = await req.json()

    const { data, error } = await resend.emails.send({
         from: 'Acme <onboarding@resend.dev>',
         to: email,
         subject: `Hello ${username} thanks for using our service.`,
         html:`Thanks for using our service! <br>
         Please click the link below to verify your account: <br><br>
         your verificationCode is
         <a href="http://localhost:3000/verify}">Verify Here</a>`
    });

    if (error) {
        console.error(error);

    }

    return Response.json({ success: true, data }, { status: 200 });

}catch (error: any) {
  console.error("Send email error:", error);
  return Response.json({ success: false, error: error || String(error) }, { status: 500 });
}
  }
