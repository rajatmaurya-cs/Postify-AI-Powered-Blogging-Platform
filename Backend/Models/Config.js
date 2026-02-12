
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
        default:"gpt-4o-mini"
    },
    

},{timestamps:true});

const Config =
   mongoose.models.Config ||
   mongoose.model("Config", configSchema);

export default Config;



