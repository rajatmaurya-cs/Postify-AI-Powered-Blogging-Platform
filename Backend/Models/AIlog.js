
import mongoose from "mongoose";
const aiLogSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    role :{
        type : String,
        default : "USER",
    },
    action:String,

    
},{timestamps : true})


const AILog =
  mongoose.models.AILog || mongoose.model("AILog", aiLogSchema);
 export default AILog;
