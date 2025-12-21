import axios from "axios";
import { useEffect, useState } from "react"
import { format } from "timeago.js"
import { ModalPost } from "./ModalPost";
import { ShareModal } from "./ShareModal";
import { useNavigate } from "react-router-dom";

interface Props {
    _id: string;
    username: string;
    desc: string;
    img?: string;
    likes: string[];
    createdAt: number;
    onDelete: (id: string) => void;
}

interface UserType {
    _id: string;
    username: string;
    profilePic: string;
}

export const Post = ({ _id, username, desc, img, createdAt, likes, onDelete }: Props) => {
    const [isSeeMore, setIsSeeMore] = useState<boolean>(false);
    const text = desc;
    const limit = 200;

    const [like, setLike] = useState<number>(likes.length);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [openShareModal, setOpenShareModal] = useState<boolean>(false);
    const [friends, setFriends] = useState<UserType[]>([]);
    const [openComment, setOpenComment] = useState<boolean>(false);
    const [openToggleEdit, setOpenToggleEdit] = useState<boolean>(false);
    const [commentCount, setCommentCount] = useState<number>(0);
    const increaseCount = () => {
        setCommentCount(prev => prev + 1)
    }
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('user') ?? "{}");
    const isOwner = username === currentUser.username;
    useEffect(() => {
        setIsLiked(likes.includes(currentUser.username));
    }, [currentUser.username, likes]);


    const fetchFriends = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/profile/friends/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFriends(response.data);
        } catch (err: any) {
            console.log(err);
            if (err.response.data === "Token ไม่ถูกต้อง!") {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        }
    };
    const likeHandler = () => {
        try {
            const token = localStorage.getItem('token');

            axios.put(`http://localhost:5000/api/posts/${_id}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.log(err);
        }

        setLike(isLiked ? like - 1 : like + 1);
        setIsLiked(!isLiked);
    };

    useEffect(() => {
        const fetchCommentCount = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/comments/count/${_id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                setCommentCount(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchCommentCount();
    }, [_id]);

    const handleSendToFriend = async (friendId: string) => {
        try {
            const convRes = await axios.post("http://localhost:5000/api/conversations", {
                senderId: currentUser.id,
                receiverId: friendId
            }, { headers: { Authorization: `Bearer ${token}` } });
            await axios.post("http://localhost:5000/api/messages", {
                conversationId: convRes.data._id,
                sender: currentUser.id,
                text: "Shared a post",
                type: "post",
                postId: _id
            }, { headers: { Authorization: `Bearer ${token}` } });
            setOpenShareModal(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบโพสต์นี้?")) return;

        try {
            await axios.delete(`http://localhost:5000/api/posts/${_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onDelete(_id);
        } catch (err) {
            console.log(err);
            alert("Failed to delete post");
        }
    }

    return (
        <div className="bg-[#161e2b] max-w-[600px] mx-auto my-3 rounded-2xl p-3 space-y-3">
            <div className="flex items-center space-x-3 px-3 pt-3">
                <img className="size-12 object-cover rounded-full bg-slate-500" src={"http://localhost:5000/api/profile/img/" + username}></img>
                <p className="grow">{username} <span className="text-sm text-[#b1b1b1]">• {format(createdAt)}</span></p>
                {
                    isOwner &&
                    <div className="cursor-pointer hover:bg-[#242d3b] py-2 px-2.5 rounded-full transition-colors duration-180 relative"
                        onClick={() => { setOpenToggleEdit(prev => !prev) }}
                    >
                        <i className="fa-solid fa-ellipsis"></i>
                        {
                            openToggleEdit &&
                            <div className="absolute right-0 py-2 px-3 bg-[#323b4a] rounded-lg">
                                <button
                                    className="cursor-pointer flex items-center gap-1.5 p-1"
                                    onClick={() => { console.log("กดล่ะ") }}
                                >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                    Edit</button>
                                <button
                                    className="cursor-pointer flex items-center gap-1.5 p-1"
                                    onClick={handleDelete}
                                >
                                    <i className="fa-solid fa-trash-can"></i>
                                    Delete</button>
                            </div>
                        }
                    </div>
                }
            </div>
            <div className="px-3">
                <p className={isSeeMore ? "" : "line-clamp-3"}>{isSeeMore ? text : text.substring(0, limit)}
                    {text.length > limit &&
                        <span className="cursor-pointer text-right text-gray-300 " onClick={() => setIsSeeMore(pre => !pre)}>{isSeeMore ? " แสดงน้อยลง" : " เพิ่มเติม"}</span>
                    }
                </p>
            </div>
            {img && <div>
                <img className="rounded-xl" src={img} />
            </div>}
            <div className="flex justify-between">
                <div onClick={likeHandler} className="flex items-center hover:bg-[#242d3b] gap-1 py-2 px-5 rounded-xl cursor-pointer transition-colors duration-180">
                    <i className={`fa-solid fa-heart text-2xl ${isLiked ? "text-red-500" : "text-white"}`}></i>
                    <span>{like}</span>
                </div>
                <div onClick={() => setOpenComment(true)} className="flex items-center hover:bg-[#242d3b] gap-1 py-2 px-5 rounded-xl cursor-pointer transition-colors duration-180">
                    <i className="fa-solid fa-comment text-2xl"></i>
                    <span>{commentCount}</span>
                </div>
                <div
                    className="flex items-center hover:bg-[#242d3b] gap-1 py-2 px-5 rounded-xl cursor-pointer transition-colors duration-180"
                    onClick={() => {
                        setOpenShareModal(true);
                        fetchFriends();
                    }}
                >
                    <i className="fa-solid fa-share text-2xl"></i>
                </div>
                <ModalPost
                    isOpen={openComment}
                    onClose={() => setOpenComment(false)}
                    post={{ _id, username, desc, img, createdAt, likes }}
                    increaseCount={() => increaseCount()}
                />

                <ShareModal
                    isOpen={openShareModal}
                    onClose={() => setOpenShareModal(false)}
                    friends={friends}
                    handleSendToFriend={handleSendToFriend}
                />
            </div>
        </div>
    )
}