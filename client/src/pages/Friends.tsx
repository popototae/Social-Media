export const Friends = () => {
    return (
        <div className="min-h-screen flex">
            <div className="grow bg-[#111521] shadow-2xl">
                <div className="max-w-[600px] mx-auto my-8 rounded-2xl flex gap-5 justify-between">
                    <div className="bg-[#161e2b] flex flex-col py-8 grow text-center rounded-2xl">
                        <span className="font-bold text-xl">1</span> Followers
                    </div >
                    <div className="bg-[#161e2b] flex flex-col py-8 grow text-center rounded-2xl">
                        <span className="font-bold text-xl">1</span> Following
                    </div>
                    <div className="bg-[#161e2b] flex flex-col py-8 grow text-center rounded-2xl">
                        <span className="font-bold text-xl">1</span> Pending
                    </div>
                </div>


                <div className="max-w-[600px] mx-auto bg-[#161e2b] p-3 rounded-2xl">
                    <div className="flex items-center space-x-3 p-5">
                        <div className="size-15 bg-slate-500 rounded-full"></div>
                        <div>
                            <p className="text-lg">potto._.me</p>
                            <p className="text-[#b1b1b1]">test@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-80"></div>
        </div>
    )
}