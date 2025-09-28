import { useState, useEffect } from 'react';
import { useLoginMutation, useSignupMutation } from '../api/authApis'; 
import InputField from './InputField'; 
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface AuthProps {
    onAuthSuccess: (token: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const { 
        mutate: loginMutation, 
        isPending: isLoading, 
        isError: isLoginError, 
        error: loginError 
    } = useLoginMutation();

    const { 
        mutate: signupMutation, 
        isPending: isSignUpLoading, 
        isError: isSignUpError, 
        error: signUpError 
    } = useSignupMutation();

    // Compute API error
    const apiError = isLoginError
        ? loginError?.response?.data?.message || "Login failed. Please check your credentials."
        : isSignUpError
            ? signUpError?.response?.data?.message || "Signup failed. Please try again."
            : null;

    // Always prefer local error reset
    const currentError = localError ?? apiError;

    // Clear error when user types
    useEffect(() => {
        if (email || password || username) {
            setLocalError(null);
        }
    }, [email, password, username]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            loginMutation({ email, password }, {
                onSuccess: (token: any) => {
                    toast.success("Login successful!");
                    onAuthSuccess(token as string);
                },
                onError: (error: any) => {
                    setLocalError(error.response.data.message || error.message);
                    toast.error(error.response.data.message || "Login failed");
                }
            });
        } else {
            signupMutation({ username, password, email }, {
                onSuccess: () => {
                    toast.success("Signup successful! Please log in.");
                    setIsLogin(true);
                    setPassword('');
                    setEmail('');
                    setUsername('');
                },
                onError: (error: any) => {
                    console.error(error,'error');
                    setLocalError(error.message || "Signup failed");
                    toast.error(error.message || "Signup failed");
                }
            });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
                <h2 className="text-3xl font-extrabold text-center text-gray-900">
                    {isLogin ? 'Welcome Back!' : 'Join Us Today!'}
                </h2>
                <p className="text-center text-gray-600 text-sm">
                    {isLogin ? 'Log in to access your account' : 'Create an account to get started'}
                </p>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <InputField
                        id="email"
                        label="Email Address"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        disabled={isLoading || isSignUpLoading}
                        autoComplete="off"
                    />
                    {!isLogin && (
                        <InputField
                            id="username"
                            label="Username"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose a username"
                            disabled={isLoading || isSignUpLoading}
                            autoComplete="off"
                        />
                    )}

                    {/* Password field with eye icon */}
                    <div className="relative">
                        <InputField
                            id="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            disabled={isLoading || isSignUpLoading}
                            autoComplete={isLogin ? "current-password" : "new-password"}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {currentError && (
                        <p className="text-red-500 text-sm text-center">
                            {currentError}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full flex justify-center items-center px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-md hover:shadow-lg"
                        disabled={isLoading || isSignUpLoading}
                    >
                        {isLoading || isSignUpLoading ? (
                            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : null}
                        {isLoading || isSignUpLoading 
                            ? (isLogin ? 'Logging In...' : 'Signing Up...') 
                            : (isLogin ? 'Log In' : 'Sign Up')}
                    </button>
                </form>

                <div className="text-sm text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                        disabled={isLoading || isSignUpLoading}
                    >
                        {isLogin ? 'Need an account? Sign up' : 'Already have an account? Log in'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
