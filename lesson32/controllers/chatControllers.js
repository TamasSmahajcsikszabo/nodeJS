// server side, what the client is listening for
// data from here is emitted to all clients
const Message = require("../models/message.js"),
    User = require("../models/user.js");

module.exports = io => {
    io.on("connection", client  => {
        
        client.on("user connected", (user) => {
            console.log(user);
            // client.broadcast.emit("user connected", user);
        })

        Message.find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .then(messages  => {
                client.emit("load all messages", messages.reverse());
            })
        
        client.on("disconnect", ()  => {
            client.broadcast.broadcast.emit("user disconnected");
        });

        client.on("message", data  => {
            // let date = Date().toString();
            // let formattedDate = date.substring(0, date.indexOf("GMT"))
            let messageAttributes = {
                content: data.content,
                user: data.userId,
                userName: data.userName
            },
                m = new Message(messageAttributes);

            User.find({ "_id" : messageAttributes.user})
                .then(user  => {
                    console.log(`${messageAttributes.userName} found in database`);
                        m.save()
                            .then(()  => {
                                console.log(`message saved to database`)
                                io.emit("message", messageAttributes);
                            })
                            .catch(error  => console.log(`error: ${error.message}`));
                })
                .catch(error  => console.log(`error when saving: ${error.message}`));
        });
    });
};
