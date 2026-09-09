import Message from "../models/Message.js";

export const getMessagesForRequest = async (
    learningRequestId
) => {

    return await Message.find({
        learningRequest: learningRequestId,
    })
        .populate("sender", "name profilePhoto")
        .populate("receiver", "name profilePhoto")
        .sort({ createdAt: 1 });
};


export const createMessage = async ({
    learningRequestId,
    senderId,
    receiverId,
    text,
}) => {

    const message = await Message.create({
        learningRequest: learningRequestId,
        sender: senderId,
        receiver: receiverId,
        text,
    });

    await message.populate(
        "sender",
        "name profilePhoto"
    );

    await message.populate(
        "receiver",
        "name profilePhoto"
    );

    return message;
};