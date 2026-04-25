import Sidebar from "../components/Sidebar";
import ChannelList from "../components/ChannelList";
import ChatBox from "../components/ChatBox";

export default function Chat() {
  return (
    <div className="flex h-screen bg-[#1e1f22] text-white">
      <Sidebar />
      <ChannelList />
      <ChatBox />
    </div>
  );
}