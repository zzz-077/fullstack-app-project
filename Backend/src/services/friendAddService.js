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
        console.log(updatedFriend);

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

export default friendRequest;
