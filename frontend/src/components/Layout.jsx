import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <div className="w-64 h-full fixed top-0 left-0 bg-gray-900 z-50">
                <Sidebar />
            </div>
            <main className="flex-1 ml-64 overflow-y-auto w-full h-full relative p-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
