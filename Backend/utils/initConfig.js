// import Config from "../Models/Config.js";

// const initConfig = async () => {

//    await Config.findOneAndUpdate(
//       {},
//       {}, 
//       {
//          upsert: true,
//          new: true
//       }
//    );

//    console.log("✅ Config initialized");
// };

// export default initConfig;




import Config from "../Models/Config.js";

const initConfig = async () => {
  const config = await Config.findOneAndUpdate(
    {},
    {
      $setOnInsert: {
        aiEnabled: true,
        dailyAiLimit: 5,
        dailyappLimit: 50,
        aiModel: "openai/gpt-oss-120b",
        aiPerMinuteLimit: 2,
      },
      $set: {
        aiPerMinuteLimit: 2, 
      },
    },
    { upsert: true, new: true }
  );

  console.log("✅ Config initialized:", config);
};

export default initConfig;
