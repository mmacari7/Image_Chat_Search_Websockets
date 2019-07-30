## Purpose

The purpose of this program is to demonstrate concurrent usage of node-pub-sub with Redis and the use of Web Sockets using socket.io. Starting the program with `npm start` will cause the program to concurrently run `app.js` and `worker.js`. The worker in this case uses Redis to perform a search for images on Pixabay. The server runs using express sockets. There is only one route created with express. When the client submits the form, the socket emits an event to the server and the event information is sent to Redis using the `nrp-sender-shim` which tells the worker to perform the search. Once the operation is completed a pass or fail event is updated, and the server responds by emitting an event to all client machines, so each client can see the search that was made.

## `app.js`

This is the server of the program. The server runs concurrently with the worker, and makes use of async await to await the request being sent to the worker for completion. It also makes use of our Web Sockets using Socket.io.

## `worker/index.js`

This is the worker of the program, performing pub-sub operations using `node-pub-sub`, which allows node to interact with the subscribe publish features in Redis. The worker receives the information from the server, and performs a search on Pixabay. The server then emits our event to all client sockets, updating each client machine.

## Run

To use the program make sure you are in the root project directory. 

Using Node.js run `npm install` to install all of the dependencies. 

Then run `npm start` which will begin concurrently running the server, and the worker. 