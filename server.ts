//web socker server
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

//initialize Next.js
const app = next({ hostname, dev, port });

//app.getRequestHandler() returns a function (handler) that will handle incoming http requests for nextjs
const handler = app.getRequestHandler();

//prepare nextjs
app.prepare().then(() => {
    // const httpServer = createServer((req: IncomingMessage, res)=>{
    //     handler(req, res)
    // })
    //creates an HTTP server that uses Next.js to handle incoming requests
    const httpServer = createServer(handler);

    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);
    });

    httpServer
        .once("error", (err) => {
            console.log(err);
            process.exit(1)
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`)
        })
})