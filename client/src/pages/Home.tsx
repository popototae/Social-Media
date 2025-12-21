import { useRef, useState } from "react"
// import CarouselStory from "../components/CarouselStory"
import axios from "axios"
import { Feed } from "../components/Feed"
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";

interface PostType {
    _id: string;
    username: string;
    desc: string;
    img?: string;
    likes: string[];
    createdAt: number;
}

export const Home = () => {
    const [desc, setDesc] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [posts, setPosts] = useState<PostType[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleBtnPost = async () => {
        if (!desc && !file) return;
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append("desc", desc);

        if (file) {
            formData.append("file", file);
        }
        try {
            await axios.post('http://localhost:5000/api/posts', formData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setDesc("");
            setFile(null);
            const response = await axios.get('http://localhost:5000/api/posts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(response.data.sort((p1: any, p2: any) => {
                return new Date(p2.createdAt).getTime() - new Date(p1.createdAt).getTime();
            }));
        } catch (err: any) {
            if (err.response.data === "Token ไม่ถูกต้อง!") {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        }
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const imageFile = e.target.files[0];
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 800,
                useWebWorker: true
            }
            try {
                const compressedFile = await imageCompression(imageFile, options);
                const finalFile = new File([compressedFile], imageFile.name, { type: imageFile.type });
                setFile(finalFile);
            } catch (error) {
                console.log(error);
            }
        }
    };

    return <div className="min-h-screen flex">
        <div className="grow bg-[#111521] shadow-2xl">
            <div className="bg-[#161e2b] max-w-[600px] mx-auto my-3 rounded-2xl p-3">
                <div className="border-b mb-3 border-[#8a93a2]/40">
                    <div className="flex gap-3 pb-3">
                        <div className="grow text-[0px]">
                            <textarea className="w-full text-base bg-[#242d3b] focus:outline-3 outline-slate-500 outline-offset-3 rounded-lg p-3" placeholder="วันนี้โพสต์อะไรดี ?" value={desc} onChange={(e) => setDesc(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex gap-3 pb-3">
                        {
                            file && (
                                <div className="h-24 rounded-lg bg-slate-500 relative group">
                                    <img src={URL.createObjectURL(file)} className="h-full object-cover rounded-lg" />
                                    <i className="fa-solid fa-x opacity-0 absolute top-2.5 right-2.5 cursor-pointer group-hover:opacity-100"
                                        onClick={() => {
                                            setFile(null)
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = "";
                                            }
                                        }}></i>
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <input type="file" id="file-upload" hidden onChange={handleFileChange} ref={fileInputRef} accept=".png,.jpeg,.jpg" />
                    <label htmlFor="file-upload" className="hover:bg-[#242d3b] size-9 cursor-pointer rounded-full flex items-center justify-center transition-colors duration-180">
                        <i className="fa-solid fa-image text-xl"></i>
                    </label>
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