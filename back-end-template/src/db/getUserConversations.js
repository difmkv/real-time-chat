import { db } from "./db";

export const getUserConversations = async (userId) => {
  const conversations = db
    .getConnection()
    .collection("conversations")
    .find({ memberIds: userId })
    .toArray();
  return conversations;
};
