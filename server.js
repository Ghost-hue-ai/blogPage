import { createServer } from "node:http";
import { Server } from "socket.io";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);
  io.on("connection", (socket) => {
    console.log("Connected to Server SuccessFully");
    socket.on("joinRoom", (room) => {
      console.log(`${socket.id} joined ${room}`);

      socket.join(room);
    });
    socket.on("sendRoomMessage", ({ sender, room, content }) => {
      console.log(`${sender} sent ${content} on ${room}`);

      socket.to(room).emit("message", { sender, content });
    });
  });

  httpServer
    .once("error", (err) => {
      console.log(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`Server ready on http://${hostname}:${port}`);
    });
});
