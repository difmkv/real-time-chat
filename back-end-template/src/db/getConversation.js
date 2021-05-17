import { ObjectID } from "mongodb";
import { db } from "./db";
import { getUser } from "./getUser";

/**
 {
     name: "my Group",
     _id: ObjectID(43fds24fsd23r42fsd),
     memberIds: [1, 2, 3],
     members: [{
         name: "Julie",
         id: 3123
     }]
     messages: [{
         _id: ObjectID(32423fsd),
         postedByID: "321421",
         postedBy: {
             name: "Jim",
             id: 312
         },
         text: "bla bla"
     }]
 }
 */

export const getConversation = async (conversationId) => {
  const conversation = await db
    .getConnection()
    .collection("conversations")
    .findOne({ _id: ObjectID(conversationId) });
  const members = await Promise.all(
    conversation.memberIds.map((id) => getUser(id))
  );
  const usersForMessages = await Promise.all(
    conversation.messages.map((message) => getUser(message.postedByID))
  );
  const populatedMessages = conversation.messages.map((message, i) => ({
    ...message,
    postedByID: usersForMessages[i],
  }));
  const populatedConversation = {
    ...conversation,
    members,
    messages: populatedMessages,
  };
  return populatedConversation;
};
