import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { Post } from "../components/Post";

interface PostType {
    _id: string,
    username: string,
    desc: string,
    img?: string,
    likes: string[],
    createdAt: number
}

interface ProfileType {
    username: string,
    email: string,
    bio: string,
    profilePic: string,
    friends: string[],
    posts: PostType[],
    createdAt: number
}

export const Profile = () => {
    const [data, setData] = useState<ProfileType>({
        username: '',
        email: '',
        bio: '',
        profilePic: '',
        friends: [],
        posts: [],
        createdAt: 0
    });
    useEffect(() => {
        const fetchPofile = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get('http://localhost:5000/api/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log(response.data.posts);
                setData(response.data)
            } catch (err) {
                console.log(err);
            }
        }
        fetchPofile();
    }, [])

    return (
        <div className="min-h-screen flex">
            <div className="grow bg-[#111521] shadow-2xl">

                <div className="bg-[#161e2b] max-w-[600px] mx-auto my-3 rounded-2xl pb-8 overflow-hidden">
                    <div className="w-full h-50 bg-blue-900">
                    </div>
                    <div className="mx-8 mt-8 flex gap-8">
                        <div className="size-30 bg-blue-900 rounded-full"></div>
                        <div className="max-w-96">
                            <div className="mb-5">
                                <p className="text-lg">{data.username}</p>
                                <p className="mb-2 text-[#b1b1b1]">{data.email}</p>
                                <p className="text-[#b1b1b1]">{data.bio}</p>
                            </div>

                            <div className="flex gap-5">
                                <div className="text-[#b1b1b1]"> <span className="font-bold text-lg text-white">{data.posts.length}</span> Posts</div>
                                <Link to={'/friends'} className="text-[#b1b1b1]"> <span className="font-bold text-lg text-white">{data.friends.length}</span> Friends</Link>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    data.posts.map((p) => (
                        <Post key={p._id} _id={p._id} username={p.username} desc={p.desc} img={p.img} createdAt={p.createdAt} likes={p.likes} />
                    ))
                }
            </div>
            <div className="w-80"></div>
        </div>
    )
}