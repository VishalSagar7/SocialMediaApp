import { populate } from "dotenv";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";


export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { textMessage : message } = req.body;

        

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        // establish the conversation if not started yet

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        };

        const newMessage = await Message.create({
            senderId: senderId,
            receiverId: receiverId,
            message: message
        });

        if (newMessage) conversation.messages.push(newMessage._id);
        await Promise.all([conversation.save(), newMessage.save()]);


        // implement socket.io for realtime data transfer


        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }


        return res
            .status(201)
            .json({
                success: true,
                newMessage
            });


    } catch (error) {
        console.log(error);

    }
};


// export const getMessage = async (req, res) => {
//     try {
//         const senderId = req.id;
//         const receiverId = req.params.id;

//         // Fetch the conversation with both participants
//         const conversation = await Conversation.findOne({
//             participants: { $all: [senderId, receiverId] }
//         }); // Populate messages and participants if needed

//         // Log the conversation for debugging
//         console.log(conversation);

//         if (!conversation) {
//             return res.status(200).json({
//                 success: true,
//                 messages: [], // Return an empty array if no conversation exists
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             messages: conversation.messages, // Access the messages property
//         });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: "An error occurred while fetching the messages.",
//             error: error.message,
//         });
//     }
// };



export const getMessage = async (req, res) => {
    try {

        const senderId = req.id;
        const receiverId = req.params.id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('messages')


        if (!conversation) {
            return res
                .status(200)
                .json({
                    success: true,
                    messages: []
                });
        }

        return res
            .status(200)
            .json({
                success: true,
                messeges: conversation.messages
            });

    } catch (error) {
        console.log(error);

    }
};