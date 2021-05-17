export { protectRouteMiddleware } from "./protectRouteMiddleware";

import { getAllUsersRoute } from "./getAllUsersRoute";
import { getUserConversationsRoute } from "./getUserConversationsRoute";
import { createConversationRoute } from "./createConversationRoute";

export const routes = [
  getAllUsersRoute,
  getUserConversationsRoute,
  createConversationRoute,
];
