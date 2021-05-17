import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

import { useUser } from "../auth";

export const ConversationPage = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInputValue, setMessageInputValue] = useState("");
  const { id: conversationId } = useParams();
  const { user } = useUser();

  useEffect(() => {
    const establishedSocketConnection = async () => {
      const socket = io("http://127.0.0.1:8080", {
        transports: ["websocket"],
        query: { conversationId, token: await user.getIdToken() },
      });

      setSocket(socket);

      socket.on("heresYourConversation", (conversation) => {
        console.log("initial messages loaded....", conversation);
        setMessages(conversation.messages);
      });

      socket.on("messagesUpdated", (data) => {
        console.log("Mesasges Updated!", data);
        setMessages(data);
      });

      socket.on("error", function (text) {
        console.log(text);
      });
    };

    if (user) {
      establishedSocketConnection();
    }

    return () => socket?.disconnect();
  }, []);

  const postMessage = async (text) => {
    socket.emit("postMessage", {
      text: messageInputValue,
      conversationId,
      query: {
        conversationId,
        token: await user.getIdToken(),
      },
    });
    setMessageInputValue("");
  };
  return (
    <div className="centered-container">
      {messages.map((message) => (
        <div key={message._id} className="list-item">
          <h3>{message.postedByID.name}</h3>
          <p>{message.text}</p>
        </div>
      ))}
      <div className="input-form">
        <input
          type="text"
          placeholder="Enter a new message here."
          value={messageInputValue}
          onChange={(e) => setMessageInputValue(e.target.value)}
        />
        <button onClick={postMessage}>Send</button>
      </div>
    </div>
  );
};
