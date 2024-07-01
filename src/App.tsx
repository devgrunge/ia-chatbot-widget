import React, { useEffect, useState } from "react";
import { Widget, addResponseMessage, addUserMessage } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import { Container } from "@mui/material";

const App: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [widgetOpened, setWidgetOpened] = useState<boolean>(false);

  useEffect(() => {
    addResponseMessage("Welcome to this awesome chat!");
  }, []);

  const handleNewUserMessage = async (newMessage: string) => {
    addUserMessage(newMessage);

    const bodyResponse = {
      modelId: "modelo",
      prompt: newMessage,
    };

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/legal-assistant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyResponse),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.text();
      console.log("data ===> ", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    messages.forEach((message) => addResponseMessage(message));
  }, [messages]);

  const handleClickWidgetContainer = () => {
    setWidgetOpened((prevOpened) => !prevOpened); // Alternar entre true e false
  };

  return (
    <Container
      style={{ color: "black", cursor: "pointer" }}
      className="App"
      maxWidth="sm"
      onClick={handleClickWidgetContainer}
    >
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        title="My new awesome title"
        subtitle="And my cool subtitle"
      />
    </Container>
  );
};

export default App;
