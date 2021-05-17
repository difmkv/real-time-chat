import http from "http";
import express from "express";
import admin from "firebase-admin";
import socketIo from "socket.io";

import credentials from "./credentials.json";
import {
  db,
  getConversation,
  canUserAccessConversation,
  addMessageToConversation,
} from "./db";
import { routes, protectRouteMiddleware } from "./routes";

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});
const app = express();

app.use(express.json());

routes.forEach((route) => {
  app[route.method](route.path, protectRouteMiddleware, route.handler);
});

const server = http.createServer(app);
const io = socketIo(server);

io.use(async (socket, next) => {
  console.log("Verifying user auth token");

  if (!socket.handshake.query.token) {
    socket.emit("error", "You need to include an auth token.");
  }

  const user = await admin.auth().verifyIdToken(socket.handshake.query.token);
  console.log(user);
  socket.user = user;

  next();
});

io.on("connection", async (socket) => {
  console.log(
    "A new client has connected to socket.io",
    socket.handshake.query.conversationId
  );

  const { conversationId } = socket.handshake.query;

  const conversation = await getConversation(conversationId);

  socket.emit("heresYourConversation", conversation);

  socket.on("postMessage", async ({ text, conversationId }) => {
    // make sure user is member
    // add their message to the conversation
    // get the updated conversation
    // emit an event notifying everyone that there's a new message

    const { user_id: userId } = socket.user;
    const userIsAuthorized = await canUserAccessConversation(
      userId,
      conversationId
    );

    if (userIsAuthorized) {
      await addMessageToConversation(text, userId, conversationId);
      const updatedConversation = await getConversation(conversationId);

      io.emit("messagesUpdated", updatedConversation.messages);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const start = async () => {
  await db.connect("mongodb://localhost:27017");
  server.listen(8080, () => {
    console.log("Server is listening on port 8080");
  });
};

start();
