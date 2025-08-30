import mongoose,{Schema,Document} from "mongoose";


interface User extends Document {
    username : string;
    email : string;
    password:string;
    isVerified: boolean
    verifySecret : string;
    verifySecretExpiry?:Date;
    forgotSecret:string;
    forgotSecretExpiry?:Date

}

const userSchema:Schema<User> = new Schema({
    username: {
        type:String,
        required : true,
        unique : true


    },
    email: {
        type : String,
        required : true,
        unique:true


    },
    password:{
        type : String
    },
    isVerified: {
        type : Boolean,
        default: false
    },
    verifySecret:String,
    verifySecretExpiry:Date,
    forgotSecret:String,
    forgotSecretExpiry:Date,



},{timestamps:true})

const UserModel = (mongoose.models.User as mongoose.Model<User>) ||mongoose.model<User>("User",userSchema)

export default UserModel
