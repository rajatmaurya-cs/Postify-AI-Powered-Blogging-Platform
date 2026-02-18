
import mongoose from "mongoose";

const configSchema = new mongoose.Schema({

    aiEnabled:{
        type:Boolean,
        default:true
    },

    dailyAiLimit:{
        type:Number,
        default:5
    },

    dailyappLimit:{
        type : Number,
        default : 50
    },

    aiModel:{
        type:String,
        default:"llama-3.1-8b-instant"
    },

    aiPerMinuteLimit: { 
        type: Number,
     default: 2 },
    

},{timestamps:true});

const Config =   mongoose.model("Config", configSchema);

export default Config;



