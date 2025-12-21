import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const SharedPostBubble = ({ postId }: { postId: string }) => {
    const [postData, setPostData] = useState<any>(null);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/posts/${postId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPostData(res.data);
            } catch (err: any) {
                console.log(err);
                if (err.response.data === "Token ไม่ถูกต้อง!") {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                }
            }
        };
        fetchPost();
    }, [postId]);

    if (!postData) {
        return (
            <div className="bg-[#242d3b] text-gray-400 rounded-2xl py-2 px-3.5">
                <p className="">โพสต์นี้ไม่พร้อมใช้งาน</p>
                <p className="">หรือถูกลบแล้วโดยเจ้าของ</p>
            </div>
        )
    }

    return (
        <div className="bg-[#242d3b] rounded-2xl overflow-hidden mt-1 max-w-[200px]">
            {postData.img && <img src={postData.img} className="w-full h-24 object-cover" />}
            <div className="">
                <p className="font-bold truncate border-b border-gray-700 py-1.5 px-3">{postData.username}</p>
                <p className="text-gray-500 truncate py-1.5 px-3">{postData.desc}</p>
            </div>
        </div>
    );
};