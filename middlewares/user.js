const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
function userMiddleware(req,res, next) {
 
  const token = req.headers.token
    // console.log(token);
    if(token === null || undefined){
        return res.json({
            message: "Token is required"
        })
    }
  try {
    const decodedData = jwt.verify(token, JWT_USER_PASSWORD);
    if (!decodedData) {
      return res.json({
        message: "Invalid token",
      });
    }
    req.userId = decodedData.id;
    next();
  } catch (error) {
    return res.json({
      message: " YOu are not Signed in as an user ",
    });
  }
}
module.exports = {
  userMiddleware,
};
