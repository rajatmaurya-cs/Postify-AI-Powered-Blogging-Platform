import Blog from "../Models/Blog.js";
import Comment from "../Models/Comments.js";
import AIUsage from '../Models/AIUsage.js'
import AILog from '../Models/AIlog.js'


export const getDashboardStats = async (req, res) => {
    try {

        const [
            totalBlogs,
            totalComments,
            draftBlogs
        ] = await Promise.all([

            Blog.countDocuments(),

            Comment.countDocuments(),

            Blog.countDocuments({ isPublished: false })

        ]);

        res.json({
            success: true,
            stats: {
                totalBlogs,
                totalComments,
                draftBlogs
            }
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to load dashboard"
        });
    }
}





export const Aidashboard = async (req, res) => {
    try {

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [
            AIrequests,
            AIrequestToday,
            mostUsedAIData,
            uniqueUsers,
            logs
        ] = await Promise.all([

            AILog.countDocuments(),

            AILog.countDocuments({
                createdAt: { $gte: today }
            }),

            AILog.aggregate([
                {
                    $group: {
                        _id: "$action",
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 1 }
            ]),

            AILog.distinct("userId"),

            AILog.find()
                .sort({ createdAt: -1 })
                .limit(10)
                .populate("userId", "fullName role")
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalRequests: AIrequests,
                todayRequests: AIrequestToday,
                mostUsedAI: mostUsedAIData[0]?._id || "No usage yet",
                uniqueUsers: uniqueUsers.length,
                logs
            }
        });

    } catch (err) {

        console.error("AI Dashboard Error:", err);

        res.status(500).json({
            success: false,
            message: "Failed to load AI dashboard"
        });
    }
}




