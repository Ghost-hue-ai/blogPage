import { EmailTemplate } from  '@/emailTemplates/EmailTemplate';
import UserModel from '@/models/User';
import { Resend } from 'resend';

interface SendEmailProps{
    username : string,
    email : string
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({username , email}:SendEmailProps) {
  try {
    const user = await UserModel.findOne({username , email})
    const { data, error } = await resend.emails.send({
         from: 'Acme <onboarding@resend.dev>',
         to: email,
         subject: `Hello ${username} thanks for using our service.`,
         html:`Thanks for using our service! <br>
         Please click the link below to verify your account: <br><br>
         your verificationCode is
         <a href="http://localhost:3000/verify/${user?._id}/${user?.verifySecret}">Verify Here</a>`
    });

    if (error) {
      throw new Error(error.message || "unknown resend email error ")
    }

    return data
  } catch (error:any) {
     throw new Error(error)
  }
}