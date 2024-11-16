import React from 'react';
import { Link } from 'react-router-dom';
import { FaApple, FaGooglePlay } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#1a3369]  text-white py-8 px-4 mt-60">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
        {/* Logo Section */}
        <div className="flex flex-col items-start">
          <h2 className="text-xl font-bold">Receipt<span className="text-blue-300">Vision</span></h2>
          <div className="mt-2">
            <p className="text-gray-400">EN</p>
          </div>
        </div>

        {/* Products Links */}
        <div className="space-y-2">
          <h3 className="font-semibold">Products</h3>
          <ul className="space-y-1">
            <li><Link to="/dashboard" className="hover:underline">Invoicing</Link></li>
            <li><Link to="/dashboard" className="hover:underline">Receipts</Link></li>
            <li><Link to="/dashboard" className="hover:underline">Reports</Link></li>
            <li><Link to="/dashboard" className="hover:underline">Accountants</Link></li>
          </ul>
        </div>

        {/* Tools Links */}
        <div className="space-y-2">
          <h3 className="font-semibold">Tools</h3>
          <ul className="space-y-1">
            <li><Link to="/dashboard" className="hover:underline">Revenue Simulator</Link></li>
            <li><Link to="/dashboard" className="hover:underline">Tax Calculator</Link></li>
            <li><Link to="/dashboard" className="hover:underline">Quote Template</Link></li>
          </ul>
        </div>

        {/* Help Links */}
        <div className="space-y-2">
          <h3 className="font-semibold">Help</h3>
          <ul className="space-y-1">
            <li><Link to="/dashboard" className="hover:underline">FAQ</Link></li>
            <li><Link to="/dashboard" className="hover:underline">Contact Us</Link></li>
            <li><Link to="/dashboard" className="hover:underline">Legal Document</Link></li>
            <li><Link to="/dashboard" className="hover:underline">Help Center</Link></li>
          </ul>
        </div>

        {/* Company Links */}
        <div className="space-y-2">
          <h3 className="font-semibold">Company</h3>
          <ul className="space-y-1">
            <li><Link to="/dashboard" className="hover:underline">About Us</Link></li>
            <li><Link to="/dashboard" className="hover:underline">Press</Link></li>
            <li><Link to="/dashboard" className="hover:underline">Security</Link></li>
            <li><Link to="/dashboard" className="hover:underline">Research</Link></li>
          </ul>
        </div>

        {/* App Store Icons */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <FaApple size={24} className="hover:text-gray-400 cursor-pointer" />
          <FaGooglePlay size={24} className="hover:text-gray-400 cursor-pointer" />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-600 mt-6 pt-4 text-gray-400 text-sm flex flex-col md:flex-row justify-between items-center">
        <div className="space-x-4">
          <a href="terms" className="hover:underline">Terms of Service</a>
          <a href="/terms" className="hover:underline">Privacy Policy</a>
        </div>
        <p className="mt-4 md:mt-0">&copy; 2024 Receiptvision, Inc. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
