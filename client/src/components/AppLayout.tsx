import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const AppLayout = () => {
    return (
        <div className="min-h-screen flex">
            <Sidebar />
            <div className="grow pl-80">
                <Outlet />
            </div>
        </div>
    );
};