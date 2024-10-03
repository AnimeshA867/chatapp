"use client";

import { FC, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Button from "./ui/button";
import { Send } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
interface ChatInputProps {
  chatPartner: User;
  chatId: string;
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {
  const [loading, setLoading] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [input, setInput] = useState("");
  const sendMessage = async () => {
    setLoading(true);
    try {
      await axios.post("/api/message/send", { text: input, chatId });
      setInput("");
      textAreaRef.current?.focus();
    } catch (error) {
      toast.error("Something went wrong. Please try again later!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="border-t border-gray-200 px-4 pt-2 mmb-2 sm:mb-0 ">
      <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset rign-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
        <TextareaAutosize
          ref={textAreaRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${chatPartner.name}`}
          className="block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6"
        />
        <div
          onClick={() => textAreaRef?.current?.focus()}
          className="py-2"
          aria-hidden="true"
        >
          <div className="py-px "></div>
          {/* <Button /> */}
        </div>
        <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-3 ">
          <div className="flex shrink-0">
            <Button onClick={sendMessage} isLoading={loading}>
              <Send className="font-semibold text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
