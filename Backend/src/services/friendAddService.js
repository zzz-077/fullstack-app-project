import Chat from "../models/chatM.js";
import User from "../models/userM.js";
import mongoose from "mongoose";

async function friendRequest(req, res) {
  const friend = req.body;
  try {
    const foundedFriend = await User.findOne({
      name: friend.friendName,
    });
    if (!foundedFriend)
      return res.status(404).json({
        status: "fail",
        message: `User ${friend.friendName} not found!`,
        error: null,
        data: [],
      });
    // console.log(foundedFriend);
    // console.log("===========================");
    // console.log(friend.userId);
    const checkFriendReqInRequests = foundedFriend.friendRequests.find(
      (obj) => {
        console.log("FIRSTCHECK:" + obj._id);
        return obj._id.toString() === friend.userId;
      }
    );
    // console.log("==========1==========");
    // console.log(checkFriendReqInRequests);
    if (checkFriendReqInRequests != undefined)
      return res.status(400).json({
        status: "fail",
        message: `You've already sent friend requst!`,
        error: null,
        data: [],
      });
    const checkFriendReqInFriends = foundedFriend.friends.find((id) => {
      return id.toString() === friend.userId;
    });
    // console.log("==========2==========");
    // console.log(checkFriendReqInFriends);
    if (checkFriendReqInFriends != undefined)
      return res.status(400).json({
        status: "fail",
        message: `You are already friends!`,
        error: null,
        data: [],
      });

    const updatedFriend = await User.findOneAndUpdate(
      { _id: foundedFriend._id },
      {
        $push: {
          friendRequests: {
            _id: friend.userId,
            username: friend.userName,
            img: friend.userImg,
          },
        },
      },
      { new: true }
    );
    // console.log(updatedFriend);

    return res.status(200).json({
      status: "success",
      message: `User ${friend.friendName} is found!`,
      error: null,
      data: [],
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Friend add failed!",
      error: error,
      data: [],
    });
  }
}

async function acceptRequest(req, res) {
  const reqBody = req.body;
  try {
    const checkrequest = await User.findOne({
      _id: reqBody.userId,
      friendRequests: { $elemMatch: { _id: reqBody.requesterId } },
    });
    // console.log(checkrequest);

    if (reqBody.status === "accept" && checkrequest) {
      const updatedUser = await User.findOneAndUpdate(
        { _id: reqBody.userId },
        {
          $push: { friends: reqBody.requesterId },
          $pull: { friendRequests: { _id: reqBody.requesterId } },
        },
        { new: true }
      );
      if (!updatedUser)
        return res.status(404).json({
          status: "fail",
          message: `User ${reqBody.req0uesterName} can't accepted!`,
          error: null,
          data: [],
        });
      const updatedfriend = await User.findOneAndUpdate(
        { _id: reqBody.requesterId },
        {
          $push: { friends: reqBody.userId },
          $pull: { friendRequests: { _id: reqBody.userId } },
        },
        { new: true }
      );
      //CreateChat
      await Chat.create({
        chatName: "",
        participants: [reqBody.userId, reqBody.requesterId],
      });
      return res.status(200).json({
        status: "success",
        message: `User ${reqBody.requesterName} is accepted!`,
        error: null,
        data: [],
      });
    } else if (reqBody.status === "reject" && checkrequest) {
      const updatedUser = await User.findOneAndUpdate(
        { _id: reqBody.userId },
        {
          $pull: { friendRequests: { _id: reqBody.requesterId } },
        },
        { new: true }
      );
      // console.log(updatedUser);
      if (!updatedUser)
        return res.status(404).json({
          status: "fail",
          message: `User ${reqBody.requesterName} can't rejected!`,
          error: null,
          data: [],
        });
      return res.status(200).json({
        status: "success",
        message: `User ${reqBody.requesterName} is rejected!`,
        error: null,
        data: [],
      });
    } else {
      return res.status(409).json({
        status: "fail",
        message: `User ${reqBody.requesterName} is already ${reqBody.status}ed!`,
        error: null,
        data: [],
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Friend accept/reject failed!",
      error: error,
      data: [],
    });
  }
}
export { friendRequest, acceptRequest };
