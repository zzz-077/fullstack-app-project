import User from "../models/userM.js";
async function usersGet(req, res) {
  try {
    const usersData = await User.find();
    if (usersData.length === 0)
      return res.status(404).json({
        status: "fail",
        message: "No users found!",
        error: usersData,
        data: [],
      });
    return res.status(200).json({
      status: "success",
      message: "Users data found successfully!",
      error: null,
      data: [usersData],
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Users data get failed!",
      error: error,
      data: [],
    });
  }
}

export default usersGet;
