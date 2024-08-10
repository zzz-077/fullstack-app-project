import User from "../models/userM.js";

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
        console.log(foundedFriend);
        const checkFriendReqInRequests = foundedFriend.friendRequests.some(
            (obj) => {
                return obj.id === friend.userId;
            }
        );
        console.log("==========1==========");
        console.log(checkFriendReqInRequests);
        if (checkFriendReqInRequests)
            return res.status(400).json({
                status: "fail",
                message: `You've already sent friend request!`,
                error: null,
                data: [],
            });
        const checkFriendReqInFriends = foundedFriend.friends.some((id) => {
            return id !== friend.userId;
        });
        console.log("==========2==========");
        console.log(checkFriendReqInFriends);
        if (checkFriendReqInFriends)
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
                    message: `User ${reqBody.requesterName} can't accepted!`,
                    error: null,
                    data: [],
                });
            console.log(updatedUser);

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
            console.log(updatedUser);
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
