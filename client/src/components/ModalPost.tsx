import { useEffect } from "react";
import { format } from "timeago.js"
import { Comments } from "./Comments";


interface Post {
    _id: string;
    username: string;
    desc: string;
    img?: string;
    likes: string[];
    createdAt: number;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: Post;
    increaseCount: () => void;
}

export const ModalPost = ({ isOpen, onClose, post, increaseCount }: ModalProps) => {
    useEffect(() => {
        if (isOpen) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = "hidden";
            document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
        } else {
            document.body.style.overflow = "auto";
            document.documentElement.style.paddingRight = "";
        }
        return () => {
            document.body.style.overflow = "auto";
            document.documentElement.style.paddingRight = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className="w-full max-w-4xl rounded-lg bg-[#161e2b] p-6 shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                        <img className="size-12 rounded-full bg-slate-500" src={"http://localhost:5000/api/profile/img/" + post.username}></img>
                        <p>{post.username} <span className="text-sm text-[#b1b1b1]">• {format(post.createdAt)}</span></p>
                    </div>
                    <button className="flex items-center justify-center cursor-pointer hover:bg-[#242d3b] rounded-full py-2 px-1.5 transition-colors duration-180" onClick={onClose}>
                        <i className="fa-solid fa-xmark text-2xl"></i>
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="border-r pr-3 max-h-[60dvh] border-[#8a93a2]/40 overflow-y-auto chat-scroll">
                        <p className="mb-2.5">
                            {post.desc}
                        </p>
                    <img src={post.img}/>
                    </div>
                    <Comments postId={post._id} increaseCount={increaseCount} />
                </div>
            </div>
        </div>
    );
}
