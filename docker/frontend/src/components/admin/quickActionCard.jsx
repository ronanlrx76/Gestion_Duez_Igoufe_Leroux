import { NavLink } from 'react-router-dom';

export default function QuickActionCard({ title, description, icon, to, color }) {
    return (
        <NavLink to={to} className="group">
            <div className="bg-gray-800 hover:bg-gray-750 transition-all p-6 rounded-xl border border-gray-700 h-full group-hover:border-blue-500">
                <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                    {icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    {description}
                </p>
            </div>
        </NavLink>
    );
}
