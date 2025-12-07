import axios from "axios";
import { useEffect, useState } from "react"
import { format } from "timeago.js"

interface Props {
    _id: string,
    username: string,
    desc: string,
    img?: string,
    likes: string[],
    createdAt: number
}

export const Post = ({_id, username, desc, img, createdAt, likes }: Props) => {
    const [isSeeMore, setIsSeeMore] = useState<boolean>(false);
    const text = desc;
    const limit = 200;

    const [like, setLike] = useState(likes.length);
    const [isLiked, setIsLiked] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem('user') ?? "{}");

    useEffect(() => {
        setIsLiked(likes.includes(currentUser.username));
    }, [currentUser.username, likes]);

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


    return (
        <div className="bg-[#161e2b] max-w-[600px] mx-auto my-3 rounded-2xl p-3 space-y-3">
            <div className="flex items-center space-x-3">
                <div className="size-12 rounded-full bg-slate-500"></div>
                <p>{username} <span className="text-sm text-[#b1b1b1]">• {format(createdAt)}</span></p>
            </div>
            <div>
                <p className={isSeeMore ? "" : "line-clamp-3"}>{isSeeMore ? text : text.substring(0, limit)}
                    {text.length > limit &&
                        <span className="cursor-pointer text-right text-gray-300 " onClick={() => setIsSeeMore(pre => !pre)}>{isSeeMore ? " แสดงน้อยลง" : " ...เพิ่มเติม"}</span>
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
                <div className="flex items-center hover:bg-[#242d3b] gap-1 py-2 px-5 rounded-xl cursor-pointer transition-colors duration-180">
                    <i className="fa-solid fa-comment text-2xl"></i>
                    <span>123</span>
                </div>
                <div className="flex items-center hover:bg-[#242d3b] gap-1 py-2 px-5 rounded-xl cursor-pointer transition-colors duration-180">
                    <i className="fa-solid fa-share text-2xl"></i>
                    <span>123</span>
                </div>
            </div>
        </div>
    )
}