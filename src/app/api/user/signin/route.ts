import UserModel from "@/models/User"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"

export async function POST(req:Request){
    await dbConnect()
    try {
        const {email,password} = await req.json()
        if(!email || !password){
            return Response.json(
                {
                    error : "please provide all the field",
                    success : false
                },
                {status :400}
            )
        }

        const user = await UserModel.findOne({email,isVerified:true})

        if(!user){
            return Response.json(
                {
                    error : "user not found", success: false
                },{status : 400}
            )


        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password)
        if(!isPasswordCorrect){
            return Response.json({
                error : "incorrect password",
                success :false
            },{status : 400})
        }

        return Response.json(
            {message : "user signed in successfully",success : true}, {status :200}
        )


    } catch (error:any) {
        Response.json(
            {
                error: error.message,
                success:false
            },
            {status: 500}
        )
    }

}