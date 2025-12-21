import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { useNavigate } from "react-router-dom";

interface CommentType {
    _id: string;
    userId: string;
    desc: string;
    createdAt: string;
}

interface UserType {
    _id: string;
    username: string;
    profilePic: string;
}

interface CommentsProps {
    postId: string;
    increaseCount: () => void;
}

export const Comments = ({ postId, increaseCount }: CommentsProps) => {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [newComment, setNewComment] = useState("");
    const [usersInfo, setUsersInfo] = useState<Record<string, UserType>>({});

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get(`http://localhost:5000/api/comments/${postId}`, config);
                const fetchedComments: CommentType[] = res.data;
                setComments(fetchedComments);
                const usernamesToFetch = [...new Set(fetchedComments.map((c) => c.userId))]
                    .filter(username => !usersInfo[username]);
                const userPromises = usernamesToFetch.map(async (username) => {
                    const resUser = await axios.get(`http://localhost:5000/api/profile/${username}`, config);
                    return { username, data: resUser.data };
                });
                const usersData = await Promise.all(userPromises);
                const newUsersInfo: Record<string, UserType> = {};
                usersData.forEach(item => {
                    newUsersInfo[item.username] = {
                        _id: item.data._id,
                        username: item.data.username,
                        profilePic: item.data.profilePic
                    };
                });

                setUsersInfo(prev => ({ ...prev, ...newUsersInfo }));

            } catch (err: any) {
                if (err.response.data === "Token ไม่ถูกต้อง!") {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                }
                console.error("Error fetching comments or users:", err);
            }
        };
        fetchComments();
    }, [postId, token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const res = await axios.post("http://localhost:5000/api/comments", {
                desc: newComment,
                postId: postId,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setComments([res.data, ...comments]);
            setNewComment("");
            if (!usersInfo[currentUser.username]) {
                setUsersInfo(prev => ({ ...prev, [currentUser.username]: currentUser }));
            }
            increaseCount();

        } catch (err: any) {
            console.error("Error sending comment:", err);
            if (err.response.data === "Token ไม่ถูกต้อง!") {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        }
    };
    return (
        <div className="flex flex-col">
            <p className="text-lg font-bold mb-3">Comments</p>
            <div className="grow max-h-[60dvh] overflow-y-auto chat-scroll">
                {comments.length === 0 ? (
                    <div className="flex h-full flex-col justify-center items-center text-white/40 gap-2 py-5">
                        <i className="fa-solid fa-comment-slash text-5xl"></i>
                        <p className="">Add your first comment!</p>
                    </div>
                ) : (comments.map((comment) => (

                    <div className="flex space-x-3 mb-3" key={comment._id}>
                        <img className="size-10 rounded-full bg-slate-500" src={usersInfo[comment.userId]?.profilePic}></img>
                        <div>
                            <p className="text-sm text-[#b1b1b1]">{format(comment.createdAt)}</p>
                            <p className="font-bold">{comment.userId} : <span className="font-normal">{comment.desc}</span></p>
                        </div>
                    </div>
                )))}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                    type="text"
                    className="w-full bg-[#1f2a3c] focus:outline-3 outline-[#1f2a3c] outline-offset-3 rounded-full pl-5 py-2 pr-10 text-white"
                    placeholder="Comment something..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                    type="submit"
                    className="pl-3 py-2 rounded-full cursor-pointer hover:bg-[#242d3d] transition-colors duration-180"
                >
                    <i className="fa-solid fa-paper-plane mr-4 text-lg text-[#2e8dfe]"></i>

                </button>
            </form>
        </div>
    );
};