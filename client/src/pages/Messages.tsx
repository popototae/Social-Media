export const Messages = () => {
    return (
        <div className="min-h-screen flex">
            <div className="grow bg-[#111521] shadow-2xl my-5 mr-5 rounded-2xl">
                <div className="flex items-center space-x-3 p-5 border-b mb-3 border-[#8a93a2]/30">
                    <div className="size-12 rounded-full bg-slate-500"></div>
                    <p className="text-lg">potto._.me</p>
                </div>

                <div className="flex flex-col h-[calc(100%-100px)] p-5 pt-0">
                    <div className="grow space-y-3">

                        <div className="flex gap-3 items-center">
                            <div className="size-10 rounded-full bg-slate-500"></div>
                            <p className="bg-[#242d3b] max-w-1/2 py-2 px-4 rounded-2xl">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos repellat assumenda soluta nobis odit velit unde incidunt cum reiciendis labore?</p>
                        </div>
                        <div className="flex gap-3 items-center">
                            <div className="size-10 rounded-full bg-slate-500"></div>
                            <p className="bg-[#242d3b] max-w-1/2 py-2 px-4 rounded-2xl"> unde incidunt cum reiciendis labore?</p>
                        </div>
                        <div className="flex gap-3 items-center">
                            <div className="size-10 rounded-full bg-slate-500"></div>
                            <p className="bg-[#242d3b] max-w-1/2 py-2 px-4 rounded-2xl">สวัสดีจ้า มีคนอยู่มั้ย</p>
                        </div>
                        <div className="flex gap-3 items-center justify-end">
                            <p className="bg-[#2e8dfe] max-w-1/2 py-2 px-4 rounded-2xl">ไม่มีหรอกๆๆ</p>
                        </div><div className="flex gap-3 items-center justify-end">
                            <p className="bg-[#2e8dfe] max-w-1/2 py-2 px-4 rounded-2xl">ไปไหนดี ไปไหนกันต่อ</p>
                        </div>
                    </div>
                    <div className="flex items-center border-t pt-5 border-[#8a93a2]/30">
                        <input type="text" className="w-full bg-[#242d3b] focus:outline-3 outline-[#242d3b] outline-offset-3 rounded-full pl-5 py-2 pr-10" placeholder="Type something..." />
                        <button className="py-2.5 pl-2.5 ml-3 hover:bg-[#242d3d] rounded-full flex items-center cursor-pointer transition-colors duration-180">
                            <i className="fa-solid fa-paper-plane mr-4 text-lg text-[#2e8dfe]"></i>
                        </button>
                    </div>
                </div>

            </div>
            <div className="min-w-80 h-[calc(100vh-40px)] bg-[#111521] shadow-2xl my-5 mr-5 rounded-2xl">
                <div className="p-5">
                    <p className="text-xl font-bold">Messages</p>
                </div>
                <div className="relative px-5">
                    <input type="text" className="w-full bg-[#242d3b] focus:outline-3 outline-[#242d3b] outline-offset-3 rounded-full pl-5 py-2 pr-12" placeholder="ค้นหา Messages" />
                    <i className="fa-solid fa-magnifying-glass absolute right-7 top-[50%] -translate-[50%] text-[#92969d]"></i>
                </div>
                <div className="my-5 h-[calc(100%-140px)] overflow-y-scroll chat-scroll">

                    {[...Array(10)].map(() => (
                        <div className="flex items-center space-x-3 cursor-pointer hover:bg-[#242d3d] px-5 py-3">
                            <div className="size-12 rounded-full bg-slate-500"></div>
                            <p>potto._.me</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}