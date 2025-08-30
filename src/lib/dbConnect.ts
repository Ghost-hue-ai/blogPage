import { log } from "console";
import mongoose from "mongoose";
interface Connection {
    connectionState?:number
}
let connection : Connection= {}

async function dbConnect(){
    if(connection.connectionState === 1){
        console.log("Already connected to database")
        return
    }
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI!)

        if(connect){
            connection.connectionState = connect.connection.readyState
            console.log("db connected successfully")
        }


    } catch (error) {

        console.error("error connecting  to db ", error);
        process.exit(1)

    }
}

export default dbConnect