import React, { useState } from 'react';
import { TextField, Button, IconButton, Typography, Link, Divider } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import { useNavigate } from 'react-router-dom';
import supabase from '../components/supabaseClient';
import loginImage from '../assets/login-image.png';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleTogglePassword = () => setShowPassword(!showPassword);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError(null);
    };

    const insertUserIfNeeded = async (user) => {
        try {
            const { data: existingUser, error: fetchError } = await supabase
                .from('users')
                .select('id')
                .eq('id', user.id)
                .maybeSingle();

            if (fetchError) throw fetchError;

            if (!existingUser) {
                const { error: insertError } = await supabase
                    .from('users')
                    .upsert([
                        {
                            id: user.id,
                            email: user.email,
                            created_at: new Date().toISOString(),
                        }
                    ], {
                        onConflict: 'id'
                    });

                if (insertError) throw insertError;
            }

            return true;
        } catch (err) {
            console.error('User management error:', err);
            setError('Error managing user account');
            return false;
        }
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!formData.email || !formData.password) {
                throw new Error('Please fill in all fields');
            }

            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (signInError) throw signInError;

            if (data?.user) {
                const userCreated = await insertUserIfNeeded(data.user);
                if (!userCreated) {
                    throw new Error('Failed to create user profile');
                }
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/dashboard`
                }
            });

            if (error) throw error;

            if (data?.user) {
                await insertUserIfNeeded(data.user);
            }
        } catch (err) {
            console.error('Google login error:', err);
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-full">
            <div className="md:w-1/2 w-full h-1/2 md:h-full flex flex-col items-start justify-start bg-gray-100 p-6 relative">
                <div className="absolute inset-0">
                    <img
                        src={loginImage}
                        alt="Person holding laptop"
                        className="w-full h-full object-cover" // Ensure it covers the container without stretching
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover', // Keeps the aspect ratio without distortion
                            objectPosition: 'downwards' // Centers the image in the container
                        }}
                        onError={(e) => { e.target.src = "https://placehold.co/720x1040?text=Login+Image"; }}
                    />
                </div>
                <div className="relative z-10 text-left p-8 bg-opacity-75 mt-8 ml-8">
                    <div className="flex items-center space-x-2 mb-4 md:mb-8">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                        <h1 className="text-3xl font-bold text-white">
                            Snap, Scan, Simplify!
                        </h1>
                    </div>
                    <p className="text-white text-lg">
                        Track your spending and re-imagine budgeting. Powered by AI.
                    </p>
                </div>
            </div>

            <div className="md:w-1/2 w-full h-full flex items-center justify-center p-8">
                <form className="w-full max-w-md space-y-6" onSubmit={handleEmailLogin}>
                    <h2 className="text-3xl font-bold text-center text-gray-800">Receipt<span className="text-blue-600">Vision</span></h2>
                    <Typography variant="h5" className="text-center text-gray-600 mt-2 mb-4">
                        Login in
                    </Typography>

                    {error && (
                        <div className="p-3 text-red-500 bg-red-50 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleGoogleLogin}
                        className="px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
                    >
                        <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo"></img>
                        <span>Login with Google</span>
                    </Button>

                    <Divider className="my-4">OR</Divider>

                    <TextField
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                    />

                    <TextField
                        label="Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleTogglePassword} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <div className="text-right">
                        <Link href="/forgot-password" color="primary" underline="hover">
                            Forgot your password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-full text-white font-bold text-lg transform transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            background: 'linear-gradient(to right, #4A00E0, #8E2DE2)',
                            padding: '12px 0',
                            textTransform: 'none',
                        }}
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>

                    <Typography variant="body2" className="text-center text-gray-600 mt-4">
                        Don't have an account?{' '}
                        <Link href="/signup" color="primary" underline="hover">
                            Sign up
                        </Link>
                    </Typography>
                </form>
            </div>
        </div>
    );
};

export default Login;
