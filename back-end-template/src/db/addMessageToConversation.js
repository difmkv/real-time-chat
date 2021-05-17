import { ObjectID } from "mongodb";
import { db } from "./db";

export const addMessageToConversation = async (
  messageText,
  userId,
  coversationId
) => {
  const newId = new ObjectID();
  const newMessage = {
    _id: newId,
    text: messageText,
    postedByID: userId,
  };
  await db
    .getConnection()
    .collection("conversations")
    .updateOne(
      {
        _id: ObjectID(coversationId),
      },
      {
        $push: { messages: newMessage },
      }
    );
};
