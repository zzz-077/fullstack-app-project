import User from "../models/userM.js";

async function getFriendData(req, res) {
  const id = req.body;
  try {
    const foundFriend = await User.findById(id);

    if (!foundFriend) {
      return res.status(404).json({
        status: "fail",
        message: "Can't find friend's data!",
        error: null,
        data: [],
      });
    }
    const friendData = {
      name: foundFriend.name,
      img: foundFriend.img,
      status: foundFriend.status,
      id: foundFriend._id,
    };
    return res.status(200).json({
      status: "success",
      message: "Friend data found!",
      error: null,
      data: [friendData],
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Get friend's data failed!",
      error: error,
      data: [],
    });
  }
}

export default getFriendData;
