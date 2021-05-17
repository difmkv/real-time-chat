import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { PrivateRoute, SignInPage } from "./auth";
import { NavBar } from "./navigation";
import {
  ConversationsListPage,
  NewConversationPage,
  ConversationPage,
} from "./conversations";

const routes = [
  {
    path: "/sign-in",
    Component: SignInPage,
  },
  {
    path: "/",
    private: true,
    exact: true,
    Component: ConversationsListPage,
  },
  {
    path: "/new-conversation",
    private: true,
    Component: NewConversationPage,
  },
  {
    path: "/conversations/:id",
    private: true,
    Component: ConversationPage,
  },
];

export const Routes = ({ isLoading, user }) => {
  return (
    <Router>
      <NavBar user={user} />
      <Switch>
        {routes.map((route, index) => {
          const RouteType = route.private ? PrivateRoute : Route;
          return (
            <RouteType
              key={index}
              path={route.path}
              exact={route.exact}
              isLoading={isLoading}
              isAuthed={!!user}
            >
              <route.Component />
            </RouteType>
          );
        })}
      </Switch>
    </Router>
  );
};
