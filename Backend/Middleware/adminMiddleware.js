const adminMiddleware = (req, res , next) => {

    if (req.user?.role !== "ADMIN") {
       
        return res.status(403).json({
            success:false,
            message:"Admin access required"
        });
    }
    console.log("User is ADMIN")
    next();


};
export default adminMiddleware;