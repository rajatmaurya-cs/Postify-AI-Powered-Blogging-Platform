import jwt from "jsonwebtoken";


/*------------------Access Token  Used for API authorization----------------------*/

function createAccessToken(user) {
  const payload = {
     name : user.fullName,
     id: user._id,
     role: user.role,
     email : user.email,
     avatar : user.avatar,
   createdAt: user.createdAt,
  };

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
}


/*-------------------Refresh Token Use Only to Generate New access toKen----------------------*/

function createRefreshToken(user) {
  return jwt.sign(

    { id: user._id },

    process.env.REFRESH_TOKEN_SECRET,
    
    {
      expiresIn: "7d",
    }
  );
}

/*----------------validateAccessToken--------------------------- */

function validateAccessToken(token) {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); 
}




export {
  createAccessToken,
  createRefreshToken,
  validateAccessToken,
};

