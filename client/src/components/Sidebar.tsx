import { Link } from "react-router"

export const Sidebar = () => {

    return (
        <div className="flex flex-col w-80 p-6 h-screen fixed">
            <Link to={"/"} className="bg-linear-to-r from-[#2e8dfe] to-[#36c49a] bg-clip-text text-transparent text-4xl font-[Caveat] pb-6 px-4 border-b-2 border-[#171925]">Social Media</Link>

            <div className="grow flex flex-col pt-6">
                <Link
                    to={"/"}
                    className="px-4 py-2 rounded-lg hover:bg-[#181e2c] transition-colors duration-180"
                >
                    <i className="fa-solid fa-house mr-4 text-lg"></i>
                    Home</Link>
                <Link
                    to={"/messages"}
                    className="px-4 py-2 rounded-lg hover:bg-[#181e2c] transition-colors duration-180"
                >
                    <i className="fa-solid fa-paper-plane mr-4 text-lg"></i>
                    Messages</Link>
                <Link
                    to={"/friends"}
                    className="px-4 py-2 rounded-lg hover:bg-[#181e2c] transition-colors duration-180"
                >
                    <i className="fa-solid fa-user-group mr-4 text-lg"></i>
                    Friends</Link>
                <Link
                    to={"/explore"}
                    className="px-4 py-2 rounded-lg hover:bg-[#181e2c] transition-colors duration-180"
                >
                    <i className="fa-solid fa-compass mr-4 text-lg"></i>
                    Explore</Link>
            </div>
            <div className="flex items-center">
                <Link
                    to={"/profile"}
                    className="grow px-4 py-2 rounded-lg hover:bg-[#181e2c] transition-colors duration-180"
                >
                    <i className="fa-solid fa-user mr-4 text-lg"></i>
                    Profile
                </Link>
                <Link to={"/login"} className="hover:bg-red-600/60 px-4 py-2 rounded-lg transition-colors duration-180">
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                </Link>
            </div>
        </div>
    )
} 