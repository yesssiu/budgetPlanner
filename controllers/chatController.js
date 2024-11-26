const Message = require("../models/message");

module.exports = io => {
    //listen to new connections
    io.on("connection", client => {
        //fetch the 10 most recent messages from database
        Message.find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .then(messages => { //sending messages to client from oldest to newest
                client.emit("load all messages", messages.reverse());
            });
        console.log("Connected to chat");

        //Listen for disconnects
        client.on("disconnect", () => {
            console.log("user disconnected");
        });

        //Listen for new messages
        client.on("message", data => {
            let messageAttributes = {
                content: data.content,
                userName: data.userName,
                user: data.userId
            };
            //Create a new message instance and save to database
            let message = new Message(messageAttributes);
            message.save()
                .then(() => {
                    io.emit("message", messageAttributes);
                })
                .catch(error => console.log(`error: ${error.message}`));
        });
    });
};