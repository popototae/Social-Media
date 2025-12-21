import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface UserType {
    _id: string;
    username: string;
    email: string;
    profilePic?: string;
}

interface RequestType {
    _id: string;
    sender: string;
    profilePic?: string;
    status: string;
}

export const Friends = () => {
    const [tap, setTap] = useState<"friends" | "requests" | "suggestions">("friends");
    const navigate = useNavigate();
    const [friends, setFriends] = useState<UserType[]>([]);
    const [requests, setRequests] = useState<RequestType[]>([]);
    const [suggestions, setSuggestions] = useState<UserType[]>([]);

    const token = localStorage.getItem("token");
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const resFriends = await axios.get(`http://localhost:5000/api/profile/friends`, config);
                setFriends(resFriends.data);
                const resReq = await axios.get('http://localhost:5000/api/friends/requests/incoming', config);
                setRequests(resReq.data);

                const resSugg = await axios.get('http://localhost:5000/api/friends/suggestions', config);
                const friendUsernames = resFriends.data.map((f: UserType) => f.username);
                const filteredSuggestions = resSugg.data.filter((u: UserType) =>
                    u.username !== currentUser.username && !friendUsernames.includes(u.username)
                );
                setSuggestions(filteredSuggestions);

            } catch (err: any) {
                console.log(err);
                if (err.response.data === "Token ไม่ถูกต้อง!") {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                }
            }
        }
        fetchData();
    }, [token, currentUser._id, currentUser.username]);

    const handleAddFriend = async (targetUsername: string) => {
        try {
            await axios.post(`http://localhost:5000/api/friends/request/${targetUsername}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(`ส่งคำขอหา ${targetUsername} เรียบร้อย!`);

            setSuggestions(suggestions.filter(u => u.username !== targetUsername));
        } catch (err: any) {
            console.log(err);
            alert(err.response?.data || "เกิดข้อผิดพลาด");
        }
    };

    const handleAccept = async (requestId: string, senderUsername: string) => {
        try {
            await axios.put(`http://localhost:5000/api/friends/accept/${requestId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(`เป็นเพื่อนกับ ${senderUsername} แล้ว!`);

            setRequests(requests.filter(r => r._id !== requestId));
        } catch (err) {
            console.log(err);
        }
    };

    const handleDeleteRequest = async (requestId: string) => {
        try {
            await axios.delete(`http://localhost:5000/api/friends/delete/${requestId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(requests.filter(r => r._id !== requestId));

        } catch (err) {
            console.log(err);
            alert("เกิดข้อผิดพลาดในการลบคำขอ");
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="grow bg-[#111521] shadow-2xl p-5">
                <div className="max-w-[600px] mx-auto my-8 rounded-2xl flex gap-5 justify-between select-none">
                    <div
                        onClick={() => setTap("friends")}
                        className={`flex flex-col py-8 grow text-center rounded-2xl cursor-pointer transition ${tap === "friends" ? "bg-[#2e8dfe] text-white shadow-lg" : "bg-[#161e2b] hover:bg-[#1f293a]"}`}
                    >
                        <span className="font-bold text-xl">{friends.length}</span> Friends
                    </div>
                    <div
                        onClick={() => setTap("requests")}
                        className={`flex flex-col py-8 grow text-center rounded-2xl cursor-pointer transition ${tap === "requests" ? "bg-[#2e8dfe] text-white shadow-lg" : "bg-[#161e2b] hover:bg-[#1f293a]"}`}
                    >
                        <span className="font-bold text-xl">{requests.length}</span> Requests
                    </div>
                    <div
                        onClick={() => setTap("suggestions")}
                        className={`flex flex-col py-8 grow text-center rounded-2xl cursor-pointer transition ${tap === "suggestions" ? "bg-[#2e8dfe] text-white shadow-lg" : "bg-[#161e2b] hover:bg-[#1f293a]"}`}
                    >
                        <span className="font-bold text-xl">{suggestions.length}</span> Suggestions
                    </div>
                </div>

                <div className="max-w-[600px] mx-auto space-y-3">
                    {tap === "friends" && (
                        <>
                            {friends.length === 0 && <p className="text-center text-gray-500 mt-10">You don't have any friends. Try the Suggestions tab to find some!</p>}
                            {friends.map(user => (
                                <div key={user._id} className="bg-[#161e2b] p-3 rounded-2xl flex items-center justify-between hover:bg-[#1a2332] transition">
                                    <div className="flex items-center space-x-3">
                                        <div className="size-12 bg-slate-500 rounded-full overflow-hidden border border-gray-600">
                                            <img src={user.profilePic} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-medium text-white">{user.username}</p>
                                            <p className="text-[#b1b1b1] text-xs">{user.email}</p>
                                        </div>
                                    </div>
                                    <Link to={'/profile/' + user.username} className="bg-[#242d3b] text-gray-400 hover:text-white px-4 py-2 rounded-xl text-sm transition">
                                        Profile
                                    </Link>
                                </div>
                            ))}
                        </>
                    )}

                    {tap === "requests" && (
                        <>
                            {requests.length === 0 && <p className="text-center text-gray-500 mt-10">No new requests</p>}
                            {requests.map(req => (
                                <div key={req._id} className="bg-[#161e2b] p-3 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="size-12 bg-slate-500 rounded-full overflow-hidden">
                                            <img src={req.profilePic} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-medium">{req.sender}</p>
                                            <p className="text-[#b1b1b1] text-xs">Sent you a request</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAccept(req._id, req.sender)}
                                            className="bg-[#2e8dfe] hover:bg-[#2e8dfe]/50 px-4 py-2 rounded-xl text-sm transition-colors duration-180 cursor-pointer"
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            onClick={() => handleDeleteRequest(req._id)}
                                            className="bg-[#242d3b] hover:bg-red-500/20 hover:text-red-500 text-gray-300 px-4 py-2 rounded-xl text-sm transition-colors duration-180 cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {tap === "suggestions" && (
                        <>
                            {suggestions.length === 0 && <p className="text-center text-gray-500 mt-10">No other users found</p>}
                            {suggestions.map(user => (
                                <div key={user._id} className="bg-[#161e2b] p-3 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="size-12 bg-slate-500 rounded-full overflow-hidden">
                                            <img src={user.profilePic} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-medium text-white">{user.username}</p>
                                            <p className="text-[#b1b1b1] text-xs">{user.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleAddFriend(user.username)}
                                        className="bg-[#2e8dfe] hover:bg-[#2e8dfe]/50 px-4 py-2 rounded-xl text-sm transition-colors duration-180 flex items-center gap-2 cursor-pointer"
                                    >
                                        <i className="fa-solid fa-user-plus"></i> Add
                                    </button>
                                </div>
                            ))}
                        </>
                    )}

                </div>
            </div>
            <div className="w-80"></div>
        </div>
    )
}