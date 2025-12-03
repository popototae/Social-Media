import { useState } from "react"

export const Post = () => {
    const [isSeeMore, setIsSeeMore] = useState<boolean>(false);
    const text = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae fugit sint mollitia itaque provident nemo cumque nihil ipsam doloribus quaerat, veritatis, enim deserunt aliquid. Ab minima accusantium aliquam delectus maxime quis corrupti, odit excepturi, perferendis, a vero quod unde autem dicta recusandae. Ea esse maiores vero consectetur eius, nihil quos veritatis? Mollitia, optio voluptatem. Placeat nulla incidunt quasi eveniet. Sapiente amet et pariatur modi quos minima esse, error, eaque impedit voluptates cupiditate repellendus possimus a nam fuga eligendi reiciendis hic beatae veritatis illo? Temporibus velit, esse sunt natus quam provident quisquam tempore ipsam iusto repellendus placeat! Praesentium debitis delectus facere?"
    const limit = 200;


    return (
        <div className="bg-[#161e2b] max-w-[600px] mx-auto my-3 rounded-2xl p-3 space-y-3">
            <div className="flex items-center space-x-3">
                <div className="size-12 rounded-full bg-slate-500"></div>
                <p>potto._.me</p>
            </div>
            <div>
                <p className={isSeeMore ? "" : "line-clamp-3"}>{isSeeMore ? text : text.substring(0, limit)}
                    {text.length > limit &&
                        <span className="cursor-pointer text-right text-gray-300 " onClick={() => setIsSeeMore(pre => !pre)}>{isSeeMore ? " แสดงน้อยลง" : " ...เพิ่มเติม"}</span>
                    }
                </p>
            </div>
            <div>
                <img className="rounded-xl" src="https://cdn.dribbble.com/userupload/14956211/file/original-77da247aa5de5db69db1ea93b4b26d3e.jpg?resize=1504x1128&vertical=center" />
            </div>
            <div className="flex justify-between">
                <div className="flex items-center hover:bg-[#242d3b] gap-1 py-2 px-5 rounded-xl cursor-pointer transition-colors duration-180">
                    <i className="fa-solid fa-heart text-2xl"></i>
                    <span>123</span>
                </div>
                <div className="flex items-center hover:bg-[#242d3b] gap-1 py-2 px-5 rounded-xl cursor-pointer transition-colors duration-180">
                    <i className="fa-solid fa-comment text-2xl"></i>
                    <span>123</span>
                </div>
                <div className="flex items-center hover:bg-[#242d3b] gap-1 py-2 px-5 rounded-xl cursor-pointer transition-colors duration-180">
                    <i className="fa-solid fa-share text-2xl"></i>
                    <span>123</span>
                </div>
            </div>
        </div>
    )
}