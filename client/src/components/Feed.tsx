import { useEffect } from "react"
import { Post } from "./Post"
import axios from "axios"
import { useNavigate } from "react-router-dom";

interface PostType {
    _id: string;
    username: string;
    desc: string;
    img?: string;
    likes: string[];
    createdAt: number;
}

interface Props {
    posts: PostType[];
    setPosts: React.Dispatch<React.SetStateAction<PostType[]>>
}

export const Feed = ({ posts, setPosts }: Props) => {
    const navigate = useNavigate();
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get('http://localhost:5000/api/posts', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setPosts(
                    response.data.sort((p1: any, p2: any) => {
                        return new Date(p2.createdAt).getTime() - new Date(p1.createdAt).getTime();
                    })
                );
            } catch (err: any) {
                if (err.response.data === "Token ไม่ถูกต้อง!") {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                }
                console.log(err)
            }
        }

        fetchPost();
    }, [setPosts])

    const handleDeleteFromFeed = (postId: string) => {
        setPosts((prevPosts) => prevPosts.filter((p) => p._id !== postId));
    };
    return (
        <>
            {posts.map((p: any) => {
                return <Post
                    key={p._id}
                    _id={p._id}
                    username={p.username}
                    desc={p.desc}
                    img={p.img}
                    createdAt={p.createdAt}
                    likes={p.likes}
                    onDelete={handleDeleteFromFeed}
                />
            }
            )}

            {posts.length === 0 && (
                <div className="text-center text-gray-500 mt-10">
                    No posts yet. Follow someone or create a post!
                </div>
            )}
        </>
    )
}