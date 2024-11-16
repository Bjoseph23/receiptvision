import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-white to-blue-50 text-center p-4">
            <div className="text-blue-600 font-bold text-9xl md:text-9xl sm:text-5xl">404</div>
            <div className="text-2xl md:text-4xl sm:text-lg font-semibold mt-4 text-gray-800">Page Not Found</div>
            <p className="text-gray-500 mt-2 max-w-md md:text-xl text-base sm:text-sm">
                Sorry, the page you're looking for does not exist or has been moved. Please go back to the Home page.
            </p>
            <button
                onClick={() => navigate('/dashboard')}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 text-base md:text-xl sm:text-sm"
            >
                Go back Home
            </button>

            {/* Plug Graphic */}
            <div className="relative mt-8 w-40 h-40 sm:w-32 sm:h-32 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center">
                        <svg
                            className="w-12 h-12 text-blue-600"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M14 2h-4v4h4V2zM6 10H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v-8zm14 0h-2v8h2a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2zM11 20h2v-3h-2v3z" />
                        </svg>
                    </div>
                </div>
                <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center">
                    <div className="border-t-4 border-blue-600 w-8 sm:w-6 absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2" />
                    <div className="border-b-4 border-blue-600 w-8 sm:w-6 absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2" />
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;
