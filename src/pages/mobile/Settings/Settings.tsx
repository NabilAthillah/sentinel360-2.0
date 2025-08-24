import React from "react";
import {
  User,
  Key,
  ScanLine,
  Info,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNavBar from "../../../components/BottomBar";

const Settings = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: <User size={18} />, label: "Profile", path: "/user/settings/profile" },
    { icon: <Key size={18} />, label: "Change Password", path: "/user/settings/change-password" },
    { icon: <ScanLine size={18} />, label: "Scan Tag", path: "/scan-tag" },
    { icon: <Info size={18} />, label: "About", path: "/about" },
    { icon: <LogOut size={18} />, label: "Logout", path: "/logout" },
  ];

  return (
    <div className="min-h-screen bg-[#181D26] text-white p-4 flex flex-col pt-40 gap-3">
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={() => navigate(item.path)}  
          className="flex items-center justify-between p-1 rounded-md hover:bg-[#222630] transition py-3 w-full text-left"
        >
          <div className="flex items-center gap-3">
            {item.icon}
            <span className="text-sm">{item.label}</span>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>
      ))}
      <BottomNavBar />
    </div>
  );
};

export default Settings;
