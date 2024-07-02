import React, { useEffect, useState } from "react";
import {
  Widget,
  addResponseMessage,
  addUserMessage,
  toggleMsgLoader,
} from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import vercelLogo from "../public/vercel.svg";

const ChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [widgetOpened, setWidgetOpened] = useState<boolean>(false);
  const [welcomeMessageSent, setWelcomeMessageSent] = useState<boolean>(false);
  const [placeholder, setPlaceholder] = useState("Digite sua mensagem...");

  const handleNewUserMessage = async (newMessage: string) => {
    try {
      toggleMsgLoader();
      addUserMessage(newMessage);

      const bodyResponse = {
        modelId: "modelo",
        prompt: newMessage,
      };

      const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
      setMessages([data]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      toggleMsgLoader();
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && !welcomeMessageSent) {
      addResponseMessage("Olá, como posso ajudar?");
      setWelcomeMessageSent(true);
    }
  }, [welcomeMessageSent]);

  useEffect(() => {
    if (typeof window !== "undefined" && messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      addResponseMessage(latestMessage);
    }
  }, [messages]);

  const handleClickWidgetContainer = () => {
    setWidgetOpened((prevOpened) => !prevOpened);
  };

  const handleFocus = () => {
    setPlaceholder("");
  };

  const handleBlur = () => {
    setPlaceholder("Digite sua mensagem...");
  };

  return (
    <div style={{ color: "black" }} onClick={handleClickWidgetContainer}>
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        title="Brain Legal Assistant"
        subtitle=""
        profileAvatar={vercelLogo.src}
        senderPlaceHolder={placeholder}
        emojis={false}
        inputProps={{
          className: "input-left-caret",
          onFocus: handleFocus,
          onBlur: handleBlur,
        }}
      />
    </div>
  );
};

export default ChatWidget;
