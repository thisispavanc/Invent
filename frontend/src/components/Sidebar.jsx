import { Home, Users, Smartphone, Users as EmployeesIcon, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // path to context might differ depending on folder structure

const Sidebar = () => {
    const { user, logout } = useAuth(); // Assuming useAuth provides user object

    const links = [
        { name: 'Dashboard', path: '/dashboard', icon: Home, roles: ['super_admin', 'admin', 'employee'] },
        { name: 'User Management', path: '/admin/users', icon: Users, roles: ['super_admin'] },
        { name: 'Inventory', path: '/inventory', icon: Smartphone, roles: ['super_admin', 'admin'] },
        { name: 'Employees', path: '/employees', icon: EmployeesIcon, roles: ['super_admin', 'admin'] },
    ];

    const filteredLinks = links.filter(link => user && link.roles.includes(user.role));

    return (
        <div className="h-screen w-64 bg-gray-900 text-white flex flex-col fixed left-0 top-0 z-50 shadow-lg">
            <div className="p-6 text-2xl font-bold border-b border-gray-800 tracking-wider">
                Tanuh<span className="text-blue-500">Inventory</span>
            </div>
            <nav className="flex-1 overflow-y-auto py-6">
                <ul className="space-y-1">
                    {filteredLinks.map((link) => (
                        <li key={link.path}>
                            <NavLink
                                to={link.path}
                                className={({ isActive }) =>
                                    `flex items-center px-6 py-3 transition-colors duration-200 hover:bg-gray-800 hover:text-white ${isActive ? 'bg-gray-800 border-l-4 border-blue-500 text-white' : 'text-gray-400'
                                    }`
                                }
                            >
                                <link.icon className="w-5 h-5 mr-3" />
                                <span className="font-medium">{link.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t border-gray-800 bg-gray-900">
                <div className="flex items-center mb-4 px-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-md">
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3 overflow-hidden">
                        <p className="text-sm font-medium truncate">{user?.username}</p>
                        <p className="text-xs text-gray-400 capitalize truncate">{user?.role?.replace('_', ' ')}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-900/20 w-full py-2 rounded transition-colors duration-200 from-neutral-800 to-neutral-900"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};
export default Sidebar;
