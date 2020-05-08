module.exports = io => {
    io.on("connection", client  => {
        console.log("new connection");

        client.on("disconnect", ()  => {
            console.log("user disconnected");
        });

        client.on("message", ()  => {
            let date = Date().toString();
            io.emit("message", {
                content: "message".concat(" << ").concat(date.substring(0, date.indexOf("GMT")))
            });
        });
    });
};
