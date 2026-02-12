import mongoose from "mongoose";

const aiUsageSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    role : {
        type : String,
        default : "USER"
    },
    date:{
        type:String, 
        required:true
    },
    count:{
        type:Number,
        default:0
    },
   
})

const AiUsage = mongoose.model("AIUsage", aiUsageSchema);

export default AiUsage;
