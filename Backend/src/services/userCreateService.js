import User from "../models/userM.js";
async function userCreate(req, res) {
  try {
    const usersData = await User(req.body).save();
    // console.log(usersData);

    return res.status(200).json({
      status: "success",
      message: "User data created successfully!",
      error: null,
      data: usersData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "User data create failed!",
      error: error,
    });
  }
}

export default userCreate;
