import { useState } from "react"
// import CarouselStory from "../components/CarouselStory"
import axios from "axios"
import { Feed } from "../components/Feed"

interface PostType {
    _id: string,
    username: string,
    desc: string,
    img?: string,
    likes: string[],
    createdAt: number
}

export const Home = () => {
    const [desc, setDesc] = useState<string>('');
    const [posts, setPosts] = useState<PostType[]>([]);

    const handleBtnPost = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/posts', {
                desc: desc,
            },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setDesc("");
            const response = await axios.get('http://localhost:5000/api/posts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(response.data.sort((p1: any, p2: any) => {
                return new Date(p2.createdAt).getTime() - new Date(p1.createdAt).getTime();
            }));
        } catch (err: any) {
            console.log(err.message);
        }
    }

    return <div className="min-h-screen flex">
        <div className="grow bg-[#111521] shadow-2xl">
            <div className="bg-[#161e2b] max-w-[600px] mx-auto my-3 rounded-2xl p-3">
                <div className="border-b mb-3 border-[#8a93a2]/40">
                    <div className="flex gap-3 pb-3">
                        <div className="size-12 rounded-full bg-slate-500"></div>
                        <div className="grow text-[0px]">
                            <textarea className="w-full text-base bg-[#242d3b] focus:outline-3 outline-slate-500 outline-offset-3 rounded-lg p-3" placeholder="วันนี้โพสต์อะไรดี ?" value={desc} onChange={(e) => setDesc(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex gap-3 pb-3">
                        <div className="size-24 rounded-lg bg-slate-500 relative group">
                            <i className="fa-solid fa-x opacity-0 absolute top-2.5 right-2.5 cursor-pointer group-hover:opacity-100"></i>
                        </div>
                        <div className="size-24 rounded-lg bg-slate-500 relative group">
                            <i className="fa-solid fa-x opacity-0 absolute top-2.5 right-2.5 cursor-pointer group-hover:opacity-100"></i>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <button className="hover:bg-[#242d3b] size-9 cursor-pointer rounded-full flex items-center justify-center transition-colors duration-180"><i className="fa-solid fa-image text-xl"></i></button>
                    <button className="bg-[#2e8dfe] hover:bg-[#2e8dfe]/50 px-8 py-1 rounded-lg cursor-pointer transition-colors duration-180" onClick={handleBtnPost}>Post</button>
                </div>
            </div>

            {/* <div className="bg-[#161e2b] max-w-[600px] mx-auto my-3 rounded-2xl p-3 flex space-x-3">
                <CarouselStory slides={SLIDES} options={{ align: 'start' }} />
            </div> */}
            <Feed setPosts={setPosts} posts={posts} />
        </div>
        <div className="w-80"></div>
    </div>
}