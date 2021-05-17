import { getConversation } from "./getConversation";

export const canUserAccessConversation = async (userId, conversationId) => {
  const conversation = await getConversation(conversationId);
  return conversation.memberIds.includes(userId);
};
