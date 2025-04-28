import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, Users, Package, DollarSign } from "lucide-react";
import { cn } from "../../utils/cn";

export const Navbar: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Dashboard", icon: <Home size={20} /> },
    { to: "/events", label: "Events", icon: <Calendar size={20} /> },
    { to: "/budget", label: "Budget", icon: <DollarSign size={20} /> },
    { to: "/vendors", label: "Vendors", icon: <Package size={20} /> },
    { to: "/attendees", label: "Attendees", icon: <Users size={20} /> },
  ];

  return (
    <nav className="bg-white border-r border-gray-200 h-full flex flex-col w-64 p-4">
      <div className="flex place-items-center mb-6">
        <Calendar className="text-primary-600 mr-2" size={28} />
        <h1 className="text-xl font-bold text-gray-900 my-auto">eventto</h1>
      </div>

      <div className="flex-1">
        <ul className="space-y-1">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === link.to
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}>
                <span className="mr-3">{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
