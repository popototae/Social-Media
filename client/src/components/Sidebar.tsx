import { Link } from "react-router"

export const Sidebar = () => {

    return (
        <div className="flex flex-col w-80 p-6">
            <Link to={"/"} className="text-[#2e8dfe] pb-6 px-4 border-b-2 border-[#171925]">Social Media</Link>

            <div className="grow flex flex-col pt-6">
                <Link
                    to={"/"}
                    className="px-4 py-2 rounded-lg hover:bg-[#181e2c] transition-colors duration-180"
                >Home</Link>
                <Link 
                to={"/messages"}
                className="px-4 py-2 rounded-lg hover:bg-[#181e2c] transition-colors duration-180"
                >Messages</Link>
                <Link 
                to={"/friends"}
                className="px-4 py-2 rounded-lg hover:bg-[#181e2c] transition-colors duration-180"
                >Friends</Link>
                <Link 
                to={"/explore"}
                className="px-4 py-2 rounded-lg hover:bg-[#181e2c] transition-colors duration-180"
                >Explore</Link>
            </div>

            <div className="pt-6 px-4 border-t-2 border-[#171925]">
                Profile
            </div>
        </div>
    )
} 