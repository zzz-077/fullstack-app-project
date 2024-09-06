import jwt from "jsonwebtoken";
import User from "../models/userM.js";
async function GetUserData(req, res) {
  const AccessToken = req.cookies.AccessToken;
  try {
    jwt.verify(
      AccessToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(404).json({
            status: "fail",
            message: "Don't have access on user!",
            error: err,
            data: [],
          });
        } else {
          const userId = decoded.userId;
          if (userId === "" || !userId)
            return res.status(404).json({
              status: "fail",
              message: "Don't have access on UserData!",
              error: null,
              data: [],
            });
          const userData = await User.findById(userId);
          // console.log("==========LOG1==========");
          // console.log(userData);
          return res.status(200).json({
            status: "success",
            message: "User data received successfully!",
            error: null,
            data: userData,
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Autentication problem!",
      error: error,
      data: [],
    });
  }
}

export default GetUserData;
