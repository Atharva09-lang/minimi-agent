import {
    createMessage,
    getConversationMessages,
} from '../repositories/message.repository.js';

//save message

export async function createMessageController(req, res) {
    
   try{
    const {content, role = "user", metadata ={}}= req.body;

    if(role !== "user") {
        return res.status(400).json({
            success: false,
            message: "Invalid role. Only 'user' role is allowed.",
        });
    }

    if(typeof content !== "string" || content.trim()){
        return res.status(400).json({
            success: false,
            message: "Invalid content. message content is required.",
        });
    }

    const message = await createMessage(
        req.user.id,
        req.params.conversationId,
        "user",
        content.trim(),
        metadata
    );

    if(!message){
        return res.status(504).json({
            success: false,
            message: "conversation not found.",
        });
    }
    res.status(201).json({
        success: true,
        message: "Message created successfully.",
        data: message,
    });
   }catch (error) {
    console.error(error);
    res.status(500).json({
        success: false,
        message: "Failed to save message.",
    });
   }
}

//get chat history
export async function getMessagesController(req, res) {
   try{
     const messages = await getConversationMessages(
        req.user.id,
        req.params.conversationId
     );

     res.status(200).json({
        success: true,
        message: "Messages retrieved successfully.",
        data: messages,
     });
   }catch (error) {
    console.error(error);
    res.status(500).json({
        success: false,
        message: "Failed to retrieve messages.",
    });
   }
}
