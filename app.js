// Michael Macari
// Using sockets
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const nrpSender = require("./nrp-sender-shim");
const redisConnection = require("./redis-connection");

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

io.on("connection", async (socket) => {
    console.log("Connected to socket");

    socket.emit("Listening");

    socket.on("receive", async (obj) => {
        console.log("Received object from client")
        let username = obj.username;
        let query = obj.query;
        let message = obj.message;

        // Try to get a response from the worker
        try{
            let response = await nrpSender.sendMessage({
                redis: redisConnection,
                eventName: 'research',
                data: {
                    query
                }
            });

            console.log("Sending object to client");
            io.emit('search', {
                username: username,
                message: message,
                results: response.results
            });

        }
        catch(e){
            console.log(e);
        }


    })

    socket.on('disconnect', ()=> {
        console.log("Disconnected");
    })

})

// Sets our server on 3000
http.listen(3000, ()=> {
    console.log("Listening on http://localhost:3000");
});