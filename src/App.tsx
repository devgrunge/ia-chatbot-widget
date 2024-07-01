import React, { useEffect, useState } from "react";
import {
  Widget,
  addResponseMessage,
  addUserMessage,
  toggleMsgLoader,
} from "react-chat-widget";
import { Container } from "@mui/material";
import "react-chat-widget/lib/styles.css";
import "react-chat-widget/lib/styles.css";
import reactLogo from "./assets/react.svg";

const ChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [widgetOpened, setWidgetOpened] = useState<boolean>(false);

  const handleNewUserMessage = async (newMessage: string) => {
    try {
      toggleMsgLoader();
      addUserMessage(newMessage);

      const bodyResponse = {
        modelId: "modelo",
        prompt: newMessage,
      };

      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/legal-assistant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(bodyResponse),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.text();
      setMessages((prevMessages) => [...prevMessages, data]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      toggleMsgLoader();
    }
  };

  useEffect(() => {
    addResponseMessage("Olá ,como poso ajudar?");
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      addResponseMessage(latestMessage);
    }
  }, [messages]);

  const handleClickWidgetContainer = () => {
    setWidgetOpened((prevOpened) => !prevOpened); // Alternar entre true e false
  };

  return (
    <Container
      style={{ color: "black" }}
      className="App"
      maxWidth="sm"
      onClick={handleClickWidgetContainer}
    >
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        title="Brain Legal Assistant"
        subtitle=""
        profileAvatar={reactLogo}
        senderPlaceHolder="tire sua dúvida..."
        emojis={true}
      />
    </Container>
  );
};

export default ChatWidget;
