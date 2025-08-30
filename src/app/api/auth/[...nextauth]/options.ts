import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import { NextAuthOptions } from "next-auth";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";


export const authOptions:NextAuthOptions = {providers: [
    CredentialsProvider({
name:"Credentials",


credentials:{
email :{label: "email", type:"text", placeholder:"example@gmail.com"},
password : {label:"password", type:"password" , placeholder:"password"}
},
async authorize(credentials:any,req):Promise<any> {
    await dbConnect()

    try {

        const user  = await UserModel.findOne(
            {email : credentials.email}
        )

        if(!user){
            throw new Error("incorrect credentials")
        }

        if(!user.isVerified){
            throw new Error("user is not verified")
        }

        const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password)

        if(!isPasswordCorrect){
            throw new Error("incorrect password")
        }


        return user

    } catch (error:any) {
        console.error(error.message)
        throw new Error(error)
    }



}
    })
],
callbacks: {
     async jwt({ token, user }) {
        if(user){
            token._id = user._id
            token.username = user.username
            token.isVerified = user.isVerified
            token.email = user.email
        }
        return token

     },
      async session({ session,token }) {
         if(token){
            session.user._id = token._id
            session.user.username = token.username
            session.user.isVerified = token.isVerified
            session.user.email = token.email
         }
         return session

      }

},
pages: {signIn : "sign-in"},
session: {strategy:'jwt'},
secret:process.env.NEXT_AUTH_SECRET

}