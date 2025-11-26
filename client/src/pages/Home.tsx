export const Home = () => {
    return <div className="min-h-screen flex">
        <div className="grow bg-[#111521] shadow-2xl">
            <div className="bg-[#161e2b] max-w-[600px] mx-auto my-6 rounded-2xl p-3">
                <div className="border-b mb-3 border-[#8a93a2]/40">
                    <div className="flex gap-3 pb-3">
                        <div className="w-12 h-12 rounded-full bg-slate-500"></div>
                        <div className="grow text-[0px]">
                            <textarea className="w-full text-base bg-[#242d3b] focus:outline-3 outline-slate-500 outline-offset-3 rounded-lg p-3" placeholder="วันนี้โพสต์อะไรดี ?" />
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
                    <button className="bg-[#2e8dfe] hover:bg-[#2e8dfe]/50 px-8 py-1 rounded-lg cursor-pointer transition-colors duration-180">Post</button>
                </div>

            </div>
        </div>
        <div className="w-80"></div>
    </div>
}