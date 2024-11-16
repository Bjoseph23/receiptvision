import React from 'react';

const ForgotPassword = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            {/* Card Container */}
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                {/* Logo and Heading */}
                <h2 className="text-3xl font-bold text-gray-800">
                    <span className="text-blue-600">Receipt</span>Vision
                </h2>
                
                {/* Subtitle */}
                <h3 className="mt-4 text-2xl font-semibold text-gray-700">Forgot Password?</h3>
                <p className="text-gray-500 mt-2">
                    Enter your email address to get the password reset link.
                </p>

                {/* Email Input */}
                <div className="mt-6">
                    <input
                        type="email"
                        placeholder="hello@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* Reset Password Button */}
                <button
                    type="button"
                    className="w-full mt-6 py-3 rounded-full font-semibold text-white"
                    style={{
                        background: 'linear-gradient(to right, #4A00E0, #8E2DE2)',
                        boxShadow: '0px 4px 10px rgba(78, 105, 212, 0.2)',
                    }}
                >
                    Reset Password
                </button>

                {/* Back to Login Link */}
                <p className="mt-4 text-gray-500">
                    <a href="/login" className="hover:underline text-blue-600">Back to login</a>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
