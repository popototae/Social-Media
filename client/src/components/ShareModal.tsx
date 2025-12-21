import { useEffect } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    friends: UserType[];
    handleSendToFriend: (friendId: string) => void;
}

interface UserType {
    _id: string;
    username: string;
    profilePic: string;
}

export const ShareModal = ({ isOpen, onClose, friends, handleSendToFriend }: ModalProps) => {
    useEffect(() => {
        if (isOpen) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = "hidden";
            document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
        } else {
            document.body.style.overflow = "auto";
            document.documentElement.style.paddingRight = "";
        }
        return () => {
            document.body.style.overflow = "auto";
            document.documentElement.style.paddingRight = "";
        };
    }, [isOpen]);
    if (!isOpen) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className="w-full max-w-xl rounded-lg bg-[#161e2b] p-6 pr-3 shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4 text-white">
                    <h3 className="font-bold">Send to...</h3>
                    <button className="flex items-center justify-center cursor-pointer hover:bg-[#242d3b] rounded-full py-2 px-1.5 transition-colors duration-180" onClick={onClose}>
                        <i className="fa-solid fa-xmark text-2xl"></i>
                    </button>
                </div>
                <div className="overflow-y-auto chat-scroll pr-3 space-y-2 max-h-[70dvh] ">

                    {friends.map((f: any) => (
                        <div key={f._id} className="flex items-center justify-between bg-[#242d3b] p-2 rounded-xl">
                            <div className="flex items-center gap-2">
                                <img src={f.profilePic} className="size-8 rounded-full object-cover" />
                                <span>{f.username}</span>
                            </div>
                            <button
                                onClick={() => handleSendToFriend(f._id)}
                                className="bg-[#2e8dfe] hover:bg-[#2e8dfe]/50 px-3 text-sm py-1 rounded-lg cursor-pointer transition-colors duration-180"
                            >
                                Send
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}