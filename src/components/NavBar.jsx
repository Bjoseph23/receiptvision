import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BarChartIcon from "@mui/icons-material/BarChart";
import PolicyIcon from "@mui/icons-material/Policy";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import UploadIcon from "@mui/icons-material/CloudUpload";
import InvoiceProcessor from "./InvoiceProcessor";
import LogoutPopup from "./LogoutPopup";
import CameraCapture from "../components/CameraCapture";  
import { useAuth } from "../contexts/AuthContext";
import supabase from "../components/supabaseClient";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showInvoiceProcessor, setShowInvoiceProcessor] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showCameraCapture, setShowCameraCapture] = useState(false);  // New state for CameraCapture popup
  const { signOut, user } = useAuth();

  const [userInfo, setUserInfo] = useState({ name: '' });

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  const confirmLogout = () => {
    setShowLogoutPopup(false);
    signOut();
  };

  const cancelLogout = () => {
    setShowLogoutPopup(false);
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from("auth.users")
            .select("name")
            .eq("id", user.id)
            .single();

          if (error) throw error;

          if (data) {
            setUserInfo({ name: data.name });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserInfo();
  }, [user]);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <DashboardIcon fontSize="large" />, path: "/dashboard" },
    { id: "expenditure", label: "Expenditure", icon: <MonetizationOnIcon fontSize="large" />, path: "/expenditure" },
    { id: "goals", label: "Financial Goals", icon: <ReceiptIcon fontSize="large" />, path: "/goals" },
    { id: "analytics", label: "Revenue Analytics", icon: <BarChartIcon fontSize="large" />, path: "/analytics" },
    { id: "terms", label: "Privacy Policy", icon: <PolicyIcon fontSize="large" />, path: "/terms" },
  ];

  return (
    <div className="flex m-0 p-0 pr-0">
      <div className={`${isOpen ? "w-64" : "w-20"} bg-gray-200 min-h-screen p-0 m-0 pt-8 pl-2 pr-2 relative duration-300 flex flex-col justify-between overflow-y-auto`}>
        <div className="absolute pl-1 top-2 left-3 ml-2 cursor-pointer p-2 pl-1.5" onClick={toggleNav}>
          <MenuIcon fontSize="large" />
        </div>

        {isOpen && (
          <div className="pl-3 mt-8 mb-4">
            <a href="/dashboard" className="text-xl font-bold">
              <span className="text-blue-600">Receipt</span>
              <span className="text-black">Vision</span>
            </a>
          </div>
        )}

        <div className="pt-2 flex items-center gap-x-4 mt-6 pl-3">
          <img
            className="w-12 h-12 rounded-full"
            src="https://excellence.truman.edu/files/2022/02/Photo-Placeholder-Image-150x150-1.jpg"
            alt="Profile"
          />
          {isOpen && <h1 className="text-xl font-bold whitespace-nowrap">{userInfo.name || 'User Name'}</h1>}
        </div>

        <ul className="pt-6 pr-1 pl-2 flex-grow">
          {menuItems.map((item) => (
            <NavLink
              to={item.path}
              key={item.id}
              className={({ isActive }) =>
                `relative flex items-center justify-start gap-x-4 p-2 cursor-pointer rounded-md 
                ${isActive ? "bg-blue-200 text-blue-900 font-bold" : "text-gray-600"} hover:bg-blue-50 transition-all duration-300`
              }
            >
              <span className="flex-shrink-0 text-xl">{item.icon}</span>
              {isOpen && <span className="origin-left duration-200">{item.label}</span>}
            </NavLink>
          ))}
        </ul>

        <div className="mt-6 pr-2 pl-1">
          <button
            className="flex items-center justify-start w-full gap-x-4 p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-900 transition-all duration-300"
            onClick={() => setShowCameraCapture(true)}  // Show CameraCapture popup
          >
            <ReceiptIcon fontSize="large" />
            {isOpen && <span className="font-bold">Scan Receipt with AI</span>}
          </button>

          <button
            className="flex items-center justify-start w-full gap-x-4 p-2 mt-2 rounded-xl bg-blue-200 text-blue-600 hover:bg-blue-400 transition-all duration-300"
            onClick={() => setShowInvoiceProcessor(true)}
          >
            <UploadIcon fontSize="large" />
            {isOpen && <span>Upload Document</span>}
          </button>
        </div>

        <div className="w-full px-4 pl-2">
          <ul>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `relative flex pl-2 items-center gap-x-4 pt-3 pb-2 cursor-pointer rounded-md 
                ${isActive ? "bg-blue-100 text-blue-800 font-bold" : "text-gray-600"} hover:bg-blue-50 transition-all duration-300`
              }
            >
              <SettingsIcon fontSize="large" />
              {isOpen && <span>Settings</span>}
            </NavLink>
            <div
              onClick={handleLogout}
              className="relative flex items-center gap-x-4 p-2 cursor-pointer rounded-md text-gray-600 hover:bg-blue-50 transition-all duration-300"
            >
              <LogoutIcon fontSize="large" />
              {isOpen && <span>Log Out</span>}
            </div>
          </ul>
        </div>
      </div>

      {showInvoiceProcessor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-xl font-bold">Scan Receipt</h2>
              <button
                onClick={() => setShowInvoiceProcessor(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <InvoiceProcessor />
            </div>
          </div>
        </div>
      )}

      {showLogoutPopup && <LogoutPopup onConfirm={confirmLogout} onCancel={cancelLogout} />}

      {showCameraCapture && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <CameraCapture onClose={() => setShowCameraCapture(false)} />  // CameraCapture popup
        </div>
      )}
    </div>
  );
};

export default NavBar;
