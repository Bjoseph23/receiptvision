import React, { useState } from 'react';
import { TextField, Checkbox, IconButton, InputAdornment, Typography, Link, Box, Button } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import supabase from '../components/supabaseClient';
import zxcvbn from 'zxcvbn';
import signupImage from '../assets/signup-image.png';


const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleTogglePassword = () => setShowPassword(!showPassword);
    const handleToggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordStrength(zxcvbn(newPassword).score);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const { error: signUpError } = await signUp({
                email,
                password,
                options: { data: { name } },
            });

            if (signUpError) {
                throw new Error(signUpError.message);
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-full h-screen overflow-auto">
            {/* Left Section (Form) */}
            <div className="md:w-1/2 w-full flex items-center justify-center p-8">
                <form onSubmit={handleSubmit} className="w-full mt-10 max-w-md space-y-6">
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-800">Create an account</h2>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 text-red-500 bg-red-50 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {/* Name Field */}
                    <TextField
                        label="Name"
                        fullWidth
                        variant="outlined"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    {/* Email Field */}
                    <TextField
                        label="Email address"
                        type="email"
                        fullWidth
                        variant="outlined"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {/* Password Field */}
                    <TextField
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        variant="outlined"
                        required
                        value={password}
                        onChange={handlePasswordChange}
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

                    {/* Password Strength Bar */}
                    <div className="w-full h-2 bg-gray-300 rounded">
                        <div
                            className={`h-full rounded ${passwordStrength === 0
                                ? 'bg-red-500'
                                : passwordStrength === 1
                                    ? 'bg-orange-500'
                                    : passwordStrength === 2
                                        ? 'bg-yellow-500'
                                        : passwordStrength === 3
                                            ? 'bg-green-400'
                                            : 'bg-green-600'
                                }`}
                            style={{ width: `${(passwordStrength + 1) * 20}%` }}
                        ></div>
                    </div>

                    {/* Confirm Password Field */}
                    <TextField
                        label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        fullWidth
                        variant="outlined"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleToggleConfirmPassword} edge="end">
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <div className="flex items-center">
                        <hr className="flex-1 border-gray-700" />
                        <span className="mx-4 text-gray-700">OR</span>
                        <hr className="flex-1 border-gray-700" />
                    </div>



                    {/* Google Sign-Up Button */}
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleGoogleLogin}
                        className="px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
                    >
                        <img class="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo"></img>
                        <span>Sign Up with Google</span>
                    </Button>

                    {/* Terms of Use and Privacy Policy */}
                    <Typography variant="body2" className="text-gray-600 text-center md:text-lg">
                        By creating an account, you agree to our{' '}
                        <Link href="#" color="primary" underline="hover">Terms of use & Privacy Policy</Link>
                    </Typography>

                    {/* Simulated reCAPTCHA */}
                    <Box className="border border-gray-300 rounded-lg p-4 flex items-center">
                        <Checkbox color="primary" required />
                        <span className="text-gray-600 md:text-lg">I'm not a robot</span>
                        <Box className="ml-auto">
                            <img src="https://placehold.co/70x70?text=reCAPTCHA" alt="reCAPTCHA logo" />
                        </Box>
                    </Box>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full rounded-full text-white font-bold text-lg md:text-xl transform transition-transform duration-200 hover:scale-105"
                        style={{
                            background: 'linear-gradient(to right, #4A00E0, #8E2DE2)',
                            padding: '12px 0',
                            textTransform: 'none',
                        }}
                    >
                        Create account
                    </button>

                    {/* Login Link */}
                    <Typography variant="body2" className="text-center text-gray-600 mt-4 md:text-4xl ">
                        Already have an account?{' '}
                        <Link href="#" color="primary" underline="hover" onClick={() => navigate('/login')}>Log in</Link>
                    </Typography>
                </form>
            </div>

            {/* Right Section (Image with Overlay Text) */}
            <div className="relative md:w-1/2 w-full h-1/2 md:h-full h bg-gray-100 flex items-center justify-center order-first md:order-last">
                <img
                    src={signupImage}
                    alt="Person using laptop and calculator"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://placehold.co/720x720?text=Signup+Image"; }}
                />
                <div className="absolute top-8 left-8 md:top-1/4 md:left-1/4 p-4 text-left">
                    <div className="text-left">
                        <div className="text-5xl md:text-6xl font-bold text-gray-900">•</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2">
                            Welcome to <span className="text-blue-600">ReceiptVision</span>
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
