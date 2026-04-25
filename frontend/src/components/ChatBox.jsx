import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.emit("joinChannel", "global");

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
  }, []);

  function send() {
    socket.emit("sendMessage", {
      sender: "user",
      text,
      channelId: "global"
    });

    setText("");
  }

  return (
    <div className="flex-1 flex flex-col">
      
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((m, i) => (
          <p key={i}>
            <b>{m.sender}:</b> {m.text}
          </p>
        ))}
      </div>

      <div className="p-3 bg-[#2b2d31] flex gap-2">
        <input
          className="flex-1 p-2 bg-[#1e1f22]"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={send}>Send</button>
      </div>

    </div>
  );
}