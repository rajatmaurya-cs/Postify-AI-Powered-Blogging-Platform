import Config from "../Models/Config.js";

const initConfig = async () => {

   await Config.findOneAndUpdate(
      {},
      {}, 
      {
         upsert: true,
         new: true
      }
   );

   console.log("✅ Config initialized");
};

export default initConfig;


