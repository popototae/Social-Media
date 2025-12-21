import { useEffect, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import axios from "axios";


interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    profilePic: string;
    email: string;
    bio: string;
    onUpdateSuccess: (updatedUser: any) => void;
}

export const ModalEditProfile = ({ isOpen, onClose, profilePic, email, bio, onUpdateSuccess }: ModalProps) => {
    const [newEmail, setNewEmail] = useState<string>("");
    const [newBio, setNewBio] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (email || bio) {
            setNewEmail(email);
            setNewBio(bio);
        }
    }, [email, bio]);

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
    const handleSave = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("email", newEmail);
        formData.append("bio", newBio);

        if (file) {
            formData.append("file", file);
        }
        try {

            const res = await axios.put('http://localhost:5000/api/profile/', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            localStorage.setItem("user", JSON.stringify(res.data));
            onUpdateSuccess(res.data);

            setLoading(false);
            onClose();

        } catch (err) {
            console.log(err);
            setLoading(false);
            alert("Update failed!");
        }
    };
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg rounded-lg bg-[#161e2b] p-6 shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="space-y-6 mx-auto my-8s">
                    <div className="flex justify-center items-center gap-3">
                        <img className="size-30 object-cover bg-blue-900 rounded-full" src={file ? URL.createObjectURL(file) : profilePic} />
                        <div className="flex flex-col gap-3">
                            <label htmlFor="fileupload" className="bg-[#242d3b] py-2 px-4 rounded-xl hover:bg-[#242d3b]/50 transition-colors duration-180 cursor-pointer">
                                <i className="fa-solid fa-image mr-1"></i>
                                Upload
                            </label>
                            {/* <button className="bg-[#242d3b] py-2 px-4 rounded-xl hover:bg-red-600/60  transition-colors duration-180 cursor-pointer" onClick={() => setFile(null)}>
                                <i className="fa-solid fa-trash-can mr-1"></i>
                                Remove
                            </button> */}
                        </div>
                        <input type="file" hidden id="fileupload" onChange={handleFileChange} ref={fileInputRef} accept=".png,.jpeg,.jpg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full bg-[#242d3b] text-white rounded-xl px-4 py-3 focus:outline-3 outline-[#242d3b] outline-offset-3 placeholder-gray-600"
                            placeholder="example@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="bio">Bio</label>
                        <textarea
                            id="bio"
                            value={newBio}
                            onChange={(e) => setNewBio(e.target.value)}
                            className="w-full bg-[#242d3b] text-white rounded-xl px-4 py-3 focus:outline-3 outline-[#242d3b] outline-offset-3 placeholder-gray-600"
                            placeholder="Type something..."
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                onClose();
                                setFile(null);
                                if (fileInputRef.current) {
                                    fileInputRef.current.value = "";
                                }
                            }}
                            className="w-full bg-[#242d3b] hover:bg-[#242d3b]/50 text-white py-3 rounded-xl transition-colors duration-180 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className={`w-full text-white py-3 rounded-xl transition-colors duration-180 cursor-pointer ${loading ? "bg-[#242d3b]" : "bg-[#3b82f6] hover:bg-[#2e8dfe]/50"}`}
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}