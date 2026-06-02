import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function ChatBox() {
const [messages, setMessages] = useState([]);
const [text, setText] = useState("");
const [imagePrompt, setImagePrompt] = useState("");

useEffect(() => {
socket.emit("joinChannel", "global");

```
socket.on("message", (msg) => {
  setMessages((prev) => [...prev, msg]);
});

return () => {
  socket.off("message");
};
```

}, []);

function send() {
if (!text.trim()) return;

```
socket.emit("sendMessage", {
  sender: "user",
  text,
  channelId: "global"
});

setText("");
```

}

async function generateImage() {
if (!imagePrompt.trim()) return;

```
const res = await fetch(
  "https://lumin-lsqc.onrender.com/generate-image",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt: imagePrompt
    })
  }
);

const data = await res.json();

setMessages((prev) => [
  ...prev,
  {
    sender: "Lumin AI",
    image: data.image
  }
]);

setImagePrompt("");
```

}

return (
  <div className="flex-1 flex flex-col">

```
  <div className="flex-1 p-4 overflow-y-auto">
    {messages.map((m, i) => (
      <div key={i} className="mb-4">

        <b>{m.sender}</b>

        {m.text && (
          <p>{m.text}</p>
        )}

        {m.image && (
          <img
            src={m.image}
            alt=""
            className="max-w-md rounded-lg mt-2"
          />
        )}

      </div>
    ))}
  </div>

  <div className="p-3 bg-[#2b2d31] flex flex-col gap-2">

    <div className="flex gap-2">
      <input
        className="flex-1 p-2 bg-[#1e1f22]"
        placeholder="Message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={send}>
        Send
      </button>
    </div>

    <div className="flex gap-2">
      <input
        className="flex-1 p-2 bg-[#1e1f22]"
        placeholder="Generate image..."
        value={imagePrompt}
        onChange={(e) =>
          setImagePrompt(e.target.value)
        }
      />

      <button onClick={generateImage}>
        Generate
      </button>
    </div>

  </div>

</div>


); 
}
