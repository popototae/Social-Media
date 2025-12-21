import axios from "axios";
import { use, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SharedPostBubble } from "../components/SharedPostBubble";
import { useNavigate } from "react-router-dom";

interface UserType {
    _id: string;
    username: string;
    profilePic: string;
}

interface MessageType {
    _id?: string;
    sender: string;
    text: string;
    type: string;
    postId?: string;
    createdAt: number;
}

interface ConversationType {
    _id: string;
    members: string[];
}

export const Messages = () => {
    const [friends, setFriends] = useState<UserType[]>([]);
    const [currentChat, setCurrentChat] = useState<ConversationType | null>(null);
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState<MessageType | null>(null);
    const [chatMate, setChatMate] = useState<UserType | null>(null);
    const [searchChat, setSearchChat] = useState<string>("")

    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);
    const socket = useRef<Socket | null>(null);

    useEffect(() => {
        socket.current = io("ws://localhost:5000");
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                type: data.type || "text",
                createdAt: Date.now(),
            });
        });
    }, []);

    useEffect(() => {
        if (arrivalMessage && currentChat?.members.includes(arrivalMessage.sender)) {
            setMessages((prev) => [...prev, arrivalMessage]);
        }
    }, [arrivalMessage, currentChat]);

    useEffect(() => {
        if (currentUser.id) {
            socket.current?.emit("addUser", currentUser.id);
        }
    }, [currentUser]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/profile/friends/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFriends(response.data);
            } catch (err) {
                console.log(err);
            }
        };
        if (currentUser.id) fetchFriends();
    }, [currentUser.id]);

    useEffect(() => {
        const getMessages = async () => {
            if (!currentChat) return;
            try {
                const res = await axios.get(`http://localhost:5000/api/messages/${currentChat._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessages(res.data);
            } catch (err: any) {
                console.log(err);
                if (err.response.data === "Token ไม่ถูกต้อง!") {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                }
            }
        };
        getMessages();
    }, [currentChat]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleStartChat = async (friend: UserType) => {
        setChatMate(friend);
        try {
            const res = await axios.post("http://localhost:5000/api/conversations", {
                senderId: currentUser.id,
                receiverId: friend._id
            }, { headers: { Authorization: `Bearer ${token}` } });
            setCurrentChat(res.data);
        } catch (err: any) {
            console.log(err);
            if (err.response.data === "Token ไม่ถูกต้อง!") {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentChat) return;

        const messagePayload = {
            sender: currentUser.id,
            text: newMessage,
            conversationId: currentChat._id,
        };

        const receiverId = currentChat.members.find(member => member !== currentUser.id);

        socket.current?.emit("sendMessage", {
            senderId: currentUser.id,
            receiverId,
            text: newMessage,
        });

        try {
            const res = await axios.post("http://localhost:5000/api/messages", messagePayload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages([...messages, res.data]);
            setNewMessage("");
        } catch (err : any) {
            console.log(err);
            if (err.response.data === "Token ไม่ถูกต้อง!") {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        }
    };

    return (
        <div className="max-h-screen flex">
            <div className="grow bg-[#111521] shadow-2xl my-5 mr-5 rounded-2xl flex flex-col">
                {chatMate &&
                    <div className="flex items-center space-x-3 p-5 border-b mb-3 border-[#8a93a2]/30 shrink-0">
                        <div className="size-12 rounded-full bg-slate-500 overflow-hidden">
                            <img src={chatMate.profilePic} className="w-full h-full object-cover" alt="" />
                        </div>
                        <p className="text-lg">{chatMate.username}</p>
                    </div>
                }
                <div className="flex flex-col h-full p-5 pt-0 overflow-hidden">
                    <div className="grow space-y-3 overflow-y-auto chat-scroll pr-2 pb-2">

                        {currentChat ? (
                            messages.map((m, index) => {
                                const isOwn = m.sender === currentUser.id;
                                return (
                                    <div ref={scrollRef} key={index} className={`flex gap-3 items-center ${isOwn ? "justify-end" : ""}`}>
                                        {!isOwn && (
                                            <div className="size-10 rounded-full bg-slate-500 overflow-hidden shrink-0">
                                                {chatMate && <img src={chatMate.profilePic} className="w-full h-full object-cover" alt="" />}
                                            </div>
                                        )}
                                        {m.type === "post" ? (
                                            <div>
                                                <SharedPostBubble postId={m.postId || ""} />
                                            </div>
                                        ) : (
                                            <p className={`${isOwn ? "bg-[#2e8dfe]" : "bg-[#242d3b]"} max-w-1/2 py-2 px-4 rounded-2xl wrap-break-word`}>{m.text}</p>
                                        )}
                                    </div>
                                )
                            })
                        ) : (
                            <div className="text-center text-gray-500 flex justify-center items-center h-full">Open a conversation to start chatting.</div>
                        )}
                    </div>

                    {chatMate &&
                        (<form onSubmit={handleSubmit} className="flex items-center border-t pt-5 border-[#8a93a2]/30 shrink-0">
                            <input
                                type="text"
                                className="w-full bg-[#242d3b] focus:outline-3 outline-[#242d3b] outline-offset-3 rounded-full pl-5 py-2 pr-10 text-white"
                                placeholder="Type something..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button type="submit" className="py-2.5 pl-2.5 ml-3 hover:bg-[#242d3d] rounded-full flex items-center cursor-pointer transition-colors duration-180">
                                <i className="fa-solid fa-paper-plane mr-4 text-lg text-[#2e8dfe]"></i>
                            </button>
                        </form>)}
                </div>
            </div>

            <div className="min-w-80 h-[calc(100vh-40px)] bg-[#111521] shadow-2xl my-5 mr-5 rounded-2xl flex flex-col">
                <div className="p-5 shrink-0">
                    <p className="text-xl font-bold">Messages</p>
                </div>
                <div className="relative px-5 shrink-0">
                    <input type="text" value={searchChat} className="w-full bg-[#242d3b] focus:outline-3 outline-[#242d3b] outline-offset-3 rounded-full pl-5 py-2 pr-12" placeholder="ค้นหา Messages" onChange={(e) => setSearchChat(e.target.value)} />

                    {searchChat === "" ? (
                        <i className="fa-solid fa-magnifying-glass absolute right-7 top-[50%] -translate-[50%] text-[#92969d]"></i>
                    ) : (
                        <i className="fa-solid fa-x absolute right-7 top-[50%] -translate-[50%] text-[#92969d] cursor-pointer py-1" onClick={() => setSearchChat("")}></i>
                    )}
                </div>

                <div className="my-5 h-full overflow-y-scroll chat-scroll pb-20">
                    {friends.map((f) => f.username.includes(searchChat) && (
                        <div
                            key={f._id}
                            onClick={() => handleStartChat(f)}
                            className={`flex items-center space-x-3 cursor-pointer px-5 py-3 hover:bg-[#242d3d] ${chatMate?._id === f._id ? "bg-[#242d3d]" : ""}`}
                        >
                            <div className="size-12 rounded-full bg-slate-500 overflow-hidden">
                                <img src={f.profilePic} className="w-full h-full object-cover" alt="" />
                            </div>
                            <p>{f.username}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}