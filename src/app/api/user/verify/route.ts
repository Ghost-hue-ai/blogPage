import UserModel from "@/models/User";

export async function POST (req:Request){
    const {userId , verifySecret,email} =await req.json()
    console.log("request sent")

    const user = await UserModel.findOne({_id :userId})

    if(!user){
        return Response.json({
            error : "invalid token",
            success: false
        },{status : 404})
    }


if (!user.verifySecretExpiry || Date.now() > user.verifySecretExpiry.getTime()) {
  return Response.json(
    { error: "verify token expired", success: false },
    { status: 400 }
  );
}



    user.verifySecret = ''
    user.verifySecretExpiry=undefined

    user.isVerified = true
    await user.save()

    return Response.json({
        message : "user verified successfully",
        success : true
    }, {status : 200})


}