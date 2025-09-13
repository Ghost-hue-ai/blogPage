import React, { useState, useEffect, useRef } from "react";
import { socket } from "../socket";

const LiveMessagingComponent = ({
  sender,
  receiver,
  room,
}: {
  sender: string;
  receiver: string;
  room: string;
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [messages, setMessages] = useState<
    { sender: string; content: string }[]
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("message", (msg: { sender: string; content: string }) => {
      setMessages((prev) => [...prev, msg]);
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    socket.emit("joinRoom", room);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRef.current) return;
    const msg = inputRef.current.value.trim();
    if (!msg) return;
    socket.emit("sendRoomMessage", { sender, room, content: msg });
    setMessages((prev) => [...prev, { sender, content: msg }]);
    inputRef.current.value = "";
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="z-10 fixed right-0 top-16 flex h-[calc(100vh-4rem)] w-[400px] flex-col rounded-lg bg-gray-900 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700 rounded-t-lg">
        <div className="text-white font-semibold">{receiver}</div>
        <div className="text-gray-400 text-sm">
          {isConnected ? "Online" : "Offline"}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
      >
        {messages.map((msg, idx) => {
          const isSender = msg.sender === sender;
          return (
            <div
              key={idx}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] break-words px-4 py-2 rounded-2xl ${
                  isSender
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-700 text-gray-100 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 p-3 border-t border-gray-700 bg-gray-800 rounded-b-lg"
      >
        <input
          ref={inputRef}
          name="msg"
          id="msg"
          type="text"
          placeholder="Type a message..."
          className="flex-1 rounded-full bg-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="rounded-full bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default LiveMessagingComponent;
