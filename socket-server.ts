import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { connection } from "./app/lib/redis";

const io = new Server(3001, {
  cors: {
    origin: "*", // Allow all origins for now, restrict in production
  },
});

const pubClient = connection;
const subClient = pubClient.duplicate();
const customSubClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));

customSubClient.subscribe("order-updates", (err, count) => {
  if (err) {
    console.error("Failed to subscribe: %s", err.message);
  } else {
    console.log(`Subscribed to ${count} channels.`);
  }
});

customSubClient.on("message", (channel, message) => {
  if (channel === "order-updates") {
    console.log(`Received message from ${channel}: ${message}`);
    const { orderId, status } = JSON.parse(message);
    io.to(`order:${orderId}`).emit("status-update", status);
  }
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("join-order", (orderId) => {
    console.log(`Client ${socket.id} joined order ${orderId}`);
    socket.join(`order:${orderId}`);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

console.log("Socket.io server running on port 3001");
