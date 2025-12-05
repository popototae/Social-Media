import axios from 'axios';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', {
                email: email,
                password: password
            })

            setMessage(response.data.message)
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/')
        }
        catch (err: any) {
            setMessage(err.response.data.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center text-white">

            <div className="bg-[#111521] p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-800">

                <div className="text-center mb-8">
                    <h1 className="bg-linear-to-r from-[#2e8dfe] to-[#36c49a] bg-clip-text text-transparent text-4xl font-[Caveat]">
                        Social Media
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm">Welcome back! Please login to your account.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#242d3b] text-white rounded-xl px-4 py-3 focus:outline-3 outline-[#242d3b] outline-offset-3 placeholder-gray-600"
                            placeholder="example@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#242d3b] text-white rounded-xl px-4 py-3 focus:outline-3 outline-[#242d3b] outline-offset-3 placeholder-gray-600"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <p className='text-center text-red-500/60'>{message}</p>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#3b82f6] hover:bg-[#2e8dfe]/50 text-white py-3 rounded-xl transition-colors duration-180 cursor-pointer"
                    >
                        Login
                    </button>

                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-[#3b82f6] font-semibold hover:underline">
                        Register
                    </Link>
                </div>

            </div>
        </div>
    );
};