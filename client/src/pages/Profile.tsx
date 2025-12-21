import axios from "axios"
import { useEffect, useState } from "react"
import { Post } from "../components/Post";
import { useNavigate, useParams } from "react-router-dom";
import { ModalEditProfile } from "../components/ModalEditProfile";

interface PostType {
    _id: string;
    username: string;
    desc: string;
    img?: string;
    likes: string[];
    createdAt: number;
}

interface FriendsType {
    _id: string;
    username: string;
    email: string;
    profilePic: string;
}

interface ProfileType {
    username: string;
    email: string;
    bio: string;
    profilePic: string;
    friends: FriendsType[];
    posts: PostType[];
    createdAt: number;
}

export const Profile = () => {
    const { username: friendUsername } = useParams<{ username: string }>();
    const [data, setData] = useState<ProfileType>({
        username: '',
        email: '',
        bio: '',
        profilePic: '',
        friends: [],
        posts: [],
        createdAt: 0
    });
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const navigate = useNavigate();
    const [tap, setTap] = useState<number>(0);
    const [posts, setPosts] = useState<PostType[]>([]);

    useEffect(() => {
        const fetchPofile = async () => {
            try {
                const token = localStorage.getItem("token");
                let url = "http://localhost:5000/api/profile";
                if (friendUsername) {
                    url = `http://localhost:5000/api/profile/${friendUsername}`;
                }
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setData(response.data)
                setPosts(response.data.posts)
            } catch (err: any) {
                console.log(err);
                if (err.response.data === "Token ไม่ถูกต้อง!") {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                }
            }
        }
        fetchPofile();
    }, [friendUsername])
    const handleDeleteFromFeed = (postId: string) => {
        setPosts((prevPosts) => prevPosts.filter((p) => p._id !== postId));
    };

    const handleUpdateSuccess = (updatedUser: any) => {
        setData(updatedUser);
    };

    return (
        <div className="min-h-screen flex">
            <div className="grow bg-[#111521] shadow-2xl">

                <div className="bg-[#161e2b] max-w-[600px] mx-auto my-3 rounded-2xl pb-5 overflow-hidden">
                    <div className="w-full h-50 bg-blue-900">
                    </div>
                    <div className="mx-8 mt-8 flex gap-8">
                        <img className="size-30 object-cover bg-blue-900 rounded-full" src={data.profilePic} />
                        <div className="max-w-96 grow">
                            <div className="mb-5">
                                <p className="text-lg">{data.username}</p>
                                <p className="mb-2 text-[#b1b1b1]">{data.email}</p>
                                <p className="text-[#b1b1b1]">{data.bio}</p>
                            </div>

                            <div className="flex gap-3">
                                <div className="text-[#b1b1b1] px-5 py-2 rounded-xl hover:bg-[#242d3b] cursor-pointer" onClick={() => setTap(0)}> <span className="font-bold text-lg text-white">{posts.length}</span> Posts</div>
                                <div className="text-[#b1b1b1] px-5 py-2 rounded-xl hover:bg-[#242d3b] cursor-pointer" onClick={() => setTap(1)}> <span className="font-bold text-lg text-white">{data.friends.length}</span> Friends</div>
                            </div>
                        </div>
                        <div>
                            <button className="cursor-pointer hover:bg-[#242d3b] py-2 px-2.5 rounded-full transition-colors duration-180" onClick={() => { setOpenEdit(true) }}>
                                <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                            <ModalEditProfile
                                isOpen={openEdit}
                                onClose={() => setOpenEdit(false)}
                                email={data.email}
                                profilePic={data.profilePic}
                                bio={data.bio}
                                onUpdateSuccess={handleUpdateSuccess}
                            />
                        </div>
                    </div>
                </div>
                {
                    tap === 0 && posts.map((p) => (
                        <Post
                            key={p._id}
                            _id={p._id}
                            username={p.username}
                            desc={p.desc}
                            img={p.img}
                            createdAt={p.createdAt}
                            likes={p.likes}
                            onDelete={handleDeleteFromFeed}
                        />
                    ))
                }
                {
                    tap === 1 && data.friends.map((f) => (
                        <div key={f._id} className="max-w-[600px] mx-auto bg-[#161e2b] p-3 mb-3 rounded-2xl">
                            <div className="flex items-center space-x-3 p-5">
                                <img className="size-15 object-cover bg-slate-500 rounded-full" src={f.profilePic}/>
                                <div>
                                    <p className="text-lg">{f.username}</p>
                                    <p className="text-[#b1b1b1]">{f.email}</p>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="w-80"></div>
        </div>
    )
}