import Config from "../Models/Config.js";
import ConfigHistory from "../Models/configHistory.js";




export const updateConfig = async (req, res) => {
    try {

        
        let currentConfig = await Config.findOne();
       
            console.log(req.body)
       
        await ConfigHistory.create({
            configSnapshot: currentConfig.toObject(),
            changedBy: req.user.id
        });

     

        
        const updatedConfig = await Config.findOneAndUpdate(
            {},
            req.body,
            { new: true, upsert: true }
        );

        return res.json({
            success: true,
            message: "Configuration updated successfully",
            config: updatedConfig
        });

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
};



export const getConfig = async (req, res) => {
    try {
       
        let config = await Config.findOne();

        if (!config) {
            config = await Config.create({});
        }

        res.json({
            success : true,
            config,
        });

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};




export const getConfigHistory = async (req, res) => {
    try {

        const history = await ConfigHistory
            .find()
            .populate("changedBy", "fullName email") 
            .sort({ createdAt: -1 });

        return res.json({
            success:true,
            history
        });

    } catch(error){

        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
};
