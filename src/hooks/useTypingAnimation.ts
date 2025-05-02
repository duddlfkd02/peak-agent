import { TypingChat } from "@/types/admin";
import { useRef } from "react";

interface useTypingAnimationProps {
  setChats: React.Dispatch<React.SetStateAction<TypingChat[]>>;
}

export default function useTypingAnimation({ setChats }: useTypingAnimationProps) {
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const runTypingAnimation = (chatId: number, fullContents: string) => {
    let currentText = "";
    let i = 0;

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    typingIntervalRef.current = setInterval(() => {
      if (!fullContents) return;

      if (i < fullContents.length) {
        currentText += fullContents[i];
        i++;
        setChats((prevChats) =>
          prevChats.map((chat) => (chat.id === chatId ? { ...chat, contents: currentText } : chat))
        );
      } else {
        clearInterval(typingIntervalRef.current!);
        typingIntervalRef.current = null;
        setChats((prevChats) =>
          prevChats.map((chat) => (chat.id === chatId ? { ...chat, isTyping: false, contents: fullContents } : chat))
        );
      }
    }, 30);
  };

  const clearTyping = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
  };

  return { runTypingAnimation, clearTyping };
}
