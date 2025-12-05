import { Post } from "../components/Post"

export const Profile = () => {
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
                                <p className="text-lg">potto._.me</p>
                                <p className="mb-2 text-[#b1b1b1]">test@gmail.com</p>
                                <p className="text-[#b1b1b1]">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Autem, voluptates.</p>
                            </div>

                            <div className="flex gap-5">
                                <div className="text-[#b1b1b1]"> <span className="font-bold text-lg text-white">1</span> Posts</div>
                                <div className="text-[#b1b1b1]"> <span className="font-bold text-lg text-white">1</span> Followers</div>
                                <div className="text-[#b1b1b1]"> <span className="font-bold text-lg text-white">1</span> Following</div>
                            </div>
                        </div>
                    </div>
                </div>
                <Post/>
            </div>
            <div className="w-80"></div>
        </div>
    )
}